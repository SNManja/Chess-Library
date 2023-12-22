// This is a class made to encapsulate the state of the board as a type
// So now, i can organize a little better the code, and simplify some error handling
import { Position } from "./Position";
import { King, Piece, Rook } from "./pieces";

export class pieceState {
    state : Map<number, Piece | null>;

    constructor() {
        this.state = new Map<number, Piece>();
    }

    get(pos : Position) : Piece | null {
        try {
            return this.state[pos.compareValue()];
        } catch (e) {
            console.error("pieceState get: ",e.message)
        }
    }

    set(pos : Position, p : Piece) : void {
        try{
            if(this.state[pos.compareValue()] != null ? this.state[pos.compareValue()].getPlayer() == p.getPlayer() : false) throw new Error("Cant eat piece of same player");
            this.state[pos.compareValue()] = p;
        } catch(e){
            console.error("Invalid set:", e.message)
        }
    }

    del(pos : Position) : void {
        try{
            if (this.state[pos.compareValue()] == null) throw new Error("No piece in that pos")
            this.state[pos.compareValue()] = null;
            this.state.delete(pos.compareValue());
        } catch(e){
            console.error("Invalid del:", e.message)
        }
    }

    move(from : Position, to : Position) : void {
        try {
            if(from.compareValue() == to.compareValue()) throw new Error("Same positions")
            if(this.get(from) == null) throw new Error("No piece in from position");
            const isValidMove = this.validMoves(from).find((pos) => {
                return pos.compareValue() == to.compareValue();
            })
            if (!isValidMove)  throw new Error("This is not a valid move")
            const piece = this.get(from)
            if(piece.getType() == "K") { // Related to castling: Checks already have been made, so this is only responsible of the move itself 
                if((piece as King).hasMoved() && from.getColumn() == "e" && to.getColumn() == "g"){  // Short castle - King side
                    const KingRook = this.get(new Position("h",from.getRow()));

                    this.set(to, piece);  // Moves king
                    this.del(from);
                    this.set(new Position("f", from.getRow()), KingRook); // Moves rook
                    this.del(new Position("h",from.getRow()));
                } else if((piece as King).hasMoved() && from.getColumn() == "e" && to.getColumn() == "c"){ // Long castle - Queen side
                    const KingRook = this.get(new Position("a",from.getRow()));

                    this.set(to, piece);  // Moves king
                    this.del(from);
                    this.set(new Position("d", from.getRow()), KingRook); // Moves rook
                    this.del(new Position("a",from.getRow()));
                }
                (piece as King).setMoved();
            }
            if(piece.getType() == "R") { 
                (piece as Rook).setMoved();
            }

            this.set(to, this.get(from)); 
            this.del(from);
        } catch(e){
            console.error("Invalid move:", e.message)
        }
    }

    toMatrix() {
        try {
            const matrix = [];
            for(let row=1 ; row <= 8 ; row++){
                let colArr = [];
                for(const col of ["a", "b", "c", "d", "e", "f", "g", "h"]){
                    let thisPiece : Piece = this.get(new Position(col, row))
                    if(thisPiece){
                        if(thisPiece.getPlayer() == 1){
                            colArr.push(thisPiece.getType().toLowerCase());
                        } else {
                            colArr.push(thisPiece.getType());
                        }
                    } else {
                        colArr.push(null);
                    }
                }
                matrix.push(colArr);
            }
            return matrix;
            
        } catch (e) {
            console.error("pieceState toMatrix: ",e.message)
        }
    }

    validMoves(pos : Position) : Position[] {
        try{
            let moves : Position[] = [];
            let piece = this.get(pos);
            if(piece == null) throw new Error("No piece at this position");
            switch(piece.getType()) {
                case "P":
                    moves = this.validPawnMoves(pos);
                    break;
                case "N":
                    moves = this.validKnightMoves(pos);
                    break;
                case "B":
                    moves = this.validBishopMoves(pos);
                    break;
                case "R":
                    moves = this.validRookMoves(pos);
                    break;
                case "Q":
                    moves = this.validQueenMoves(pos);
                    break;
                case "K":
                    moves = this.validKingMoves(pos);
                    break;
                default:
                    throw new Error("Invalid piece type");
            }
            return moves;
        } catch (e) {
            console.error("validMoves error:", e.message);
        }
    }

