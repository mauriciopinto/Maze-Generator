import { generateFCGraph, bfs } from "./graph"
import { createEntranceAndExit, RIGHT, DOWN, LEFT, UP, spawnMouseAndCheese } from "./mazeFeatures";

export async function generateMaze (dimensions, algorithm, mode) {
	let maze;
	let elements = {};

	switch (algorithm) {
		case 1:
			maze = generateStandardMaze (dimensions);
			break;

		case 2:
			maze = generateMazeNoCrossroads (dimensions);
			break;

		default:
			maze = generateStandardMaze (dimensions);
			break;
	}

	switch (mode) {
		case 1:
			createEntranceAndExit (dimensions, maze);
			break;
		
		case 2:
			elements = spawnMouseAndCheese (dimensions, maze);
			break;

		default:
			createEntranceAndExit (dimensions, maze);
			break;
	}

	return [maze, elements];
}

/* Algorithm that removes random edges */
function generateStandardMaze (dimensions) {
	let idx, edge, vertex, direction, edgeVertex;
	const edges = generateFCGraph (dimensions);
	const availableEdges = new Array (2 * dimensions * dimensions - 2 * dimensions);

	for (let i = 0; i < availableEdges.length; i++) availableEdges[i] = i;

	while (availableEdges.length > 0) {
		/* Select a random edge */
		idx = Math.floor (Math.random () * availableEdges.length);
		edge = availableEdges[idx];

		/* Calculate idx of the vertex */
		vertex = Math.floor ((edge + Math.floor (edge / (dimensions * 2 - 1))) / 2);

		/* Formula for calculating the vertex is slightly different on last row */
		if (edge >= (2 * dimensions - 1) * (dimensions - 1)) {
			vertex = (dimensions * (dimensions - 1)) + (edge - ((2 * dimensions - 1) * (dimensions - 1)));
		}

		/* Calculate the direction of the edge */
		direction = ((edge % 2) + (Math.floor (edge / (dimensions * 2 - 1)) % 2)) % 2;

		/* If vertex is at last row or last column, only one direction is available */
		if (vertex % dimensions === dimensions - 1) {
			direction = DOWN;
		} else if (vertex >= dimensions * (dimensions - 1)) {
			direction = RIGHT;
		}

		edgeVertex = edges[vertex][direction];
		
		/* If there is no edge in the direction, remove it and move to next iteration */
		if (edgeVertex === -1) {
			availableEdges.splice (idx, 1);
			continue;
		}

		/* Logically remove the edge */
		edges[vertex][direction] = -1;
		edges[edgeVertex][(direction + 2) % 4] = -1;
		
		/* If removing the edge made the graph bipartite */
		if (!bfs (edges, 0)) {
			/* Undo remove of last edge */
			edges[vertex][direction] = edgeVertex;
			edges[edgeVertex][(direction + 2) % 4] = vertex;
		}

		/* Physically remove the edge from list of available edges */
		availableEdges.splice (idx, 1);
	}

	return edges;
}

/* Algorithm that removes edges giving priority to high-degree vertices */
function generateMazeNoCrossroads (dimensions) {
	let idxInDegreeList, edge, vertex, edgeIdx;
	const edges = generateFCGraph (dimensions);
	
	/* Create 4 lists, one for each degree */
	let verticesByDegree = [[], [], [], []];
	let maxDegree = 3;

	/* Populate the degree lists with vertices */
	for (let i = 0; i < edges.length; i++) {
		const degree = (+(edges[i][RIGHT] >= 0) + (edges[i][DOWN] >= 0) + (edges[i][LEFT] >= 0) + (edges[i][UP] >= 0)) - 1;

		verticesByDegree[degree].push ({
			idx: i,
			edges: edges[i].map ((edge, idx) => edge >= 0 && {direction: idx, value: edge}).filter (edge => edge),
			degree: degree
		});
	}

	/* While there are vertices with available edges: */
	while (verticesByDegree.length > 0) {
		idxInDegreeList = Math.floor (Math.random () * verticesByDegree[maxDegree].length);
		vertex = verticesByDegree[maxDegree][idxInDegreeList];
		edgeIdx = Math.floor (Math.random () * vertex.edges.length);
		edge = vertex.edges[edgeIdx];

		/* Attempt to remove edge */
		edges[vertex.idx][edge.direction] = -1;
		edges[edge.value][(edge.direction + 2) % 4] = -1;

		/* If removal made graph bipartite, undo */
		if (!bfs (edges, 0)) {
			edges[vertex.idx][edge.direction] = edge.value;
			edges[edge.value][(edge.direction + 2) % 4] = vertex.idx;
			vertex.degree++;
		}

		/* Remove from vertex's edges */
		vertex.edges.splice (edgeIdx, 1);
		vertex.degree--;

		/* Relocate vertex according to degree */
		verticesByDegree[maxDegree].splice (idxInDegreeList, 1);
		
		/* If the vertex has no more available edges, delete it */
		if (vertex.edges.length > 0) {
			verticesByDegree[vertex.degree].push (vertex);
		}
		
		/* If removing the vertex made the list empty, delete the list and reduce maxDegree */
		if (verticesByDegree[maxDegree].length === 0) {
			verticesByDegree.splice (maxDegree, 1);
			maxDegree--;
		}
	}

	return edges;
}