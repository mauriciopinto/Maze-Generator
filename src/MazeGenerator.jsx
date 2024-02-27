import { useState } from "react";

import { Maze } from "./components/Maze";
import { generateMaze } from "./algorithms";

import "./styles/maze-generator.css";

const MazeGenerator = () => {
	const [tiles, setTiles] = useState (null);
	const [algorithm, setAlgorithm] = useState (1);

	const [edges, setEdges] = useState (null);

	function handleSubmit (e) {
		e.preventDefault ();
		const nTiles = e.target.n_tiles.value;
		const algorithm = e.target.algorithm.value;

		setTiles (parseInt (nTiles));
		setEdges (generateMaze (parseInt (nTiles),parseInt (algorithm)));
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
								<td><label htmlFor="n_tiles">Select tiles per side</label></td>
								<td><input type="number" name="n_tiles" defaultValue={6} className="maze-gen-input" max={40} min={3}></input></td>
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
				/>
			</section>
			
		</main>
	);
}

export default MazeGenerator;