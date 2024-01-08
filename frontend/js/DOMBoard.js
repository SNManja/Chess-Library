import { FENparser } from "./FENparser.js";
import { spriteHandler } from "./spriteHandler.js";
class DOMBoard {
    FEN;
    validMoves;

    
    constructor(FENstring, validMoves = new Map()){
        this.FEN = new FENparser(FENstring);
        this.validMoves = validMoves;
        this.initDOM();
    }

    initDOM (){
        const squares = document.querySelectorAll(".board-square");
        squares.forEach((square)=>{
            console.log(`square.id ${square.id}, ${this.FEN.getState()[square.id]}`);
            if(this.FEN.getState()[square.id] != "-") spriteHandler.addSprite(square, this.FEN.getState()[square.id])
            square.addEventListener("click", (e)=>{
                //console.log(this.possibleMoves(square.id)) // TODO
            })
        })
    }

    possibleMoves(squareID){
        let listOfMoves = savedMoves[squareID];

        listOfMoves.forEach((move)=>{
            const moveSquare = document.querySelector(`#${move.id}`) // Checkear con q valor lo paso finalmente? es .id?
        })
    } 
}

export { DOMBoard };

