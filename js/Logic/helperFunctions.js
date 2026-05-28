//Combines two cords (pos + direction) 
export function newPos(position, direction) {
    return [position[0] +direction[0], position[1] + position[1]];
}