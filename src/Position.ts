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
        try {
            return ((this.column.charCodeAt(0)-"a".charCodeAt(0)+1)*10  + this.row)
        } catch(e) {
            console.error("compareValue error: " + e.message);
        }
    }

    static compareValueToPosition(value: number){
        try {
            if(value > 88) throw new Error("Compare value out of bounds");
            let column = String.fromCharCode(Math.floor(value/10)  + "a".charCodeAt(0) - 1);
            let row = (value % 10);
            //console.log("This is the column:", column, "this is the row", row)
            let res = new Position(column, row)
            return res;
        } catch (e) {
            console.log("Position compareValueToPosition error: " + e.message);
        }
    }


    
}


// Dado una posicion, avanza tantos valores en filas y columnas


export { Position };

