import PropTypes from "prop-types";

import "../styles/components/maze.css";

import MouseSVG from "/maze-elements/mouse.svg";
import CheeseSVG from "/maze-elements/cheese.svg";
import HappyMouseSVG from "/maze-elements/happy-mouse.svg";

import { useEffect, useRef, useState } from "react";
import { RIGHT, DOWN, LEFT, UP } from "../algorithms/mazeFeatures"

function getElementSvg (element) {
	let icon;

	switch (element) {
		case "mouse":
			icon = MouseSVG;
			break;

		case "cheese":
			icon = CheeseSVG;
			break;

		case "happymouse":
			icon = HappyMouseSVG;
			break;

		default:
			icon = MouseSVG;
			break;
	}

	return icon;
}

export const Maze = ({ tiles, edges, elements, loading }) => {
	const { cheese } = elements;

	const [ mouse, setMouse ] = useState (elements.mouse);
	const [ win, setWin ] = useState (false);
	const mazeRef = useRef (null);
	
	useEffect (() => {
		setMouse (elements.mouse);
		setWin (false);

		if (mazeRef.current) mazeRef.current.focus ();
	}, [ elements ]);

	useEffect (() => {
		if (mouse === cheese) {
			setWin (true);
		}
	}, [mouse, cheese]);

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

	function handleInput (event) {
		event.preventDefault ();
		
		if (win) return;
		if (Object.keys (elements).length === 0) return;

		const keyCode = event.keyCode;

		switch (keyCode) {
			case 39:		// Right
				if (edges[mouse][RIGHT] !== -1) {
					setMouse (mouse + 1);
				}
				break;
			case 40:		// Down
				if (edges[mouse][DOWN] !== -1) {
					setMouse (mouse + tiles);
				}
				break;
			case 37:		// Left
				if (edges[mouse][LEFT] !== -1) {
					setMouse (mouse - 1);
				}
				break;
			case 38:		// Up
				if (edges[mouse][UP] !== -1) {
					setMouse (mouse - tiles);
				}
				break;
		}
	}

	console.log (mouse, cheese);
	return (
		<div id="maze-container" style={generateGrid ()} onKeyDownCapture={handleInput} tabIndex="0" ref={mazeRef}>
			{
				edges.map ((edge, idx) => {
					let element = null;
					if (idx === mouse) element = win ? "happymouse" : "mouse";
					if (idx === cheese) element = "cheese"
					if (idx === cheese && idx === mouse) element = "happymouse"

					return <Tile 
								key={idx}
								right={edge[0] !== -1}
								down={edge[1] !== -1}
								left={edge[2] !== -1}
								up={edge[3] !== -1}
								positionX={(idx % tiles + 1)}
								positionY={Math.floor (idx / tiles) + 1}
								element={element}
							/>
				})
			}
			{
				loading && (
					<div className="maze-loader">Loading...</div>
				)
			}
		</div>
	);
};

Maze.propTypes = {
	tiles: PropTypes.number,
	edges: PropTypes.array,
	elements: PropTypes.object,
	loading: PropTypes.bool
};

const Tile = ({ right, down, left, up, positionX, positionY, element}) => {
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
			{
				!!element && <img src={getElementSvg (element)} alt={""}/>
			}
		</div>
	)
}

Tile.propTypes = {
	right: PropTypes.bool,
	down: PropTypes.bool,
	left: PropTypes.bool,
	up: PropTypes.bool,
	positionX: PropTypes.number,
	positionY: PropTypes.number,
	element: PropTypes.string
};