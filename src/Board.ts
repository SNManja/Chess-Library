import { Position } from "./Position";
import { logger } from "./logger";
import { pieceState } from "./pieceState";
import { Piece, pieceFactory } from "./pieces";

class Board {
    pieceState : pieceState;
    turn : number;

    constructor() {
        this.turn = 0;
        this.createNewBoard();
    }
    
    createNewBoard(){
        this.pieceState = new pieceState();
    }

    getState(){
        return this.pieceState.toMatrix();
    }

    printState(){
        let stateMatrix = this.getState();
        logger.debug("  A B C D E F G H")
        for(let i = 0; i < stateMatrix.length; i++) {
            let line = ""; line += i+1;
            for(let j = 0; j < stateMatrix[i].length; j++){
                line += " "
                line += stateMatrix[i][j] == null ? "-" : stateMatrix[i][j];
            }
            logger.debug(line);
        }
    }

    getPiece(pos: Position) : Piece {
        return this.pieceState.get(pos);
    }


    setPiece(pos: Position, pieceType, player : number) {
        try {
            let piece : Piece= pieceFactory[pieceType](player)
            this.pieceState.set(pos, piece);
        } catch (e) {
            console.log("Board setPiece: ", e.message);
        }
    }

    validMoves(pos: Position) : Position[] {
        return this.pieceState.validMoves(pos);
    }

    move(from: Position, to: Position) {
        try {
            this.pieceState.move(from, to);
        } catch(e){
            console.log("Board move: ", e.message);
        }
    }

}



export { Board };

