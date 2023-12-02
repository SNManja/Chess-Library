import { Position, directionMap } from "./Position";
import { logger } from "./logger";
import { Piece, pieceFactory } from "./pieces";

class Board {
    pieceState : Array<Piece>;

    constructor() {
        this.createNewBoard();
    }

    repInvariant() : boolean {
        let noRepeatedPositions = true; // TODO this would be great to have
        let validPositions = true // This is checked by each position class
        let validPieces = true // checked by each piece class
                               // this includes: valid player and position in the board.
                               // If cached exists, then position in cached have to be valid 
                               // That means that each type has to have positions that make sense for itself.
        // Depending if the game has to be a normal one or not, we have a upper bound of
        // quantity of each piece.
        
        return noRepeatedPositions && validPositions && validPieces
    }
    
    createNewBoard(){
        this.pieceState = [] 
        let blackPieces = [pieceFactory["R"](1,"a",8),pieceFactory["N"](1,"b",8),pieceFactory["B"](1,"c",8),pieceFactory["Q"](1,"d",8),
                            pieceFactory["K"](1,"e",8),pieceFactory["B"](1,"f",8), pieceFactory["N"](1,"g",8),pieceFactory["R"](1,"h",8)] // pieceState[0]
        let whitePieces = [pieceFactory["R"](0,"a",1),pieceFactory["N"](0,"b",1),pieceFactory["B"](0,"c",1),pieceFactory["Q"](0,"d",1),
                            pieceFactory["K"](0,"e",1),pieceFactory["B"](0,"f",1), pieceFactory["N"](0,"g",1),pieceFactory["R"](0,"h",1)] 
        let blackPawns = [pieceFactory["P"](1,"a",7),pieceFactory["P"](1,"b",7),pieceFactory["P"](1,"c",7),pieceFactory["P"](1,"d",7),pieceFactory["P"](1,"e",7),pieceFactory["P"](1,"f",7),pieceFactory["P"](1,"g",7),pieceFactory["P"](1,"h",7)] // pieceState[1]
        let whitePawns = [pieceFactory["P"](0,"a",2),pieceFactory["P"](0,"b",2),pieceFactory["P"](0,"c",2),pieceFactory["P"](0,"d",2),pieceFactory["P"](0,"e",2),pieceFactory["P"](0,"f",2),pieceFactory["P"](0,"g",2),pieceFactory["P"](0,"h",2)] // pieceState[1]

        for(let i = 0; i < 8; i++){
            this.setPiece(blackPieces[i])
            this.setPiece(whitePieces[i])
            this.setPiece(whitePawns[i])
            this.setPiece(blackPawns[i])
        }
        this.pieceState.sort((a:Piece,b:Piece)=>{ // This is a one time task so efficiency is not a problem
            return a.getPosition().compareValue() - b.getPosition().compareValue()
        })
    }

    getState(){
        return this.pieceState;
    }

    getBoard(){
        const board = [];
        for (let i = 0; i < 8; i++) {
          board[i] = [];
          for (let j = 0; j < 8; j++) {
            board[i][j] = null;
          }
        }

        this.pieceState.forEach(piece => {
            let pos = piece.getPosition().getForMatrix();
            board[pos[1]][pos[0]] = [piece.getType(), piece.getPlayer()]
            
        })
        return board;
    }

    setPiece(p : Piece) {
        try { 
            let getIndexOfPosition = this.getIndexOfPosition(p.getPosition())
            if(getIndexOfPosition !== -1 && p.getPlayer() != this.pieceState[getIndexOfPosition].getPlayer()) throw new Error('There is already a piece in that position')
            
            if(getIndexOfPosition !== -1) {
                this.pieceState[getIndexOfPosition] = p
            }

            let left = 0;
            let right = this.pieceState.length - 1;
            // its hardcoded, probably theres a way i can reuse the other binary search code
            let mid
            
            while(left <= right){
                let mid = Math.floor((left + right) / 2);
    
                if(this.pieceState[mid].getPosition().compareValue() === p.getPosition().compareValue()) return mid
    
                else if (this.pieceState[mid].getPosition().compareValue() < p.getPosition().compareValue()) {
                    left = mid+1;
                } else {
                    right = mid - 1;
                }
            }
            this.pieceState.splice(mid,0,p)

        } catch (e) {
            logger.warn(e.message)
        }
    }

    getIndexOfPosition(pos : Position) : number {
        return this.binarySearch(this.pieceState, pos)
    }

    getPieceInPosition(pos : Position):Piece{    
        return this.pieceState[this.binarySearch(this.pieceState, pos)]
    }