    private validPawnMoves(pos: Position): Position[] {
        let validMoves : Position[] = [];
        let piece : Piece = this.get(pos);
        const direction = piece.getPlayer() == 1 ? -1 : 1;

        const inFront = movementCalculator(pos, 1 * direction, 0);
        if(this.get(inFront) == null) validMoves.push(inFront);

        const side1 = movementCalculator(pos, 1 * direction, 1);
        if(this.get(side1) != null && this.get(side1).getPlayer() != piece.getPlayer())  validMoves.push(side1)
        const side2 = movementCalculator(pos, 1 * direction, -1);
        if(this.get(side2) != null && this.get(side2).getPlayer() != piece.getPlayer())  validMoves.push(side2)
        
        if(piece.getPlayer() == 0) {
            if(pos.getRow() == 2 && validMoves.includes(inFront)) {
                const doubleFront = movementCalculator(pos, 2 * direction,1);
                if(this.get(doubleFront) == null) validMoves.push(doubleFront);
            }
        } 

        return validMoves;
    }
     
    private validKingMoves(pos: Position): Position[] { // Need to make sure king doesnt kill himself
        let piece : Piece = this.get(pos);

        let validMoves : Position[] = this.validateMoves(pos, [[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]], 2);

        if(!(piece as King).hasMoved()){
            let KingRook = this.get(movementCalculator(pos, -3, 0))
            let QueenRook = this.get(movementCalculator(pos, 4, 0))
            if(KingRook.getType() == "R" && !(KingRook as Rook).hasMoved()){
                if(this.get(movementCalculator(pos, -1, 0)) == null && this.get(movementCalculator(pos, -2, 0)) == null) validMoves.push(movementCalculator(pos, -2, 0));
            }
            if(QueenRook.getType() == "R" && !(QueenRook as Rook).hasMoved()){
                if(this.get(movementCalculator(pos, 1, 0)) == null && this.get(movementCalculator(pos, 2, 0)) == null && this.get(movementCalculator(pos, 3, 0)) == null) validMoves.push(movementCalculator(pos, -2, 0));
            }
        }
        
        return validMoves;
    }
    
    private validKnightMoves(pos: Position): Position[] {
        let validMoves : Position[] = [];
        for(const v1 of [2,-2]){
            for(const v2 of [1,-1]){
                let newPos1 = movementCalculator(pos, v1, v2);
                let newPos2 = movementCalculator(pos, v2, v1);
                if(newPos1 && (this.get(newPos1) == null || this.get(pos).getPlayer() != this.get(newPos1).getPlayer())){
                    validMoves.push(newPos1);
                }
                if(newPos2 && (this.get(newPos2) == null || this.get(pos).getPlayer() != this.get(newPos2).getPlayer())){
                    validMoves.push(newPos2);
                }
            }
        }
        return validMoves;
    }
    
    private validBishopMoves(pos: Position): Position[] {
        const validMoves : Position[] = this.validateMoves(pos, [[1,1],[1,-1],[-1,1],[-1,-1]])
        return validMoves;
    }

    private validRookMoves(pos: Position): Position[] {
        const validMoves : Position[] = this.validateMoves(pos, [[0,1],[0,-1],[1,0],[-1,0]])
        return validMoves
    }

    private validQueenMoves(pos: Position): Position[] {
        const validMoves : Position[] = this.validateMoves(pos, [[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]])
        return validMoves; //
    }

    private validateMoves(pos: Position, combinations : number[][], range = 8) : Position[]{
        let player = this.get(pos).getPlayer();
        let validMoves : Position[] = [];
        for(const combination of combinations){
            for(let i = 1; i < range; i++){
                const newPos = movementCalculator(pos, combination[0] * i, combination[1] * i)
                if(!newPos) break;
                if(this.get(newPos) == null) {
                    validMoves.push(newPos); 
                    continue;
                }
                if(this.get(newPos).getPlayer() != player) {
                    validMoves.push(newPos)
                    break;
                };
                break;
            }
        }
        return validMoves;
    }
}


function movementCalculator(pos : Position, col : number, row : number) : Position {
    
    let newRow = pos.getRow() + row;
    let newColumn = String.fromCharCode((pos.getColumn().charCodeAt(0) - col));
   
    if((newColumn >= "a" && newColumn <= "h") && (newRow >= 1 && newRow <= 8)){
        let newPosition : Position = new Position(newColumn, newRow)
        return newPosition
    }     
    return undefined;
}
