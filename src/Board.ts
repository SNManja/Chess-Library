
import { Piece, Position, direction, pieceFactory } from "./pieces";

class Board {
    pieceState : Array<Piece>;

    constructor() {
        this.createNewBoard();
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
            this.pieceState.push(blackPieces[i])
            this.pieceState.push(whitePieces[i])
            this.pieceState.push(whitePawns[i])
            this.pieceState.push(blackPawns[i])
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

    getPieceInPosition(pos : Position):Piece{
        
        let binarySearch = (arr : Piece[], x: Position) => {
            let left = 0;
            let right = arr.length - 1;

            while(left <= right){
                let mid = Math.floor((left + right) / 2);

                if(arr[mid].getPosition().compareValue() === x.compareValue()) return arr[mid]

                else if (arr[mid].getPosition().compareValue() < x.compareValue()) {
                    left = mid+1;
                } else {
                    right = mid - 1;
                }
            }
            return undefined
        }
        return binarySearch(this.pieceState, pos)

    }

    getMoves(pos: Position) : Record<direction, Position[]>{
        let piece = this.getPieceInPosition(pos); // O(log n)
        let movements : Record<direction, Position[]>; // depends in piece.getMovements and board length. So its O(1) in any case
        movements = FilterFactory.getFilteredMovements(piece, this)

        return movements
    }
}

class FilterFactory {
    static getFilteredMovements(piece: Piece, board : Board) : Record<direction, Position[]>{
        switch(piece.getType()){
            case "K": return FilterFactory.filterKing(piece, board)
            case "Q": return FilterFactory.filterQueen(piece, board)
            case "R": return FilterFactory.filterRook(piece, board)
            case "N": return FilterFactory.filterKnight(piece, board)
            case "B": return FilterFactory.filterBishop(piece, board)
            case "P": return FilterFactory.filterPawn(piece, board)
        }
    }

    private static filterKing(piece : Piece, board : Board) : Record<direction, Position[]> {
        // At the time im not interested if the king walks into his death
        // So ill ignore cases of check
        return this.directionFilter(piece, board)
    }

    private static filterQueen(piece : Piece, board : Board) : Record<direction, Position[]> {
        return this.directionFilter(piece, board)
    }

    private static filterRook(piece : Piece, board : Board) : Record<direction, Position[]>{
        return this.directionFilter(piece, board)
    }

    private static filterKnight(piece : Piece, board : Board) : Record<direction, Position[]>{
        let movements = piece.getMovements()
        let toDelete : number[] = []

        for(let i = 0; i < movements["knight"].length; i++){

            let pieceInPosition = board.getPieceInPosition(movements["knight"][i]) 
            if((pieceInPosition != undefined) &&  pieceInPosition.getPlayer() == piece.getPlayer()){
                toDelete.unshift(i)
            }
        }
        toDelete.forEach(i => {
            movements["knight"].splice(i,1)
        })
        return movements 
    }

    private static filterBishop(piece : Piece, board : Board) : Record<direction, Position[]>{
        return this.directionFilter(piece, board)
    }

    private static filterPawn(piece : Piece, board : Board) : Record<direction, Position[]>{
        return piece.getMovements() // This is a special one. 
    }

    // Here i mantained the aliasing.
    // It good for me to modify the cached values in movements
    private static directionFilter(piece : Piece, board : Board) : Record<direction, Position[]> {
        let movements: Record<direction, Position[]> = piece.getMovements();
    
        for (const dir of ["up", "down", "left", "right", "upLeft", "upRight", "downLeft", "downRight"]) {
            let cap = movements[dir].length;

            for(let i = 0 ; i < cap ;i++){
                let pieceInPosition = board.getPieceInPosition(movements[dir][i])
                if (pieceInPosition != undefined){ 
                    // This checks if its an enemy, in which case enemy could be eaten
                    piece.getPlayer() == pieceInPosition.getPlayer() ? cap = i : cap = i+1; 
                }
            }
            movements[dir] = movements[dir].slice(0,cap)
        }


        return movements
    }
}

export { Board };

