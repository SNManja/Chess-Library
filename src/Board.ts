import { Piece, pieceFactory } from "./pieces";

class Board {
    pieceState : Array<Piece>;
    kingMoved;

    constructor() {
        this.kingMoved = [false, false]; 
        this.createNewBoard();
    }

    
    createNewBoard(){
        this.pieceState = [] 
        let blackPieces = [pieceFactory["R"](1,"a",8),pieceFactory["N"](1,"b",8),pieceFactory["B"](1,"c",8),pieceFactory["Q"](1,"d",8),
                            pieceFactory["K"](1,"e",8),pieceFactory["B"](1,"f",8), pieceFactory["N"](1,"g",8),pieceFactory["R"](1,"h",8)] // pieceState[0]
        let whitePieces = [pieceFactory["R"](1,"a",1),pieceFactory["N"](1,"b",1),pieceFactory["B"](1,"c",1),pieceFactory["Q"](1,"d",1),
                            pieceFactory["K"](1,"e",1),pieceFactory["B"](1,"f",1), pieceFactory["N"](1,"g",1),pieceFactory["R"](1,"h",1)] 
        let blackPawns = [pieceFactory["P"](1,"a",7),pieceFactory["P"](1,"b",7),pieceFactory["P"](1,"c",7),pieceFactory["P"](1,"d",7),pieceFactory["P"](1,"e",7),pieceFactory["P"](1,"f",7),pieceFactory["P"](1,"g",7),pieceFactory["P"](1,"h",7)] // pieceState[1]
        let whitePawns = [pieceFactory["P"](1,"a",2),pieceFactory["P"](1,"b",2),pieceFactory["P"](1,"c",2),pieceFactory["P"](1,"d",2),pieceFactory["P"](1,"e",2),pieceFactory["P"](1,"f",2),pieceFactory["P"](1,"g",2),pieceFactory["P"](1,"h",2)] // pieceState[1]

        for(let i = 0; i < 8; i++){
            this.pieceState.push(blackPieces[i])
            this.pieceState.push(whitePieces[i])
            this.pieceState.push(whitePawns[i])
            this.pieceState.push(blackPawns[i])
        }
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
    


}

export { Board };

