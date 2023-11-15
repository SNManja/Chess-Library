

class Board {
    pieceState;
    kingMoved;

    constructor(PGN) {
        this.kingMoved = [false, false]; 
        this.#createNewBoard();
        if (PGN != undefined){
            this.#buildBoard(PGN);
        } 
    }

    #createNewBoard(){
        // Here im representing the board with white pieces down and black up
        let VACIO = null;
        this.pieceState = [] // 8x8
        let blackPieces = [["R",1],["N", 1],["B", 1],["Q",1],["K",1],["B", 1],["N", 1],["R",1]] // pieceState[0]
        let whitePieces = [["R",0],["N", 0],["B", 0],["Q",0],["K",0],["B", 0],["N", 0],["R",0]] // pieceState[7]
        let fill = [VACIO, VACIO, VACIO,VACIO, VACIO,VACIO,VACIO,VACIO]
        let blackPawns = [["P",1],["P",1],["P",1],["P",1],["P",1],["P",1],["P",1],["P",1]] // pieceState[1]
        let whitePawns = [["P",0],["P",0],["P",0],["P",0],["P",0],["P",0],["P",0],["P",0]] // pieceState[6

        this.pieceState[0] = blackPieces;
        this.pieceState[1] = blackPawns;
        for (let i = 2; i < 6; i++){
            this.pieceState[i] = fill;
        }
        this.pieceState[6] = whitePawns;
        this.pieceState[7] = whitePieces;
    }

    #buildBoard(PGN){
        for(const moves in PGN.getMovements()){
            for (let i = 0; i <= 1; i++) {
                if(isCastling(moves[i],i)){

                } else if(isValidMove(moves[i], i)){
                    let elemToRemove = movingFrom(moves[i], i)
                    this.setMove(moves[i], elemToRemove) 
                } else {
                    throw new Error("Invalid move in PGN");
                }
            }
        }
    }

    getPieceTypeFromMove(move){
        let pieceType;
        switch (move){
            case move.toLowerCase(): // isPawn
                pieceType = "P";
                break;
            case "O-O":
                pieceType = "Castle"
                break;
            case "O-O-O":
                pieceType = "LongCastle"
                break;
            default:
                pieceType = move
        }
        return pieceType
    }

    isValidMove(move, player){
        // Need to check if there's a piece that can make the move 
        // So, get the piece type
        let destination;
        let takes = false;
        let pieceType = this.getPieceTypeFromMove(move)
        if(pieceType === "Castle" || pieceType === "LongCastle"){
            return isValidToCastle(pieceType, player)
        }
        if(move.includes("x")){ // when piece takes 
            takes = true;
            destination = move.split("x")[1];
            return isValidCapture(pieceType, player, destination)
        } else {
            return 
        }
    }

    getState(){
        return this.pieceState;
    }
    


}

export { Board };

