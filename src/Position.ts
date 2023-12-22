import { logger } from "./logger";
/*
Important to note. Possible directions depend on positions.
*/



class Position {
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

    compareValue(): number { // This function maps into the position into a value to be compared against another position.
        // We have from a-h and as a secondary value 1-8
        return ((this.column.charCodeAt(0)-"a".charCodeAt(0)+1)*10  + this.row)
    }

}


// Dado una posicion, avanza tantos valores en filas y columnas
function movementCalculator(pos : Position, col : number, row : number) {
    
    let newRow = pos.getRow() + row;
    let newColumn = String.fromCharCode((pos.getColumn().charCodeAt(0) - col));
   
    if((newColumn >= "a" && newColumn <= "h") && (newRow >= 1 && newRow <= 8)){

        let newPosition : Position = new Position(newColumn, newRow)
        return newPosition
    }     
    return undefined;
}


export { Position, movementCalculator };

