import { state } from "./state.js";
//Check spaces for team, empty, or bomb
export function whatsInSpace(pos) {
    if (! onBoard(pos)) return false;
    const spot = state.board[pos[0]][pos[1]];
    if (spot ===null)           return "empty";
    if ( spot.type == "piece")  return "piece";
    if (spot.type == "bomb")    return "bomb";
}

export function canAttack(pos, team) {
    if (! onBoard(pos)) return false;
    const spot = state.board[pos[0]][pos[1]];
    if (spot && spot.type == "piece" && spot.team != team) return true;
    return false;
}
export function onBoard(pos) {
    if (pos[0] >= 0 && pos[0] <= 7 && pos[1] >= 0 && pos[1] <= 7 ) return true;
    return false;
}
export function canMove(pos, team) {
    if (! onBoard(pos)) return false;
    if (whatsInSpace(pos) == "empty" || whatsInSpace(pos) == "bomb" || canAttack(pos, team)) return true;
    return false;
}

//Grid uses letters - this converts to numbers
export function lettersToNumbers (pos) {
    switch(pos[1]) {
        case "a":
            return [pos[0] , 0];
        case "b":
            return [pos[0] , 1];
        case "c":
            return [pos[0] , 2];
        case "d":
            return [pos[0] , 3];
        case "e":
            return [pos[0] , 4];
        case "f":
            return [pos[0] , 5];
        case "g":
            return [pos[0] , 6];
        case "h":
            return [pos[0] , 7];
    }
}

//Grid uses letters - this converts to numbers
export function numbersToLetters (pos) {
    console.log(pos[1])
    switch(pos[1]) {
        case 0:
            return [pos[0] , "a"];
        case 1:
            return [pos[0] , "b"];
        case 2:
            return [pos[0] , "c"];
        case 3:
            return [pos[0] , "d"];
        case 4:
            return [pos[0] , "e"];
        case 5:
            return [pos[0] , "f"];
        case 6:
            return [pos[0] , "g"];
        case 7:
            return [pos[0] , "h"];
    }
}