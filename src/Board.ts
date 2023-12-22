import { Position } from "./Position";
import { pieceState } from "./pieceState";
import { Piece } from "./pieces";

class Board {
    pieceState : pieceState;

    constructor() {
        this.createNewBoard();
    }

    
    createNewBoard(){
        this.pieceState = new pieceState();
    }

    getState(){
        return this.pieceState;
    }

    getPiece(pos: Position) : Piece {
        return this.pieceState.get(pos);
    }


    setPiece(pos: Position, p : Piece) {
        this.pieceState.set(pos, p);
    }

}



export { Board };

