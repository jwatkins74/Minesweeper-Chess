/*
Notes:
Later, we could implement Monte Carlo for robot logic, but that's WAY in the future
For future note: consider object-oriented approach booo

Thigns to fix/add:
-Future- Add one player (Ai will be hard to make), Add online?
*/

import {pieces, letters, whitePieces, blackPieces} from './Storage/constants.js';
import {mineVis, mineColor} from './Storage/debug.js';
import {enemyColor, emptyColor, clickColor,aColor,bColor} from './Storage/settings.js'
import { calculateMineScores } from './Logic/bombs.js';
import {state} from './Logic/state.js'
import { start } from './Logic/start.js';
import { lettersToNumbers } from './Logic/board.js';
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from './Logic/moves.js';
import { colorpossibleMoves } from './Logic/coloring.js';
import { highlightSquares } from './UI/boardColors.js';

//setup
start()

// Shows the player's turn
const msgDisplay = document.getElementById("turnMessages");
msgDisplay.textContent = `${state.turn}'s turn.`;

//View Mines
const viewMines = document.getElementById("viewMines");
viewMines.onmouseenter =  function(){
    calculateMineScores()
    mineBoard.style.display = "block";
};
viewMines.onmouseleave = function() {
    mineBoard.style.display = "none";
}

//Board Swapping
const mineBoard = document.getElementById("mineboard");
mineBoard.style.display="none";

//-------------------------------------------------------------------------------------------------------------------

const flipButton = document.getElementById("flip");
flipButton.addEventListener("click", function(event) {
    state.flipOn = !state.flipOn; //toggle flip feature

    if (state.flipOn) {
        flipButton.textContent = "Flip is on!"
        if (state.turn == "black") flip();

    } else { //when flip is "off", toggle to initial state
        flipButton.textContent = "Flip is off!"
        if (state.flipped) flip();
    }
});

    /**
 * Function to flip tiles
 * @param {*} piece Piece to be moved
 * @returns If move is valid.
 */
function flip() {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    for (let i = 0; i < letters.length; i++) {
        for (let ii = 1; ii < 9;ii++){
            const curr = document.getElementById(ii + letters[i])
            const curr3 = document.getElementById(""+ ii + (i+1))
            if (state.flipped) {
                curr.style.transform="rotate(0deg)";
                curr3.style.transform="rotate(0deg)";
            } else {
                curr.style.transform = "rotate(180deg)";
                curr3.style.transform="rotate(180deg)";
            }
            
        }
    }
    if (state.flipped) {
        mineBoard.style.transform = "rotate(0deg)";
        board.style.transform = "rotate(0deg)";
        state.flipped = false;
    } else {
        mineBoard.style.transform = "rotate(180deg)";
        board.style.transform = "rotate(180deg)";
        state.flipped = true;
    }
}
//-------------------------------------------------------------------------------------------------------------------
//Board Stuff

const board = document.getElementById("board");



board.addEventListener("click", function(event) {
    //If we select board instead of tile, or game is over, do nothing
    if (event.target == board || state.gameOver) {
        return;
    }


    //If we click a spot that was a valid move, move the piece (bombs)
    // if (event.target.style.backgroundColor == emptyColor || event.target.style.backgroundColor ==enemyColor) {
    if (avaliableMove(event.target)) {
        if (!turnflag(state.oldSelected.textContent)) {
            alert(`It is ${state.turn}'s turn!`)
            return;
        }
        //This means we are good to swap!

        //swap turn
        if (state.turn == "white") {
            state.turn = "black";
        } else {
            state.turn = "white";
        }
        msgDisplay.textContent = `${state.turn}'s turn.`;

        //Blow up if goes to mine
        if (state.bombs.includes(event.target.id)){

            pieceExplosion(event.target);

            //If King blows up
            if (state.oldSelected.textContent == pieces[5][0]) {alert("Black Wins!!!"); state.gameOver = true;}
            if (state.oldSelected.textContent == pieces[5][1]) {alert("White Wins!!!"); state.gameOver = true;}


            state.oldSelected.textContent = "";
            let index = state.bombs.findIndex(spot => mine(spot, event.target.id));
            state.bombs.splice(index, 1);
            revertColors();
            if (state.flipOn) {
                flip();
            }
            return
        }
        //Sets new tile character to move piece and remove the old piece
        state.oldpiece = event.target.textContent
        event.target.textContent = state.oldSelected.textContent
        state.oldSelected.textContent = ""

        //Handle Pawn Promotion
        if (event.target.textContent == "♙" && event.target.id[0] == "8"){
            event.target.textContent = promotePawn("white");
        }
        if (event.target.textContent == "♟" && event.target.id[0] =="1"){
            event.target.textContent = promotePawn("black");
        }
        revertColors()


        //Check checkmate
        if (state.oldpiece == "♔"){
            alert("Black Wins!!!");
            state.gameOver = true;
            if (state.flipped) {
                flip();
            }
        } else if (state.oldpiece == "♚") {
            alert("White Wins!!!");
            state.gameOver = true;
            if (state.state.flipped) {
                flip();
            }
        } else {
            if (state.flipOn) {
                flip();
            }
            
        }
        return;
    }

    //revertColors()
    state.oldSelected = event.target;
    

    //If we select a piece, we want to highlight moves
    highlightMoves(event.target);
    });
