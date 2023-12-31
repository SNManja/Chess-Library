import { pieceState } from "./pieceState";
import { Piece, pieceFactory } from "./pieces";
import { Position } from "./position";

class Board {
    pieceState : pieceState;
    turn : number;

    constructor() {
        this.turn = 0;
        this.createNewBoard();
    }
    
    createNewBoard(){
        try{
            this.pieceState = new pieceState();
            for(const col of ["a", "b", "c", "d", "e", "f", "g", "h"]){
                let whitePos = new Position(col, 2);
                let blackPos = new Position(col, 7);
                this.setPiece(whitePos, "P", 0)
                this.setPiece(blackPos, "P", 1)
            }
            this.setPiece(new Position("a", 1), "R", 0); // White Rook
            this.setPiece(new Position("b", 1), "N", 0); // White Knight
            this.setPiece(new Position("c", 1), "B", 0); // White Bishop
            this.setPiece(new Position("d", 1), "Q", 0); // White Queen
            this.setPiece(new Position("e", 1), "K", 0); // White Knight
            this.setPiece(new Position("f", 1), "B", 0); // White Bishop
            this.setPiece(new Position("g", 1), "N", 0); // White Knight 
            this.setPiece(new Position("h", 1), "R", 0); // White Rook

            this.setPiece(new Position("a", 8), "R", 1); // Black Rook
            this.setPiece(new Position("b", 8), "N", 1); // Black Knight
            this.setPiece(new Position("c", 8), "B", 1); // Black Bishop
            this.setPiece(new Position("d", 8), "Q", 1); // Black Queen
            this.setPiece(new Position("e", 8), "K", 1); // Black Knight
            this.setPiece(new Position("f", 8), "B", 1); // Black Bishop
            this.setPiece(new Position("g", 8), "N", 1); // Black Knight 
            this.setPiece(new Position("h", 8), "R", 1); // Black Rook
            this.pieceState.updateCache();
        } catch (e) {
            console.error("Board createNewBoard: ", e.message)
        }
        
    }

    getState(){
        return this.pieceState
    }

    printState(){
        let stateMatrix = this.pieceState.toMatrix()
        console.log("  A B C D E F G H")
        for(let i = 0; i < stateMatrix.length; i++) {
            let line = ""; line += i+1;
            for(let j = 0; j < stateMatrix[i].length; j++){
                line += " "
                line += stateMatrix[i][j] == null ? "-" : stateMatrix[i][j];
            }
            console.log(line);
            
        }
        console.log(" ")
    }

    


    getPiece(pos: Position) : Piece {
        return this.pieceState.get(pos);
    }


    setPiece(pos : Position, pieceType : string, player : number) : void {
        try {
            let piece : Piece= pieceFactory[pieceType](player)
            this.pieceState.set(pos, piece);
        } catch (e) {
            console.log("Board setPiece: ", e.message);
        }
    }

    getMoves(pos: Position) : Position[] {
        return this.pieceState.getMoves(pos);
    }

    move(from: Position, to: Position) {
        try {
            let fromPiece = this.pieceState.get(from)
            if(!fromPiece) throw new Error(`No piece found in from position ${from}`)
            let fromPiecePlayer = fromPiece.getPlayer()
            if (fromPiecePlayer == 0 && this.turn % 2 == 1) {
                throw new Error("It's Black's turn")
            } else if (fromPiecePlayer == 1 && this.turn % 2 == 0) {
                throw new Error("It's White's turn")
            }
            this.pieceState.move(from, to);
            this.turn += 1;
            this.pieceState.updateCache();
        } catch(e){
            console.log("Board move: ", e.message);
        }
    }

    getResult() : string {
        if(this.pieceState.result == "") return "ongoing";
        else return this.pieceState.result;
    }

}



export { Board };

