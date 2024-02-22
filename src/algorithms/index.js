import { generateFCGraph, bfs } from "./graph"

export function generateMaze (dimensions) {
	let idx, idxValue, vertex, edgeIdx, edgeVertex;
	const edges = generateFCGraph (dimensions)
	const availableEdges = Array (2 * dimensions * dimensions - 2 * dimensions);

	for (let i = 0; i < availableEdges.length; i++) availableEdges[i] = i;

	while (availableEdges.length > 0) {
		/* Select a random edge */
		idx = Math.floor (Math.random () * availableEdges.length);
		idxValue = availableEdges[idx];

		/* Remove edge */
		vertex = Math.floor ((idxValue + Math.floor (idxValue / (dimensions * 2 - 1))) / 2);
		edgeIdx = ((idxValue % 2) + (Math.floor (idxValue / (dimensions * 2 - 1)) % 2)) % 2;
		edgeVertex = edges[vertex][edgeIdx];
		
		if (edgeVertex === -1) {
			availableEdges.splice (idx, 1);
			continue;
		}

		edges[vertex][edgeIdx] = -1;
		edges[edgeVertex][(edgeIdx + 2) % 4] = -1;
		
		/* If removing the edge made the graph bipartite */
		if (!bfs (edges, 0)) {
			/* Undo remove of last edge */
			edges[vertex][edgeIdx] = edgeVertex;
			edges[edgeVertex][(edgeIdx + 2) % 4] = vertex;
		}

		availableEdges.splice (idx, 1);
	}


	/*  */
	return edges;
}