//-------------------------------------------------------------------------------------------------------------------
//Functions
/**
 * This determines the piece - sends directions to allDirections()
 * @param {*} spot The current location of the piece
 */
function highlightMoves(spot) {
    if (!spot) {
        return;
    }
    let square = converttoLogicArr(lettersToNumbers(spot.id));

    let piece = state.board[square[0]][square[1]];
    let team = piece.team;
    let spaces = [];
    switch (piece.piece) {
        case "king":
            spaces = kingMove(square, team);
            break;
        case "queen":
            spaces = queenMove(square, team);
            break;
        case "pawn":
            spaces = pawnMove(square, team);
            break;
        case "knight":
            spaces = knightMove(square, team);
            break;
        case "bishop":
            spaces = bishopMove(square, team);
            break;
        case "rook":
            spaces = rookMove(square, team);
            break;
    }
    highlightSquares(spaces);
    
}
function converttoLogicArr(pos) {
    return [8 - pos[0], pos[1]]

}



function avaliableMove(spot) {
    return spot.style.backgroundColor == emptyColor || spot.style.backgroundColor == enemyColor;
}
/**
 * Function needed to check where an array holds the value target
 * @param {*} spot The array input
 * @param {*} target The target
 * @returns If the target is found
 */
function mine(spot, target) {
    return spot == target;
}
/**
 * Function to check if piece can be moved, based on turn order
 * @param {*} piece Piece to be moved
 * @returns If move is valid.
 */
function turnflag(piece) {
    if (state.turn == "white" && whitePieces.includes(piece)) {
        return true;
    }else if (state.turn == "black" && blackPieces.includes(piece)) {
        return true;
    }
    return false;
}
/**
 * Promotes a pawn to another piece using browser alerts
 * TODO: Implement proper GUI later
 * @param {*} team The team of the current pawn being replaced
 * @returns The new piece the pawn will be replaced with.
 */
function promotePawn(team) {
    if (team == "white") team = 0;
    else team = 1;
    let piece = "none";
    while (!(blackPieces.includes(piece) || whitePieces.includes(piece))) {
        let choice = prompt("What new piece would you like to select?").toLowerCase();
        switch (choice){
            case "pawn": return pieces[0][team];
            case "rook": return pieces[1][team];
            case "knight": return pieces[2][team];
            case "bishop": return pieces[3][team];
            case "queen": return pieces[4][team];
            case "king": return pieces[5][team];
            default: alert("Invalid Choice!");
        }
    }
}


// ANIMATIONS (Yes I know I should move this to a separate file)

function pieceExplosion(chessPiece) {
    var id = null;
    clearInterval(id) //stop any current animations
    let timer = 0;
    length = 50;
    id = setInterval(explodeTile, 35); //animate the frame shaking
    function explodeTile() {
        //base case
        if (timer == length) {
            clearInterval(id);
            revertColors()
            
        } else {
            if (timer % 2 == 0) chessPiece.style.backgroundColor = "yellow"; 
            else chessPiece.style.backgroundColor = "red"; 
        }
        timer++;
    } 
    avaliableMove(chessPiece);
}

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