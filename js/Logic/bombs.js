import { mineColor } from '../Storage/debug.js';
import {mineProb} from '../Storage/settings.js'
import { state } from './state.js';
import { letters, whitePieces, blackPieces } from '../Storage/constants.js';


export function makeBombs(){
    for (let row = 3; row < 7; row++) {
        for (let column = 0; column < 8; column++) {
            if (Math.random() < mineProb) {
                let square = row + String.fromCharCode("a".charCodeAt(0)+column);
                state.bombs.push(square)
            }
        }
    }
}

export function showBombs() {
    for (let row = 3; row < 7; row++) {
        for (let column = 0; column < 8; column++) {
            let square = row + String.fromCharCode("a".charCodeAt(0)+column);
            if (square in state.bombs) {
                const bomb = document.getElementById(square);
                bomb.style.backgroundColor = mineColor;
            }
        }
    }
}   

function calculateMineNumber(row, column) {
    let bombCounter =0;
    for (let rowShift = -1; rowShift < 2; rowShift++) {
        for (let columnShift = -1; columnShift < 2; columnShift++) {
            if (row + rowShift > -1 && row+rowShift <  letters.length && column + columnShift > 0 && column+columnShift <  9) {
                if (state.bombs.includes((column+ columnShift) + letters[row + rowShift])) {
                    bombCounter = bombCounter + 1;
                }
            }
            
        }
    }
    return bombCounter
}


/**
 * Calculates numbers for second board
 */
export function calculateMineScores() {
    for (let row = 0; row < letters.length; row++) {
        for (let column = 1; column < 9;column++){
            const square = document.getElementById(column + letters[row])
            const sweeper = document.getElementById("" + column + (row + 1));
            if (state.turn == "white" && whitePieces.includes(square.textContent) 
                || state.turn == "black" && blackPieces.includes(square.textContent)) {
                sweeper.textContent = calculateMineNumber(row, column);
            } else {
                sweeper.textContent = "";
            }
        }
    }   
}

