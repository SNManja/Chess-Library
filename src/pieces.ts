import { logger } from "./logger";

enum Player {
    white = 0,
    black = 1
}

export class Position {
    column: string;
    row: number;
    
    
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
            logger.error(e.message);
        }
    }
    

    getRow() : number {
        return this.row;
    }

    getColumn() : string  {
        return this.column;
    }

    getForMatrix() : number[] {
        let res = [0,0];
        res[0] = this.column.charCodeAt(0) - "a".charCodeAt(0);
        res[1] = this.row-1
        return res
    }
    compareValue(): number { // This function maps into the position into a value to be compared against another position.
        // We have from a-h and as a secondary value 1-8
        return ((this.column.charCodeAt(0)-"a".charCodeAt(0)+1)*10  + this.row)
    }

    // diagonal positions 
    getDiagonalPositions(len : number = 8): Position[] {
        let res : Position[] = [];

        let pp : Position[] = []; // plus plus
        let pm : Position[] = []; // plus minus
        let mp : Position[] = []; // minus plus
        let mm : Position[] = []; // minus minus

        for(let i : number = 1; i <= len; i++) {

            // This part is strange, but it serves a purpose. 
            // If the value is defined it will be pushed MANTAINING ORDER
            let aux = movementCalculator(this,i,i)
            aux != undefined ? pp.push(aux) : undefined;

            aux = movementCalculator(this,i,-i)
            aux != undefined ? pm.push(aux) : undefined;

            aux = movementCalculator(this,-i,i)
            aux != undefined ? mp.unshift(aux) : undefined;

            aux = movementCalculator(this,-i,-i)
            aux != undefined ? mm.unshift(aux) : undefined;

           
        }
        res = res.concat(mm).concat(mp).concat(pm).concat(pp)  

        return res
    }

    // orthogonal positions 
    getOrthogonalPositions(len : number = 8): Position[] {
        let res : Position[] = [];

        let right : Position[] = []; // plus plus
        let up : Position[] = []; // plus minus
        let down : Position[] = []; // minus plus
        let left : Position[] = []; // minus minus

        for(let i : number = 1; i <= len; i++) {

            // This part is strange, but it serves a purpose. 
            // If the value is defined it will be pushed MANTAINING ORDER
            let aux : Position= movementCalculator(this,i,0)
            console.log("pos: ", movementCalculator(this,i,0))
            aux != undefined ? right.push(aux) : undefined;

            aux = movementCalculator(this,0,i)
            aux != undefined ? up.push(aux) : undefined;

            aux = movementCalculator(this,0,-i)
            aux != undefined ? down.unshift(aux) : undefined;

            aux = movementCalculator(this,-i,0)
            aux != undefined ? left.unshift(aux) : undefined;

           
        }
        res = res.concat(left).concat(down).concat(up).concat(right)  
        return res
    }

    getPawnPositions(moved : boolean, player : number) : Position[]{
        let selector : number;
        player == 1 ? selector = -1 : selector = 1; // Selector determines player
        let res : Position[] = []
        let aux;
        if(moved) {
            aux = movementCalculator(this,0,selector*2)
            aux != undefined ? res.push(aux) : undefined;
        }

        aux = movementCalculator(this,0,selector)
        aux != undefined ? res.push(aux) : undefined;

        aux = movementCalculator(this,1,selector*1)
        aux != undefined ? res.push(aux) : undefined;

        aux = movementCalculator(this,-1,selector*1)
        aux != undefined ? res.push(aux) : undefined;

        return res;
    }
}

export abstract class Piece {
    player : number;
    position: Position;

    constructor(player: number, column: string, row : number ) {
        try{
            this.position = new Position(column, row);
            this.player = player;
        } catch(e){
            logger.warn(e.message);
        }
    }

    abstract getType(): string;

    abstract getMovements():Position[];

    getPosition(): Position {
        return this.position;
    }

    setPosition(position : Position): void {
        try{
            if(this.getMovements().includes(position)){
                this.position = position;
            } else {
                throw new Error("Invalid position")
            }
        } catch (e){
            logger.error(e.message)
        }
    }

    getPlayer(): number {
        return this.player;
    }
 }

class Pawn extends Piece {
    moved = false;
    getType(): string {
        return "P"
    }
    getMovements(): Position[] {
        return this.position.getPawnPositions(this.moved, this.player);
    }
}

class Knight extends Piece {
    getType(): string {
        return "N"
    }
    getMovements(): Position[] {
        let possibleMovements : Position[] = []
        // We know that the knight can do 2 to up down left right and 1 to the sides
        const combinations =  [[2,1],[2,-1],[-2,1],[-2,-1]]
        /* [col, row] */
        for (const calc of combinations) {
            let moveColRow = movementCalculator(this.position, calc[0], calc[1])
            let moveRowCol = movementCalculator(this.position, calc[1], calc[0])
            moveColRow != undefined ? possibleMovements.push(moveColRow) : undefined; 
            moveRowCol != undefined ? possibleMovements.push(moveRowCol) : undefined;
        }

        return possibleMovements
    } 
}

class Queen extends Piece {
    getType(): string {
        return "Q"
    }
    getMovements(): Position[] {
        return this.position.getDiagonalPositions().concat(this.position.getOrthogonalPositions()) // Would be great to return it sorted
    }
}

class Rook  extends Piece {
    getType(): string {
        return "R"
    }
    getMovements(): Position[] {
        return this.position.getOrthogonalPositions()
    }
}

class Bishop extends Piece {
    getType(): string {
        return "B"
    }
    getMovements(): Position[] {
        return this.position.getDiagonalPositions()
    }
}

class King extends Piece {
    // For the moment i'll ignore castling
    getType(): string {
        return "K"
    }
    getMovements(): Position[] {
        return this.position.getDiagonalPositions(1).concat(this.position.getOrthogonalPositions(1))
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

// Dado una posicion, avanza tantos valores en filas y columnas
function movementCalculator(pos : Position, col : number, row : number) {
    
    let newRow = pos.getRow() + row;
    let newColumn = String.fromCharCode((pos.getColumn().charCodeAt(0) - col));
    console.log("aa why " + newColumn);
    console.log(newRow);
   
    if((newColumn >= "a" && newColumn <= "h") && (newRow >= 1 && newRow <= 8)){

        let newPosition : Position = new Position(newColumn, newRow)
        return newPosition
    }     
    return undefined;
}