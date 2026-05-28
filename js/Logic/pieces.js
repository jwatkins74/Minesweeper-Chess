class Piece {
    constructor(team) {
        this.team =team;
        this.moved = false;
        this.type = "piece" 
        this.piece = null;
    }
}
export class King extends Piece {
    constructor(team) {
        super(team)
        this.piece = "king";
    }
}
export class Queen extends Piece {
    constructor(team) {
        super(team)
        this.piece = "queen";
    }
}
export class Bishop extends Piece {
    constructor(team) {
        super(team)
        this.piece = "bishop";
    }
}
export class Knight extends Piece {
    constructor(team) {
        super(team)
        this.piece = "knight";
    }
}
export class Rook extends Piece {
    constructor(team) {
        super(team)
        this.piece = "rook";
    }
}
export class Pawn extends Piece {
    constructor(team) {
        super(team)
        this.piece = "pawn";
    }
}