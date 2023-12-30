// This is a class made to encapsulate the state of the board as a type
// So now, i can organize a little better the code, and simplify some error handling
import { Position } from "./Position";
import { King, Piece, Rook } from "./pieces";

export class pieceState {
    state : Map<number, Piece | null>;
    cache : Map<number, Position[]>;
    result : string = "";

    constructor() {
        this.state = new Map<number, Piece>();
    }

    get(pos : Position) : Piece | null {
        try {
            if ( !pos ) throw new Error("No position given")
            return this.state[pos.compareValue()];
        } catch (e) {
            //console.error("pieceState get: ",e.message)
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
            delete this.state[pos.compareValue()];
        } catch(e){
            console.error("Invalid del:", e.message)
        }
    }

    move(from : Position, to : Position) : void {
        try {
            if(from.compareValue() == to.compareValue()) throw new Error("Same positions")
            if(this.get(from) == null) throw new Error("No piece in from position");
            const isValidMove = this.cache[from.compareValue()].find((pos) => {
                return pos.compareValue() == to.compareValue();
            })
            if (!isValidMove)  throw new Error("This is not a valid move")
            const piece = this.get(from)
            if(piece.getType() == "K") { // Related to castling: Checks already have been made, so this is only responsible of the move itself 
                if(!(piece as King).hasMoved() && from.getColumn() == "e" && to.getColumn() == "g"){  // Short castle - King side
                    const KingRook = this.get(new Position("h",from.getRow()));

                    this.set(to, piece);  // Moves king
                    this.del(from);
                    this.set(new Position("f", from.getRow()), KingRook); // Moves rook
                    this.del(new Position("h",from.getRow()));
                } else if(!(piece as King).hasMoved() && from.getColumn() == "e" && to.getColumn() == "c"){ // Long castle - Queen side
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
            console.error("pieceState move:", e.message)
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
        try {
            let moves = this.cache[pos.compareValue()];
            return moves
        } catch(e){
            console.error("pieceState getMoves: ", e.message)
        }
    }

    private validMoves(pos : Position, checkIfItsWatching=false ) : Position[] {
        try{
            let moves : Position[] = [];
            let piece = this.get(pos);
            if(piece == null) throw new Error("No piece at this position");
            switch(piece.getType()) {
                case "P":
                    moves = this.validPawnMoves(pos); // TODO , checkIfItsWatching
                    break;
                case "N":
                    moves = this.validKnightMoves(pos, checkIfItsWatching);
                    break;
                case "B":
                    moves = this.validBishopMoves(pos, checkIfItsWatching);
                    break;
                case "R":
                    moves = this.validRookMoves(pos, checkIfItsWatching);
                    break;
                case "Q":
                    moves = this.validQueenMoves(pos, checkIfItsWatching);
                    break;
                case "K":
                    moves = this.validKingMoves(pos); // TODO , checkIfItsWatching
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
        //console.log("Pawn move checker: ", piece.getPlayer(), direction, inFront)
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
            let KingRook = this.get(movementCalculator(pos, -4, 0))
            let QueenRook = this.get(movementCalculator(pos, 3, 0))
            if(KingRook || KingRook.getType() == "R" && !(KingRook as Rook).hasMoved()){
                if(this.get(movementCalculator(pos, -1, 0)) == null && this.get(movementCalculator(pos, -2, 0)) == null) validMoves.push(movementCalculator(pos, -2, 0));
            }
            if(QueenRook || QueenRook.getType() == "R" && !(QueenRook as Rook).hasMoved()){
                if(this.get(movementCalculator(pos, 1, 0)) == null && this.get(movementCalculator(pos, 2, 0)) == null && this.get(movementCalculator(pos, 3, 0)) == null) validMoves.push(movementCalculator(pos, -2, 0));
            }
        }

        if (filterParams) { // filtrates positions in param
            let filteredMoves = [];
            for(const move of validMoves){
                if(!filterParams.has(move)) filteredMoves.push(move);
            }
            return filteredMoves;
            
        }
        return validMoves;
    }
    
    private validKnightMoves(pos: Position, checkIfItsWatching=false): Position[] {
        let validMoves : Position[] = [];
        for(const v1 of [2,-2]){
            for(const v2 of [1,-1]){
                let newPos1 = movementCalculator(pos, v1, v2);
                let newPos2 = movementCalculator(pos, v2, v1);
                if(newPos1 && (this.get(newPos1) == null || this.get(pos).getPlayer() != this.get(newPos1).getPlayer() || (checkIfItsWatching && this.get(pos).getPlayer() == this.get(newPos1).getPlayer() ))){
                    validMoves.push(newPos1);
                }
                if(newPos2 && (this.get(newPos2) == null || this.get(pos).getPlayer() != this.get(newPos2).getPlayer() || (checkIfItsWatching && this.get(pos).getPlayer() == this.get(newPos1).getPlayer() ))){
                    validMoves.push(newPos2);
                }
            }
        }
        return validMoves;
    }
    
    private validBishopMoves(pos: Position, checkIfItsWatching=false): Position[] {
        const validMoves : Position[] = this.validateMoves(pos, [[1,1],[1,-1],[-1,1],[-1,-1]], 8, checkIfItsWatching)
        return validMoves;
    }

    private validRookMoves(pos: Position, checkIfItsWatching= false): Position[] {
        const validMoves : Position[] = this.validateMoves(pos, [[0,1],[0,-1],[1,0],[-1,0]], 8, checkIfItsWatching)
        return validMoves
    }

    private validQueenMoves(pos: Position, checkIfItsWatching = false ): Position[] {
        const validMoves : Position[] = this.validateMoves(pos, [[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]], 8, checkIfItsWatching)
        return validMoves; //
    }

    private validateMoves(pos: Position, combinations : number[][], range = 8, checkIfItsWatching = false) : Position[]{
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
                if(this.get(newPos).getPlayer() != player || (checkIfItsWatching && this.get(newPos).getPlayer() == player)) {
                    validMoves.push(newPos)
                    break;
                };
                break;
            }
        }
        return validMoves;
    }

    updateCache() : void {
        try{
            this.cache = new Map<number, Position[]>();
            let whiteKingPosition : Position;
            let blackKingPosition : Position;
    
            let whiteWatching : PositionSet = new PositionSet();
            let blackWatching : PositionSet = new PositionSet();
            
            for (const [unparsedKey,value] of Object.entries(this.state)) {
                
                let key  = Number.parseInt(unparsedKey);
                let keyPosition = Position.compareValueToPosition(key);
                if(key && !keyPosition) throw new Error("compareValueToPosition Not parsing well") 
                if (value == null) {
                    throw new Error(`Passed a null value in key: ${key}`)
                }
                else if(value.getType() == "K"){
                    if (value.getPlayer() == 0) {
                        whiteKingPosition = keyPosition;
                    }
                    if (value.getPlayer() == 1) blackKingPosition = keyPosition;
                } else {
                    let validMovesForPosition = this.validMoves(keyPosition);
                    this.cache[keyPosition.compareValue()] = validMovesForPosition; 
                    if (value.getPlayer() == 0) whiteWatching.addArray(this.validMoves(keyPosition,true));
                    if (value.getPlayer() == 1) blackWatching.addArray(this.validMoves(keyPosition,true));
                }
            }
            // Now i know what moves are invalid for the king, the ones that the other player is watching
            if(whiteKingPosition == null) throw new Error("No whiteKing found?");
            if(blackKingPosition == null) throw new Error("No blackKing found?");
    
            this.cache[whiteKingPosition.compareValue()] = this.validKingMoves(whiteKingPosition, blackWatching);
            this.cache[blackKingPosition.compareValue()] = this.validKingMoves(blackKingPosition, whiteWatching);
    
            if (whiteWatching.has(blackKingPosition) || blackWatching.has(whiteKingPosition)) { // White checks black
                
                let checkedPlayer = (whiteWatching.has(blackKingPosition)) ? 1 : 0;
                let threats : Position[] = (whiteWatching.has(blackKingPosition)) ? this.backtrackThreats(blackKingPosition) : this.backtrackThreats(whiteKingPosition); 
                let threatPaths : PositionSet= (whiteWatching.has(blackKingPosition)) ? this.backtrackThreatsPaths(blackKingPosition, threats) : this.backtrackThreatsPaths(whiteKingPosition, threats);
                
                console.log("player checked: ", checkedPlayer)

                let haveMovesOutsideOfKing : boolean = false;
                if(threats.length == 0) { 
                    throw new Error("No threat found for black and white is watching the king")
                } else if (threats.length >= 1){           
                    for (const [unparsedKey , value] of Object.entries(this.state)) {
                        let key  = Number.parseInt(unparsedKey);
                        if (value.getPlayer() == checkedPlayer && value.getType() != "K"){
                            
                            if(threats.length == 1){
                                
                                let newCache = [];
                                this.cache[key].forEach( (p : Position )=>{
                                    
                                    if(threatPaths.has(p)) {
                                        newCache.push(p);
                                    }
                                })
                                if(this.cache[key].length != newCache.length) this.cache[key] = newCache;
                                
                                if(this.cache[key].length > 0) haveMovesOutsideOfKing = true;
                            } else {
                                this.cache[key] = [];
                            }
                        }
                    }
                }

                if(!haveMovesOutsideOfKing && this.cache[(checkedPlayer == 0 ? whiteKingPosition : blackKingPosition).compareValue()].length == 0) {
                    this.end(checkedPlayer == 1 ? 0 : 1);
                }
            } 

        } catch (e) {
            console.error("pieceState updateCache",e.message)
        }
    }

    backtrackThreats(pos : Position) : Position[] { // This will be given a position of a piece, and return the threating enemies' position
        // Maybe for this would be great to make a function to check if a position is in between 2 other ones
        // I can change the set with possible moves from each piece to a dictionary wich stores the piece that threats that position
        // This will save me of backtracking the enemy and its positions in between.
        try {

            let res : Position[] = [];
            let pieceInPosition = this.get(pos);
            // I need to check 
            // * diagonal lines
            // * ortogonal lines
            // * knights
    
            let possibleKnights = this.validKnightMoves(pos)
            let possibleBishops = this.validBishopMoves(pos)
            let possibleRooks = this.validRookMoves(pos)


            let checkValidThreats = (possible : Position[], type : string) => {
                possible.forEach(p =>{
                    let piece : Piece = this.get(p);
                    if(!piece) return;
                    let moreThanOne : boolean = false;
                    let validateType;
                    if(type == "K") validateType = piece.getType() == "K";
                    if(type == "B") validateType = piece.getType() == "B" || piece.getType() == "Q" ;
                    if(type == "R") validateType = piece.getType() == "R" || piece.getType() == "Q" ;
                    if(piece!= null && validateType  && piece.getPlayer()!= pieceInPosition.getPlayer()){
                        if (moreThanOne) {
                            throw new Error(`Multiple pieces of the same type (${piece.getType()}) threatening one king`)
                        } else {
                            moreThanOne = true;
                        }
                        res.push(p)
                    }
                })
            }

            checkValidThreats(possibleKnights, "K");
            checkValidThreats(possibleBishops, "B");
            checkValidThreats(possibleRooks, "R");
            
            return res;

        } catch (e) {
            console.error("pieceState backtrackThreats: " + e.message)
        }
    }

    backtrackThreatsPaths(kingPos : Position, threats : Position[]) : PositionSet {
        try {
            let res = new PositionSet();
            if(threats.length == 0){
                throw new Error("backtrackThreatPaths: Zero threats why we even got here.")
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
                    for(let i = 1; i <= 8; i++) {

                        for(let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
                            
                            if(checkDirections[dirIndex] == false) continue;
                            
                            let calcPosition =  movementCalculator(threats[0], directions[dirIndex][0] * i,directions[dirIndex][1]* i)
                            if(!calcPosition) {
                                checkDirections[dirIndex] = false;
                                continue;
                            }

                            if(directions[dirIndex][0] != 0) directions[dirIndex][0] += directions[dirIndex][0] > 0 ? 1 : -1
                            
                            if(directions[dirIndex][1] != 0) directions[dirIndex][1] += directions[dirIndex][1] > 0 ? 1 : -1
                            
                            storeDirections[dirIndex].push(calcPosition);
                            
                            if(calcPosition.compareValue() == kingPos.compareValue()) {
                                res.addArray(storeDirections[dirIndex]);
                                res.add(threats[0])
                                return res
                            }

                        }
                    }
                }
                throw new Error("threat has not been found")
            }

        } catch (e) {
            console.error("pieceState backtrackThreatsPaths: " + e.message)
        }
    }

    end(winner : number) : void {
        try{
            if(!(winner == 0 || winner == 1 || winner == 0.5)) throw new Error("Invalid winner")
            if(winner == 0) this.result = "white";
            if(winner == 1) this.result = "black";
            if(winner == 0.5) this.result = "tie";
            delete this.cache;
            console.log("Game ended, winner is: ", winner)
        } catch(e){
            console.error("pieceState end: ", e.message)
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
