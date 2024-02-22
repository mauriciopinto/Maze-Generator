import PropTypes from "prop-types";

import "../styles/components/maze.css";

export const Maze = ({ tiles, edges }) => {
	function generateGrid () {
		return {
			display: "grid",
			gridTemplateRows: `repeat(${tiles}, 1fr)`,
			gridTemplateColumns: `repeat(${tiles}, 1fr)`,
			width: `${tiles * 40}px`
		}
	}
	
	if (!edges || edges.length === 0) {
		return <></>;
	}

	return (
		<div id="maze-container" style={generateGrid ()}>
			{
				edges.map ((edge, idx) => {
					return <Tile 
								key={idx}
								right={edge[0] !== -1}
								down={edge[1] !== -1}
								left={edge[2] !== -1}
								up={edge[3] !== -1}
								positionX={(idx % tiles + 1)}
								positionY={Math.floor (idx / tiles) + 1}
							/>
				})
			}
		</div>
	);
};

Maze.propTypes = {
	tiles: PropTypes.number,
	edges: PropTypes.array
};

const Tile = ({ right, down, left, up, positionX, positionY}) => {
	function drawTileInGrid () {
		return {
			gridRow: `${positionY}`,
			gridColumn: `${positionX}`,
			borderRight: right ? "none" : "4px solid black",
			borderBottom: down ? "none" : "4px solid black",
			borderLeft: left ? "none" : "4px solid black",
			borderTop: up ? "none" : "4px solid black"
		};
	}

	return (
		<div className="maze-tile" style={drawTileInGrid()}>
			
		</div>
	)
}

Tile.propTypes = {
	right: PropTypes.bool,
	down: PropTypes.bool,
	left: PropTypes.bool,
	up: PropTypes.bool,
	positionX: PropTypes.number,
	positionY: PropTypes.number
};