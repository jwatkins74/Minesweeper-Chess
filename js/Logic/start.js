import { makeBombs, showBombs } from "./bombs.js";
import { mineVis } from "../Storage/debug.js";
import { state } from "./state.js";
import {Rook, Pawn, Queen, Bishop, King, Knight} from "./pieces.js"
export function start() {
    
    //Resets board
    state.board = 
    [
        [new Rook("black"), new Knight("black"), new Bishop("black"), new Queen("black"), new King("black"), new Bishop("black"), new Knight("black"), new Rook("black")],
        [new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black"), new Pawn("black")],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white"), new Pawn("white")],
        [new Rook("white"), new Knight("white"), new Bishop("white"), new Queen("white"), new King("white"), new Bishop("white"), new Knight("white"), new Rook("white")],
        
    ]

    //Makes new bombs
    makeBombs()
    if (mineVis) {
        showBombs()
    }


}