    getMoves(pos: Position) : directionMap{
        try{
            let piece = this.getPieceInPosition(pos); // O(log n)
            if ( !piece ) throw new Error("No piece in position")
            let movements : directionMap; // depends in piece.getMovements and board length. So its O(1) in any case
            movements = FilterFactory.getFilteredMovements(piece, this) // if i get the piece i have already cached the correct moves
            
            return movements
        } catch (e) {
            logger.debug(e.message)
        }
        
    }

    moveTo(from: Position, to : Position) {
        try{
            let fromIndex = this.getIndexOfPosition(from); 
            let fromPiece = this.pieceState[fromIndex];
            if(fromPiece == undefined) throw new Error(`Piece not found in position`)
            // Here it's important to stay with the reference.
            // I dont want to create another piece and insert it, i edit the piece an re alocate it
            let isValid : boolean = fromPiece.getCached() ? fromPiece.getCached().validatePosition(to) : false;
            if(!isValid) {
                throw new Error(`Invalid destination position ${to.getColumn()}${to.getRow()}`)
            }
            this.pieceState.splice(fromIndex, 1) // O(n)
            fromPiece.setPosition(to) // Cambio la posicion
            this.setPiece(fromPiece) // Coloco el elemento
        } catch (e){
            logger.warn(e.message)
        }
    }

    binarySearch = (arr : Piece[], x: Position) => { // Returns index
        let left = 0;
        let right = arr.length - 1;

        while(left <= right){
            let mid = Math.floor((left + right) / 2);

            if(arr[mid].getPosition().compareValue() === x.compareValue()) return mid

            else if (arr[mid].getPosition().compareValue() < x.compareValue()) {
                left = mid+1;
            } else {
                right = mid - 1;
            }
        }
        return -1
    }
}

class FilterFactory {
    static getFilteredMovements(piece: Piece, board : Board) : directionMap {
        switch(piece.getType()){
            case "K": return FilterFactory.filterKing(piece, board)
            case "Q": return FilterFactory.filterQueen(piece, board)
            case "R": return FilterFactory.filterRook(piece, board)
            case "N": return FilterFactory.filterKnight(piece, board)
            case "B": return FilterFactory.filterBishop(piece, board)
            case "P": return FilterFactory.filterPawn(piece, board)
        }
    }

    private static filterKing(piece : Piece, board : Board) : directionMap { // TODO
        // At the time im not interested if the king walks into his death
        // So ill ignore cases of check
        return this.directionFilter(piece, board)
    }

    private static filterQueen(piece : Piece, board : Board) : directionMap {
        return this.directionFilter(piece, board)
    }

    private static filterRook(piece : Piece, board : Board) : directionMap{
        return this.directionFilter(piece, board)
    }

    private static filterKnight(piece : Piece, board : Board) : directionMap{
        if (piece.isCached()) return piece.getCached(); 
        let movements : Position[] = piece.getMovements().get("knight")
        let toDelete : number[] = []

        for(let i = 0; i < movements.length; i++){ // O(8 * body) => O(8 * log(8*4)) => O(8*5) => O(40) => O(1) technically is constant time

            let pieceInPosition = board.getPieceInPosition(movements[i]) //O(log n) with n = quantity of pieces (usually max is 8*4)
            if((pieceInPosition != undefined) &&  pieceInPosition.getPlayer() == piece.getPlayer()){ // O(1) rounded up
                toDelete.unshift(i) // O(1)?
            }
        }
        toDelete.forEach(i => { // O(8)
            movements.splice(i,1) // TODO check if its correct
        })
        let res : directionMap = piece.getMovements().copy();
        res.set("knight", movements);
        piece.setCached(res)

        return res 
    }

    private static filterBishop(piece : Piece, board : Board) : directionMap{
        return this.directionFilter(piece, board)
    }

    private static filterPawn(piece : Piece, board : Board) : directionMap{
        return piece.getMovements() // TODO This is a special one. 
    }

    
    private static directionFilter(piece : Piece, board : Board) : directionMap {
        if (piece.isCached()) return piece.getCached(); 
        let movements: directionMap = piece.getMovements();
    
        for (const dir of movements.keys()) {
            if (dir == "knight") continue;

            let cap = movements.get(dir).length;

            for(let i = 0 ; i < cap ;i++){
                let pieceInPosition = board.getPieceInPosition(movements.get(dir)[i])
                if (pieceInPosition != undefined){ 
                    // This checks if its an enemy, in which case enemy could be eaten
                    piece.getPlayer() == pieceInPosition.getPlayer() ? cap = i : cap = i+1; 
                }
            }
            movements.set(dir,movements.get(dir).slice(0,cap)) 
        }

        piece.setCached(movements.copy())

        return movements
    }
}

export { Board };

