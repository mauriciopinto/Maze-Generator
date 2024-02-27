export const RIGHT = 0;
export const DOWN = 1;
export const LEFT = 2;
export const UP = 3;

export function createEntranceAndExit (dimensions, edges) {
	let entranceVertex, exitSide, exitPosition, exitVertex;
	
	const minDistance = dimensions / 2;
	const entranceSide = Math.floor (Math.random () * 4);
	const entrancePosition = Math.floor (Math.random () * dimensions);

	switch (entranceSide) {
		case RIGHT:
			entranceVertex = edges[dimensions * (entrancePosition + 1) - 1];
			entranceVertex[RIGHT] = -2;

			exitSide = [DOWN, LEFT, UP][Math.floor (Math.random () * 3)];

			/* If the exit side is left */
			if (exitSide === LEFT) {
				exitPosition = Math.floor (Math.random () * dimensions);
				exitVertex = dimensions * exitPosition;
				edges[exitVertex][LEFT] = -2;			// Open left edge
			} else {
				exitPosition = Math.floor (Math.random () * (dimensions - minDistance));
				exitVertex = exitSide === UP ? 
					exitPosition :					// Case when exit side is up
					dimensions * (dimensions - 1) + exitPosition;	// Case when exit side is down
				edges[exitVertex][exitSide] = -2	// Open up or down edge
			}

			break;

		case DOWN:
			entranceVertex = edges[dimensions * (dimensions - 1) + entrancePosition];
			entranceVertex[DOWN] = -2;

			exitSide = [RIGHT, LEFT, UP][Math.floor (Math.random () * 3)];

			/* If the exit side is up */
			if (exitSide === UP) {
				exitPosition = Math.floor (Math.random () * dimensions);
				exitVertex = exitPosition;
				edges[exitVertex][UP] = -2;			// Open up edge
			} else {
				exitPosition = Math.floor (Math.random () * (dimensions - minDistance)) + 1;
				exitVertex = exitSide === RIGHT ? 
					dimensions * exitPosition - 1 :					// Case when exit side is right
					dimensions * (exitPosition - 1);	// Case when exit side is left
				edges[exitVertex][exitSide] = -2	// Open right or left edge
			}

			break;

		case LEFT:
			entranceVertex = edges[entrancePosition * dimensions];
			entranceVertex[LEFT] = -2;

			exitSide = [RIGHT, DOWN, UP][Math.floor (Math.random () * 3)];

			/* If the exit side is right */
			if (exitSide === RIGHT) {
				exitPosition = Math.floor (Math.random () * dimensions) + 1;
				exitVertex = dimensions * exitPosition - 1;
				edges[exitVertex][RIGHT] = -2;			// Open right edge
			} else {
				exitPosition = Math.floor (Math.random () * (dimensions - minDistance) + minDistance);
				exitVertex = exitSide === UP ? 
					exitPosition :					// Case when exit side is up
					dimensions * (dimensions - 1) + exitPosition;	// Case when exit side is down
				edges[exitVertex][exitSide] = -2	// Open up or down edge
			}

			break;

		case UP:
			entranceVertex = edges[entrancePosition];
			entranceVertex[UP] = -2;

			exitSide = [RIGHT, DOWN, LEFT][Math.floor (Math.random () * 3)];

			/* If the exit side is down */
			if (exitSide === DOWN) {
				exitPosition = Math.floor (Math.random () * dimensions);
				exitVertex = (dimensions * (dimensions - 1)) + exitPosition;
				edges[exitVertex][DOWN] = -2;			// Open down edge
			} else {
				exitPosition = Math.floor (Math.random () * (dimensions - minDistance) + minDistance) + 1;
				exitVertex = exitSide === RIGHT ? 
					dimensions * exitPosition - 1 :					// Case when exit side is right
					dimensions * (exitPosition - 1);	// Case when exit side is left
				edges[exitVertex][exitSide] = -2	// Open right or left edge
			}

			break;
	}
}