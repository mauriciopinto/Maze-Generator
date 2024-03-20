import { useEffect, useState } from "react";

import { Maze } from "./components/Maze";
import { generateMaze } from "./algorithms";

import "./styles/maze-generator.css";

const MazeGenerator = () => {
	const [tiles, setTiles] = useState (null);
	const [algorithm, setAlgorithm] = useState (1);
	const [mode, setMode] = useState (1);
	const [elements, setElements] = useState ({});
	const [ maxTiles, setMaxTiles ] = useState (40);
	const [ loading, setLoading ] = useState (false);

	const [edges, setEdges] = useState (null);

	useEffect (() => {
		setMaxTiles (mode === 1 ? 40 : 25);
	}, [ mode ])

	function handleSubmit (e) {
		e.preventDefault ();

		setLoading (true);
		setTimeout (() => {
			const nTiles = e.target.n_tiles.value;
			const algorithm = e.target.algorithm.value;

			setTiles (parseInt (nTiles));
			
			generateMaze (parseInt (nTiles), parseInt (algorithm), parseInt (mode))
			.then (([edges, elements]) => {
				setEdges (edges);
				setElements (elements);
				setLoading (false);
			});
		}, 0);
	}

	return (
		<main id="main-content">
			<h1 id="main-header">Maze Generator</h1>
			<section id="main-form-section">
				<form id="maze-generator-form" onSubmit={handleSubmit}>
					<table id="maze-generator-form-table">
						<tbody>
							<tr>
								<td><label htmlFor="algorithm">Select algorithm</label></td>
								<td>
									<select value={algorithm} name="algorithm" className="maze-gen-input" onChange={(e) => setAlgorithm (e.target.value)}>
										<option value={1}>Random walls</option>
										<option value={2}>Random walls by highest degree</option>
									</select>
								</td>
							</tr>
							<tr>
								<td><label htmlFor="game">Select mode</label></td>
								<td>
									<select value={mode} name="game" className="maze-gen-input" onChange={(e) => setMode (e.target.value)}>
										<option value={1}>Classic (find exit)</option>
										<option value={2}>Mouse and cheese</option>
									</select>
								</td>
							</tr>
							<tr>
								<td><label htmlFor="n_tiles">Select tiles per side</label></td>
								<td><input type="number" name="n_tiles" defaultValue={6} className="maze-gen-input" max={maxTiles} min={3}></input></td>
							</tr>
							<tr>
								<td><button type="submit" className="maze-gen-button">Generate</button></td>
							</tr>
						</tbody>
					</table>
					
				</form>
			</section>

			<section id="main-maze-section">
				<Maze
					tiles={tiles}
					edges={edges}
					elements={elements}
					loading={loading}
				/>
			</section>
			
		</main>
	);
}

export default MazeGenerator;