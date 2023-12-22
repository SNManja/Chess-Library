import { logger } from "./logger";


export abstract class Piece {
    player : number;

    constructor(player: number) {
        try{
            this.player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }

    abstract getType(): string;

    getPlayer(): number {
        return this.player;
    }

 }

class Pawn extends Piece {
    moved = false;
    getType(): string {
        return "P"
    }

}

class Knight extends Piece {
    getType(): string {
        return "N"
    }
}

class Queen extends Piece {
    getType(): string {
        return "Q"
    }
}

class Rook  extends Piece {
    moved : boolean = false;
    getType(): string {
        return "R"
    }

    setMoved() {
        this.moved = true;
    }

    hasMoved() : boolean {
        return this.moved;
    }
}

class Bishop extends Piece {
    getType(): string {
        return "B"
    }
}

class King extends Piece {
    moved : boolean = false;
    getType(): string {
        return "K"
    }

    setMoved() {
        this.moved = true;
    }

    hasMoved() : boolean {
        return this.moved;
    }
}


export const pieceFactory : { [type: string] : (player: number) => Piece } = {
    K: ( player: number ) => new King(player),
    Q: ( player: number ) => new Queen(player),
    N: ( player: number ) => new Knight(player),
    R: ( player: number ) => new Rook(player),
    P: ( player: number ) => new Pawn(player),
    B: ( player: number ) => new Bishop(player)
}

export { King, Rook };

