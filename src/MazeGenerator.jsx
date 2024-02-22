import { useState } from "react";

import { Maze } from "./components/Maze";
import { generateMaze } from "./algorithms";

import "./styles/maze-generator.css";

const MazeGenerator = () => {
	const [tiles, setTiles] = useState (null);
	const [edges, setEdges] = useState (null);

	function handleSubmit (e) {
		e.preventDefault ();
		const nTiles = e.target.n_tiles.value;

		setTiles (parseInt (nTiles));
		setEdges (generateMaze (parseInt (nTiles)));
	}

	return (
		<main id="main-content">
			<h1 id="main-header">Maze Generator</h1>
			<section id="main-form-section">
				<form id="maze-generator-form" onSubmit={handleSubmit}>
					<table id="maze-generator-form-table">
						<tr>
							<td><label htmlFor="n_tiles">Select tiles per side</label></td>
							<td><input type="number" name="n_tiles" defaultValue={6} className="maze-gen-input" max={40} min={3}></input></td>
							<td><button type="submit" className="maze-gen-button">Generate</button></td>
						</tr>
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