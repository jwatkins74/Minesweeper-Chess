import { canAttack, canMove, onBoard, whatsInSpace } from "./board.js"
import { newPos } from "./helperFunctions.js"

export function pawnMove(pos, team) {
    let moves = []
    let direction = 0
    let doubleMove = false
    if (team == "white") {
        direction = -1
        if (pos[0] == 6) {
            doubleMove = true
        }
    } else {
        direction = 1
        if (pos[0] == 1) {
            doubleMove = true
        }
    }
    //Check foward moves
    let nextSpace = [pos[0] + direction, pos[1]]
    if ( whatsInSpace(nextSpace) == "bomb" || whatsInSpace(nextSpace) == "empty" ) {
        moves.push( nextSpace)

        // Check second move
        let secondid = [nextSpace[0] + direction, pos[1]]
        if (doubleMove && ( whatsInSpace(secondid) == "bomb" || whatsInSpace(secondid) == "empty" )) {
            moves.push( secondid)
        }

    }
    //left attack
    if (pos[1] > 0 ) {
        nextSpace = [pos[0] + direction, pos[1] - 1]
        if (canAttack(nextSpace, team))
            moves.push( nextSpace)
    }
    //Right attack
    if (pos[1] < 7 ) {
        nextSpace = [pos[0] + direction, pos[1] + 1]
        if (canAttack(nextSpace, team))
            moves.push( nextSpace)
    }
    return moves;
}
export function knightMove(pos, team) {
    let return1 = [];
    const moves = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
    for (const move of moves) {
        let space = [pos[0] + move[0], pos[1] + move[1]];
        if (canMove(space, team)) return1.push(space);
    }
    return return1;
}

export function kingMove(pos, team) {
    let return1 = [];
    const moves = [[0, 1], [0, -1], [1, 0], [-1, 0], [-1, 1], [-1, -1], [1, -1], [1, 1]];
    for (const move of moves) {
        let space = [pos[0] + move[0], pos[1] + move[1]];
        if (canMove(space, team)) return1.push(space);
    }
    return return1
}
export function queenMove(pos, team) {
    let return1 = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [-1, 1], [-1, -1], [1, -1], [1, 1]];
    for (const direction of directions) {
        return1.push(...line(direction, pos, team));
    }
    return return1;
}
export function bishopMove(pos, team) {
    let return1 = [];
    const directions = [[-1, 1], [-1, -1], [1, -1], [1, 1]];
    for (const direction of directions) {
        return1.push(...line(direction, pos, team));
    }
    return return1;
}
export function rookMove(pos, team) {
    let return1 = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const direction of directions) {
        return1.push(...line(direction, pos, team));
    }
    return return1;
}
//Helper function - moving in direction
function line(direction, pos, team) {
    let return1 = []
    let nextSpot = [...pos]
    while (true) {
        nextSpot = newPos(nextSpot, direction);
        if (! onBoard(nextSpot)) break;
        if (canMove(nextSpot, team)) {
            return1.push(nextSpot);
            if (canAttack(nextSpot, team)) break;
        }
        else break;
    }
    return return1
}
