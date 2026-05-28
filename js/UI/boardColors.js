import { numbersToLetters, whatsInSpace } from "../Logic/board.js";
import { emptyColor, enemyColor } from "../Storage/settings.js";

export function highlightSquares(squares) {
    for (const square of squares) {
        let id = numbersToLetters(square);
        console.log(id)
        id = String( 8 -id[0]) + String(id[1]);
        const curr = document.getElementById(id)
        if (whatsInSpace(square) == "piece") {
            curr.style.backgroundColor = enemyColor;
        } else {
            curr.style.backgroundColor = emptyColor;
        }
    }
}