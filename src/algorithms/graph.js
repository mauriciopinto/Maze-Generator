/* The maze will initially look like a fully connected
	graph whose vertices are positioned exactly on
	each tile. So for example, an initial maze (no walls)
	of dimension 4 would look like:
	O - O - O - O
	|     |     |     |
	O - O - O - O
	|     |     |     |
	O - O - O - O
	|     |     |     |
	O - O - O - O */
export function generateFCGraph (dimensions) {
	const nTiles = dimensions * dimensions;
	let graph = new Array (nTiles);

	for (let i = 0; i < graph.length; i++) {
		/* edges are in order [right, down, left, up] */
		graph[i] = [-1, -1, -1, -1];
	}
	
	/* Draw edges. Edges are represented by numbers,
		which contain the vertex that it connects to. Each
		vertex has 4 edges:
		0 = edge to the vertex to the right
		1 = edge to the vertex directly down
		2 = edge to the vertex to the left
		3 = edge to the vertex directly up */
	for (let i = 0; i < nTiles; i++) {
		/* No horizontal edges on the last column */
		if (i % dimensions !== dimensions - 1) {
			graph[i][0] = i + 1;
			graph[i + 1][2] = i;
		}
		/* No vertical edges on the last row */
		if (i < dimensions * (dimensions - 1)) {
			graph[i][1] = i + dimensions;
			graph[i + dimensions][3] = i;
		}
	}

	return graph;
}

export function bfs (edges, start) {
	let traversed = new Array (edges.length);
	
	for (let i = 0; i < traversed.length; i++) traversed[i] = false;

	function _bfs (start) {
		if (traversed[start] === true) return;

		traversed[start] = true;

		for (let i = 0; i < edges[start].length; i++) {
			if (edges[start][i] === -1) continue;

			_bfs (edges[start][i]);
		}
	}

	_bfs (start);

	let notBipartite = true;
	for (let i = 0; i < traversed.length; i++) {
		notBipartite &= traversed[i];
	}

	if (notBipartite === false) {
		traversed = new Array ();
	}

	return notBipartite;
}