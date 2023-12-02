import { Position, directionMap } from "./Position";
import { logger } from "./logger";


export abstract class Piece {
    player : number;
    position: Position;
    cached : directionMap;

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            this.player = player;
            this.cached = undefined;
        } catch(e){
            logger.warn(e.message);
        }
    }

    abstract getType(): string;

    abstract getMovements(): directionMap;

    getPosition(): Position {
        return this.position;
    }

    setPosition(pos : Position): void {
        this.position = pos; // The error handling has to be made with the board
        logger.debug(`setPosition to ${this.position.getColumn()} ${this.position.getRow()}`)
        this.cached = undefined;
    }

    getPlayer(): number {
        return this.player;
    }

    setCached(dir : directionMap = undefined): void {
        console.log("setCached")
        this.cached = dir;
    }

    getCached(): directionMap {
        logger.debug("returned cached position")
        return this.cached;
    }

    isCached() : boolean {
        logger.debug(`isCached ${this.cached !== undefined}`); 
        return this.cached !== undefined ? true : false;
    }
 }

class Pawn extends Piece {
    moved = false;
    getType(): string {
        return "P"
    }
    getMovements(): directionMap {
        return this.position.getPawnPositions(this.moved, this.player);
    }
}

class Knight extends Piece {
    getType(): string {
        return "N"
    }
    getMovements(): directionMap {
        return this.position.getKnightPositions()
    } 
}

class Queen extends Piece {
    getType(): string {
        return "Q"
    }
    getMovements():directionMap {
        return this.position.getDiagonalPositions().merge(this.position.getOrthogonalPositions());
    }
}

class Rook  extends Piece {
    getType(): string {
        return "R"
    }
    getMovements(): directionMap{
        return this.position.getOrthogonalPositions()
    }
}

class Bishop extends Piece {
    getType(): string {
        return "B"
    }
    getMovements(): directionMap {
        return this.position.getDiagonalPositions()

    }
}

class King extends Piece {
    // For the moment i'll ignore castling
    getType(): string {
        return "K"
    }
    getMovements(): directionMap {
        return this.position.getDiagonalPositions(1).merge(this.position.getOrthogonalPositions(1))
    }
}


export const pieceFactory : { [type: string] : (player: number, column: string, row:number ) => Piece } = {
    K: ( player: number, column: string, row:number ) => new King(player, column, row),
    Q: ( player: number, column: string, row:number ) => new Queen(player, column, row),
    N: ( player: number, column: string, row:number ) => new Knight(player, column, row),
    R: ( player: number, column: string, row:number ) => new Rook(player, column, row),
    P: ( player: number, column: string, row:number ) => new Pawn(player, column, row),
    B: ( player: number, column: string, row:number ) => new Bishop(player, column, row)
}

