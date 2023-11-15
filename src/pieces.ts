import { logger } from "../logger";

enum Player {
    white = 0,
    black = 1
}
type PositionCoordinates = string & {
    length: 2; // Ensures the string is exactly 2 characters long
    0: string; // First character must be a letter
    1: string; // Second character must be a number
  };

class Position {
    row: number ;
    column: string ;
    
    constructor(column: string, row: number){
        try {
            if(!(column >= "a" && column <= "h")){
                throw new Error("Invalid column: " + column);
            } else if (!(row >= 1 && row <= 8)){
                throw new Error("Invalid row: " + row);
            }
            this.row = row;
            this.column = column;
        } catch(e){
            this.row = undefined;
            this.column = undefined;
            logger.warn(e.message);
        }
    }


    getRow() : number {
        return this.row;
    }

    getColumn() : string  {
        return this.column;
    }
}

interface Piece {
    type : string;
    player : Player;
    position: Position;

    getMovements() : Position[];
    getPosition() : Position;
    setPosition(Position) : void;
}

class Pawn implements Piece {
    type: string;
    player: Player;
    position: Position;
    moved: boolean

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }
    getPosition(): Position {
        throw new Error("Method not implemented.");
    }

    getMovements(): Position[] {
        let possibleMovements : Position[] = []
        // This is a piece that can be moved only to the front. So it depends in the player
        // List of things to have in mind:
        // - What pieces do the pawn have in front
        // - If its pawn's first move 
        // - If the pawn can eat a piece (only side movement)
        // - in passant. Or however its spelled

        // This will probably be the last piece to implement. Its the hardest by a great margin
        return possibleMovements;
    }
    setPosition(): void {
        throw new Error("Method not implemented.");
    }
    
}

class Knight implements Piece {
    position: Position;
    type: string;
    player: Player;

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }
    getPosition(): Position {
        return this.position;
    }
    
    getMovements(): Position[] {
        let possibleMovements : Position[] = []
        // We know that the knight can do 2 to up down left right and 1 to the sides
        const combinations =  [[2,1],[2,-1],[-2,1],[-2,-1]]
        /* [col, row] */
        for (const calc of combinations) {
            let move = movementCalculator(this.position, calc[0], calc[1])
            if(move == undefined){
                continue;
            }
            combinations.push(move);
        }
        /* [row, col] */
        for (const calc of combinations) {
            let move = movementCalculator(this.position, calc[1], calc[0])
            if(move == undefined){
                continue;
            }
            combinations.push(move);
        }
        return possibleMovements
    }
    setPosition(position : Position): void {
        if(this.getMovements().includes(position)){
            this.position = position;
        }

        throw new Error("Method not implemented.");
    }
    
}

class Rook implements Piece {
    position: Position;
    type: string;
    player: Player;

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }
    getPosition(): Position {
        throw new Error("Method not implemented.");
    }
    
    getMovements(): Position[] {
        throw new Error("Method not implemented.");
    }
    setPosition(): void {
        throw new Error("Method not implemented.");
    }
    
}

class Bishop implements Piece {
    position: Position;
    type: string;
    player: Player;

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }
    getPosition(): Position {
        throw new Error("Method not implemented.");
    }
    
    getMovements(): Position[] {
        throw new Error("Method not implemented.");
    }
    setPosition(): void {
        throw new Error("Method not implemented.");
    }
    
}

class Queen implements Piece {
    position: Position;
    type: string;
    player: Player;

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }
    getPosition(): Position {
        throw new Error("Method not implemented.");
    }
   
    getMovements(): Position[] {
        throw new Error("Method not implemented.");
    }
    setPosition(): void {
        throw new Error("Method not implemented.");
    }
    
}

class King implements Piece {
    position: Position;
    type: string;
    player: Player;
    
    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }
    getPosition(): Position {
        throw new Error("Method not implemented.");
    }

    getMovements(): Position[] {
        throw new Error("Method not implemented.");
    }
    setPosition(): void {
        throw new Error("Method not implemented.");
    }
    
}

export const pieceFactory : { [type: string] : (player: number, column: string, row:number ) => Piece } = {
    K: (player: number, column: string, row:number ) => new King(player, column, row),
    Q: (player: number, column: string, row:number ) => new Queen(player, column, row),
    N: (player: number, column: string, row:number ) => new Knight(player, column, row),
    R: (player: number, column: string, row:number ) => new Rook(player, column, row),
    P: (player: number, column: string, row:number ) => new Pawn(player, column, row),
    B: (player: number, column: string, row:number ) => new Bishop(player, column, row)
}

function movementCalculator(pos : Position, col : number, row : number) {
    let newRow = pos.getRow() + row;
    let newColumn = (parseInt(pos.getColumn()) - col).toString();
    let newPosition
    try{
        newPosition = new Position(newColumn, newRow)
    } catch(e){
        newPosition = undefined;
        console.debug("Out of bounds: "+ newColumn+newRow.toString())
    }        
    return newPosition
}