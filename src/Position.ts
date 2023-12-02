import { logger } from "./logger";

/*
Important to note. Possible directions depend on positions.
*/


class directionMap {
    map : Record<direction, Position[]>;

    constructor(){
        this.map = {
            "upRight": [],
            "upLeft": [],
            "downRight": [],
            "downLeft": [],
            "up": [],
            "down": [],
            "left": [],
            "right": [],
            "knight": [],
        }
    }

    public set(key : direction, value : Position[]){
        this.map[key] = value;
    }

    public push(key:direction, value : Position){
        this.map[key].push(value)
    }

    public get(key : direction) : Position[]{
        try{
            if(this.map[key] == undefined){
                throw new Error("Direction do not exist")
            } else {
                return this.map[key]
            }
        } catch (err){ 
            logger.error(err.message)
        }
    }

    public merge(x : directionMap){
            
        let dirs : Iterable<direction> = this.keys()

        for(const k of dirs){
            if (this.map[k].length < x.map[k].length) this.map[k] = x.map[k];
        }
        return this
    }

    public copy () : directionMap {
        let res = new directionMap();
        let dirs : Iterable<direction> = this.keys()
        for(const k of dirs){
            this.map[k] = res.map[k];
        }
        return res
    }
    
    public keys() : Iterable<direction>{
        return Array.from([
            "up" ,"down" ,"right","left","upLeft","upRight","downLeft","downRight","knight"
        ])
    }

    public validatePosition(pos : Position) : boolean {
        for (const k of this.keys()){
            for(let elem of this.get(k)){
                if (elem.compareValue() == pos.compareValue()) {
                    return true 
                }
            }
            
        }
        return false;
    }
}

type direction = 
     "up" 
    |"down" 
    |"right"
    |"left"
    |"upLeft"
    |"upRight"
    |"downLeft"
    |"downRight"
    |"knight"; 



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
    getDiagonalPositions(len : number = 8): directionMap {
 

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
            aux != undefined ? mp.push(aux) : undefined;

            aux = movementCalculator(this,-i,-i)
            aux != undefined ? mm.push(aux) : undefined;

        }

        let res : directionMap =  new directionMap();

        res.set("upRight",pp)
        res.set("upLeft",mp)
        res.set("downRight",pm)
        res.set("downLeft",mm)

        return res;
    }

    // orthogonal positions 
    getOrthogonalPositions(len : number = 8): directionMap {

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
            aux != undefined ? down.push(aux) : undefined;

            aux = movementCalculator(this,-i,0)
            aux != undefined ? left.push(aux) : undefined;

        }
        let res : directionMap = new directionMap();

        res.set("up", up);
        res.set("down", down);
        res.set("left", left);
        res.set("right", right);

        return res
    }

    getPawnPositions(moved : boolean, player : number) : directionMap{
        let selector : number;
        player == 1 ? selector = -1 : selector = 1; // Selector determines player
        let res : directionMap = new directionMap();
        let aux;
        if(moved) {
            aux = movementCalculator(this,0,selector*2)
            aux != undefined ? (selector == 1 ? res.set("up",aux):res.set("down",aux))  : undefined;
        }

        aux = movementCalculator(this,0,selector)
        aux != undefined ? res.push(selector == 1? "up" : "down", aux) : undefined;

        aux = movementCalculator(this,1,selector)
        aux != undefined ? (selector == 1 ? res.set("upRight",aux) : res.set("downRight", aux)) : undefined;

        aux = movementCalculator(this,-1,selector)
        aux != undefined ? (selector == 1 ? res.set("upLeft",aux) : res.set("downLeft", aux)) : undefined;


        return res
    }

    getKnightPositions(): directionMap {

        let res = new directionMap()
        const combinations =  [[2,1],[2,-1],[-2,1],[-2,-1]]
        /* [col, row] */
        for (const calc of combinations) {
            let moveColRow = movementCalculator(this, calc[0], calc[1])
            let moveRowCol = movementCalculator(this, calc[1], calc[0])
            moveColRow != undefined ? res.push("knight",moveColRow) : undefined; 
            moveRowCol != undefined ? res.push("knight",moveRowCol) : undefined;
        }

        return res
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


export { Position, direction, directionMap, movementCalculator };

