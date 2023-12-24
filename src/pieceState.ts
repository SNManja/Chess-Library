// This is a class made to encapsulate the state of the board as a type
// So now, i can organize a little better the code, and simplify some error handling
import { Position } from "./Position";
import { logger } from "./logger";
import { King, Piece, Rook } from "./pieces";

export class pieceState {
    state : Map<number, Piece | null>;
    cache : Map<number, Position[]>

    constructor() {
        this.state = new Map<number, Piece>();
    }

    get(pos : Position) : Piece | null {
        try {
            if ( !pos ) throw new Error("No position given")
            return this.state[pos.compareValue()];
        } catch (e) {
            console.error("pieceState get: ",e.message)
        }
    }

    set(pos : Position, p : Piece) : void {
        try{
            if(this.state[pos.compareValue()] ? this.state[pos.compareValue()].getPlayer() == p.getPlayer() : false) throw new Error("Cant eat piece of same player");
            this.state[pos.compareValue()] = p;
            this.cache = new Map<number,Position[]>();
        } catch(e){
            console.error("pieceState set: ", e.message)
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
            if (isValidMove)  throw new Error("This is not a valid move")
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
            this.updateCache();
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

    getMoves(pos : Position) : Position[]{
        let moves = this.updateCache[pos.compareValue()];
        return moves
    }

    private validMoves(pos : Position) : Position[] {
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

        const inFront = movementCalculator(pos, 0,  1 * direction);
        console.log("Pawn move checker: ", piece.getPlayer(), direction, inFront)
        if(this.get(inFront) == null) validMoves.push(inFront);

        const side1 = movementCalculator(pos, 1, 1 * direction);
        if(this.get(side1) != null && this.get(side1).getPlayer() != piece.getPlayer())  validMoves.push(side1)
        const side2 = movementCalculator(pos, -1,1 * direction);
        if(this.get(side2) != null && this.get(side2).getPlayer() != piece.getPlayer())  validMoves.push(side2)
        
        if(piece.getPlayer() == 0) {
            if(pos.getRow() == 2 && validMoves.includes(inFront)) {
                const doubleFront = movementCalculator(pos,0,2 * direction);
                if(this.get(doubleFront) == null) validMoves.push(doubleFront);
            }
        } else {
            if(pos.getRow() == 7 && validMoves.includes(inFront)) {
                const doubleFront = movementCalculator(pos,0,2 * direction);
                if(this.get(doubleFront) == null) validMoves.push(doubleFront);
            }
        }

        return validMoves;
    }
     
    private validKingMoves(pos: Position, filterParams : PositionSet = undefined): Position[] { // Need to make sure king doesnt kill himself
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

        if (filterParams) { // filtrates positions in param
            validMoves.filter(PotentialKingPositions => {
                return !(filterParams.has(PotentialKingPositions)) 
            })
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

    updateCache() : void {
        this.cache = new Map<number, Position[]>();
        let whiteKingPosition : Position;
        let blackKingPosition : Position;

        let whiteWatching : PositionSet = new PositionSet();
        let blackWatching : PositionSet = new PositionSet();
        
        for (const [unparsedKey,value] of Object.entries(this.state)) {
            let key  = Number.parseInt(unparsedKey);
            let keyPosition = Position.compareValueToPosition(key);
            if (value == null) {
                logger.warn("update cache:  Passed a null value in key: ", key)
            }
            else if(value.getType() == "K"){
                if (value.getPlayer() == 0) {
                    whiteKingPosition = keyPosition;
                }
                if (value.getPlayer() == 1) blackKingPosition = keyPosition;
            } else {
                let validMovesForPosition = this.validMoves(keyPosition);
                this.cache[keyPosition.compareValue()] = validMovesForPosition; 
                if (value.getPlayer() == 0) whiteWatching.addArray(validMovesForPosition);
                if (value.getPlayer() == 1) blackWatching.addArray(validMovesForPosition);
            }
        }
        // Now i know what moves are invalid for the king, the ones that the other player is watching
        if(whiteKingPosition == null) throw new Error("updateCache: No whiteKing found?");
        if(blackKingPosition == null) throw new Error("updateCache: No blackKing found?");

        this.cache[whiteKingPosition.compareValue()] = this.validKingMoves(whiteKingPosition, blackWatching);
        this.cache[blackKingPosition.compareValue()] = this.validKingMoves(blackKingPosition, whiteWatching);

        if (whiteWatching.has(blackKingPosition) || blackWatching.has(whiteKingPosition)) { // White checks black
            let checkedPlayer = (whiteWatching.has(blackKingPosition)) ? 1 : 0;
            let threats : Position[] = (whiteWatching.has(blackKingPosition)) ? this. backtrackThreats(blackKingPosition) : this. backtrackThreats(whiteKingPosition); 
            let threatPaths : PositionSet= (whiteWatching.has(blackKingPosition)) ? this.backtrackThreatsPaths(blackKingPosition, threats) : this.backtrackThreatsPaths(whiteKingPosition, threats);
            
            if(threats.length == 0) { 
                throw new Error("updateCache: No threat found for black and white is watching the king")
            } else if (threats.length >= 1){
                for (const [unparsedKey , value] of Object.entries(this.state)) {
                    let key  = Number.parseInt(unparsedKey);
                    if (value.getPlayer() == checkedPlayer && value.getType() != "K"){
                        if(threats.length == 1){
                            this.cache[key] = this.cache[key].filter(p => {
                                return (threatPaths.has(p))
                            })
                        } else {
                            this.cache[key] = [];
                        }
                    }
                }
            }
        } 
    }

    backtrackThreats(pos : Position) : Position[] { // This will be given a position of a piece, and return the threating enemies' position
        // Maybe for this would be great to make a function to check if a position is in between 2 other ones
        // I can change the set with possible moves from each piece to a dictionary wich stores the piece that threats that position
        // This will save me of backtracking the enemy and its positions in between.

        let pieceInPosition = this.get(pos);
        // I need to check 
        // * diagonal lines
        // * ortogonal lines
        // * knights

        let possibleKnights = this.validKnightMoves(pos).filter( p => {
            return this.get(p) != null && this.get(p).getType() == "N" && this.get(p).getPlayer() != pieceInPosition.getPlayer() ;
        })
        if (pieceInPosition.getType() == "K" && possibleKnights.length > 1) throw new Error("Multiple knights threatening one king")

        let possibleBishops = this.validBishopMoves(pos).filter( p => { // This is really inneficient
            return this.get(p) != null && this.get(p).getType() == "B" && this.get(p).getPlayer()!= pieceInPosition.getPlayer();
        })
        if (pieceInPosition.getType() == "B" && possibleBishops.length > 1) throw new Error("Multiple bishops threatening one king")

        let possibleRooks = this.validRookMoves(pos).filter( p => { // This is really inneficient
            return this.get(p) != null && this.get(p).getType() == "R" && this.get(p).getPlayer()!= pieceInPosition.getPlayer();
        })
        
        return;
    }

    backtrackThreatsPaths(pos : Position, threats : Position[]) : PositionSet {
        let res = new PositionSet();
        if(threats.length == 0){
            throw new Error("backtrackThreatPaths: Zero threats why we got here.")
        }
        if(threats.length > 1){
            return res; // Returns empty bc it doesnt matter when i have 2 threats
        } else {
            if (this.get(threats[0]).getType() == "K"){
                res.add(threats[0])
                return res;
            } else {
                let directions = [[1,1], [-1,1], [1,-1], [-1,-1],[1,0],[0,1],[-1,0],[0,-1]]
                let storeDirections : Position[][] = [[],[],[],[],[],[],[],[]];
                let checkDirections : boolean[];
                checkDirections = this.get(threats[0]).getType() == "Q" ?  [true,true,true,true,true,true,true,true] : 
                                        (this.get(threats[0]).getType() == "R" ? [false,false,false,false,true,true,true,true] : 
                                                                                        [true,true,true,true,false,false,false,false])  
                for(let i = 0; i < 8; i++) {
                    for(let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
                        if(checkDirections[dirIndex] == false) continue;
                        let calcPosition =  movementCalculator(threats[0], directions[dirIndex][0],directions[dirIndex][0])
                        if(calcPosition != null) {
                            checkDirections[dirIndex] = false;
                            continue;
                        }
                        storeDirections[dirIndex].push(calcPosition);
                        if(calcPosition.compareValue() == threats[0].compareValue()) {
                            res.addArray(storeDirections[dirIndex]);
                            return res
                        }
                        if(directions[dirIndex][0] != 0) {
                            directions[dirIndex][0] += directions[dirIndex][0] > 0 ? 1 : -1
                        }
                        if(directions[dirIndex][1] != 0) {
                            directions[dirIndex][1] += directions[dirIndex][1] > 0 ? 1 : -1
                        }
                    }
                }
            }
            throw new Error("threat has not been found")
        }
    }


}

class PositionSet {
    private set : Set<number>

    constructor(){
        this.set = new Set();
    }

    add(pos : Position) : void {
        this.set.add(pos.compareValue());
    }

    addArray(pos : Position[]) : void {
        for(const p of pos){
            this.set.add(p.compareValue());
        }
    }

    remove(pos : Position) : void {
        this.set.delete(pos.compareValue());
    }

    has(pos : Position) : boolean {
        return this.set.has(pos.compareValue());
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
