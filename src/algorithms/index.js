import { generateFCGraph, bfs } from "./graph"
import { createEntranceAndExit, RIGHT, DOWN, LEFT, UP } from "./mazeFeatures";

export function generateMaze (dimensions, algorithm) {
	let maze;

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

	return maze;
}

function generateStandardMaze (dimensions) {
	let idx, idxValue, vertex, edgeIdx, edgeVertex;
	const edges = generateFCGraph (dimensions);
	const availableEdges = new Array (2 * dimensions * dimensions - 2 * dimensions);

	for (let i = 0; i < availableEdges.length; i++) availableEdges[i] = i;

	while (availableEdges.length > 0) {
		/* Select a random edge */
		idx = Math.floor (Math.random () * availableEdges.length);
		idxValue = availableEdges[idx];

		/* Remove edge */
		vertex = Math.floor ((idxValue + Math.floor (idxValue / (dimensions * 2 - 1))) / 2);

		/* Formula for calculating the vertex is slightly different on last row */
		if (idxValue >= (2 * dimensions - 1) * (dimensions - 1)) {
			vertex = (dimensions * (dimensions - 1)) + (idxValue - ((2 * dimensions - 1) * (dimensions - 1)));
		}

		edgeIdx = ((idxValue % 2) + (Math.floor (idxValue / (dimensions * 2 - 1)) % 2)) % 2;

		/* If vertex is at last row or last column, only one direction is available */
		if (vertex % dimensions === dimensions - 1) {
			edgeIdx = DOWN;
		} else if (vertex >= dimensions * (dimensions - 1)) {
			edgeIdx = RIGHT;
		}

		edgeVertex = edges[vertex][edgeIdx];
		
		if (edgeVertex === -1) {
			availableEdges.splice (idx, 1);
			continue;
		}

		edges[vertex][edgeIdx] = -1;
		edges[edgeVertex][(edgeIdx + 2) % 4] = -1;
		
		/* If removing the edge made the graph bipartite */
		if (!bfs (edges, 0)) {
			console.log ("undoing removal of " + idxValue);
			/* Undo remove of last edge */
			edges[vertex][edgeIdx] = edgeVertex;
			edges[edgeVertex][(edgeIdx + 2) % 4] = vertex;
		}

		availableEdges.splice (idx, 1);
	}

	createEntranceAndExit (dimensions, edges);

	return edges;
}

function generateMazeNoCrossroads (dimensions) {
	const edges = generateFCGraph (dimensions);
	let maxDegree = 3;
	let verticesByDegree = [[], [], [], []];

	for (let i in edges) {
		const degree = (+(edges[i][RIGHT] >= 0) + (edges[i][DOWN] >= 0) + (edges[i][LEFT] >= 0) + (edges[i][UP] >= 0)) - 1;

		verticesByDegree[degree].push ({
			idx: i,
			edges: edges[i].map ((edge, idx) => edge >= 0 && {direction: idx, value: edge}).filter (edge => edge),
			degree: degree
		});
	}

	while (verticesByDegree.length > 0) {
		const idxInDegreeList = Math.floor (Math.random () * verticesByDegree[maxDegree].length);
		const vertex = verticesByDegree[maxDegree][idxInDegreeList];
		const edgeIdx = Math.floor (Math.random () * vertex.edges.length);
		const edge = vertex.edges[edgeIdx];

		/* Attempt to remove edge */
		edges[vertex.idx][edge.direction] = -1;
		edges[edge.value][(edge.direction + 2) % 4] = -1;

		/* If removal made graph bipartite, undo */
		if (!bfs (edges, 0)) {
			edges[vertex.idx][edge.direction] = edge.value;
			edges[edge.value][(edge.direction + 2) % 4] = vertex.idx;
			vertex.degree++;
		}

		/* Remove from list of removable edges */
		vertex.edges.splice (edgeIdx, 1);
		vertex.degree--;

		/* Relocate vertex according to degree */
		verticesByDegree[maxDegree].splice (idxInDegreeList, 1);
		
		if (vertex.edges.length > 0) {
			verticesByDegree[vertex.degree].push (vertex);
		}
		
		if (verticesByDegree[maxDegree].length === 0) {
			verticesByDegree.splice (maxDegree, 1);
			maxDegree--;
		}
	}

	createEntranceAndExit (dimensions, edges);

	return edges;
}