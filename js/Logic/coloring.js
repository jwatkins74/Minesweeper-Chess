//This file is for changing the colors of tiles

/**
 * This changes back the color of all tiles
 */
function revertColors() {
    for (let i = 0; i < letters.length; i++) {
        for (let ii = 1; ii < 9;ii++){
            const curr = document.getElementById(ii + letters[i])
                if (mineVis && state.bombs.includes(curr.id)) {
                    curr.style.backgroundColor = mineColor;
                }else if (curr.className == "a") {
                    curr.style.backgroundColor = aColor;
                } else {
                    curr.style.backgroundColor = bColor;
                }
        }
    }
}

/**
 * This colors all possible moves for a piece after clicking on it.
 * @param {*} spot The current place on the board we're checking
 * @param {*} team The team of the chessboard TODO: We can just have black passed in depending on the piece instead of manual input
 * @returns Whether the piece would be able to move further in that direction. If false, then the piece 
 * will continue checking further spots in that direction to see if they are valid moves.
 */
export function colorpossibleMoves(spot, team) {
    if (!spot || !team) {
        return false;
    }
    if (empty(spot)) {
        spot.style.backgroundColor = emptyColor;
        return true;
    }
    else if (team == "black" && whitePieces.includes(spot.textContent)) {
        spot.style.backgroundColor = enemyColor;
    }
    else if (team == "white" && blackPieces.includes(spot.textContent)) {
        spot.style.backgroundColor = enemyColor;
    }
    return false;
}