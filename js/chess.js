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

    revertColors()
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
    let id = spot.id;
    let selectedPiece = spot.textContent;
    if (selectedPiece != ""){
        state.oldSelected.style.backgroundColor = clickColor;

        //White
        if ( selectedPiece =="♙") {
            //forward moves
            if (id[0] == 2) {
                state.possibleMove = document.getElementById("3" + id[1])
                if (empty(state.possibleMove)) {
                    colorpossibleMoves(state.possibleMove, "white")
                    state.possibleMove = document.getElementById("4" + id[1]);
                    if (empty(state.possibleMove)) {
                        colorpossibleMoves(state.possibleMove, "white")
                    }
                }
            } else {
                state.possibleMove = document.getElementById((Number(id[0]) +1) + id[1])
                if (empty(state.possibleMove)) {
                    colorpossibleMoves(state.possibleMove, "white")
                }
            }

            //side attacks
            if (id[1] != "a"){
                state.possibleMove = document.getElementById((Number(id[0]) +1) + String.fromCharCode(id[1].charCodeAt(0)-1));
                state.piece = state.possibleMove.textContent;
                if (blackPieces.includes(state.piece)) {
                    state.possibleMove.style.backgroundColor = enemyColor;
                }
            }
            if (id[1] != "h"){
                state.possibleMove = document.getElementById((Number(id[0]) +1) + String.fromCharCode(id[1].charCodeAt(0)+1));
                state.piece = state.possibleMove.textContent;
                if (blackPieces.includes(state.piece)) {
                    state.possibleMove.style.backgroundColor = enemyColor;
                }
            }
        }
        if ( selectedPiece =="♖") {
            allDirections(id, "white", [[1,0],[-1,0],[0,1],[0,-1]], false);
        }
        if ( selectedPiece =="♘") {
            for (let i = -2; i < 3; i++) {
                if (i==0){
                    continue;
                }
                if (i > 1 || i < -1) {
                    let curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)+1);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'white')

                    curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)-1);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'white')
                } else {
                    let curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)+2);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'white')

                    curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)-2);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'white')
                }

            }
        }
        if ( selectedPiece =="♗") {
            allDirections(id, "white", [[1,1],[-1,1],[1,-1],[-1,-1]], false);
        }
        if ( selectedPiece =="♕") {
            allDirections(id, "white", [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]], false);
        }
        if ( selectedPiece =="♔") {
            allDirections(id, "white", [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]], true);
        }


        //Black
        if (selectedPiece == "♟") {
            if (id[0] == 7) {
                state.possibleMove = document.getElementById("6" + id[1])
                if (empty(state.possibleMove)) {
                    state.possibleMove.style.backgroundColor = emptyColor;
                    state.possibleMove = document.getElementById("5" + id[1]);
                    if (empty(state.possibleMove)) {
                        state.possibleMove.style.backgroundColor = emptyColor;
                    }
                }
            } else {
                state.possibleMove = document.getElementById((Number(id[0]) -1) + id[1])
                if (empty(state.possibleMove)) {
                    state.possibleMove.style.backgroundColor = emptyColor;
                }
            }

            //side attacks
            if (id[1] != "a"){
                state.possibleMove = document.getElementById((Number(id[0]) -1) + String.fromCharCode(id[1].charCodeAt(0)-1));
                state.piece = state.possibleMove.textContent;
                if (whitePieces.includes(state.piece)) {
                    state.possibleMove.style.backgroundColor = enemyColor;
                }
            }
            if (id[1] != "h"){
                state.possibleMove = document.getElementById((Number(id[0]) -1) + String.fromCharCode(id[1].charCodeAt(0)+1));
                state.piece = state.possibleMove.textContent;
                if (whitePieces.includes(state.piece)) {
                    state.possibleMove.style.backgroundColor = enemyColor;
                }
            }
        }
        if (selectedPiece == "♜") {
            allDirections(id, "black", [[1,0],[-1,0],[0,1],[0,-1]], false);
        }
        if (selectedPiece == "♞") {
            for (let i = -2; i < 3; i++) {
                if (i==0){
                    continue;
                }
                if (i > 1 || i < -1) {
                    let curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)+1);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'black')

                    curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)-1);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'black')
                } else {
                    let curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)+2);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'black')

                    curr = (Number(id[0]) +i) + String.fromCharCode(id[1].charCodeAt(0)-2);
                    state.possibleMove = document.getElementById(curr);
                    colorpossibleMoves(state.possibleMove, 'black')
                }

            }
        }
        if (selectedPiece == "♝") {
            allDirections(id, "black", [[1,1],[-1,1],[1,-1],[-1,-1]], false);
        }
        if (selectedPiece == "♛") {
            allDirections(id, "black", [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]], false);
        }
        if (selectedPiece == "♚") {
            allDirections(id, "black", [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]], true);
        }
    }
    
}
/**
 * This uses colorMove to highlight all tiles for a piece given its directions, doesnt work for knight or pawn 
 * @param {string} spot The current location of the piece
 * @param {string} team The team of the chessboard TODO: We can just have black passed in depending on the piece instead of manual input
 * @param {number[][]} directions The Directions,[move1:[vertical,horizontal],move2...[]] ex: [[0,1],[-1,1]] -> piece can only move right and down-right 
 * @param {boolean} slow - tue means piece can only move one in the direction
 */
function allDirections(spot, team, directions, slow) {
    if (!spot) {
        return;
    }
    for (let i = 0; i < directions.length; i++) {
        let vertDirection = directions[i][0];
        let horDirection = directions[i][1];
        let nextPost = (Number(spot[0]) + vertDirection)+ String.fromCharCode(spot[1].charCodeAt(0)+horDirection);
        let nextEle = document.getElementById(nextPost);
        if (slow) {
            colorpossibleMoves(nextEle, team);
            
        } else {
            while (colorpossibleMoves(nextEle, team)) {
                nextPost = (Number(nextPost[0]) + vertDirection)+ String.fromCharCode(nextPost[1].charCodeAt(0)+horDirection);
                nextEle = document.getElementById(nextPost);
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
function colorpossibleMoves(spot, team) {
    if (!spot) {
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
 * Checks if tile is empty
 * @param {*} spot The current place on the board we're checking
 * @returns True if spot is empty, false else.
 */
function empty(spot) {
    return spot.textContent.length == 0 && spot != null;
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