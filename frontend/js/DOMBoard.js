import { FENparser } from "./FENparser.js";
import { spriteHandler } from "./spriteHandler.js";
class DOMBoard {
    FEN;
    validMoves;
    freeze = false;

    
    constructor(FENstring, validMoves = new Map()){
        this.FEN = new FENparser(FENstring);
        this.validMoves = validMoves; // Valid moves has to come with the standard board notation (i.e. a1, b5, g2, etc). Map<Position,Positions[]>
        this.initDOM();
        this.validMoves["a2"] = ["a3","a4","b5"] // TODO GETTING MOVES FROM BACK - THIS IS NOW FOR TESTING
    }

    initDOM (){
        
        
        const squares = document.querySelectorAll(".board-square");
        squares.forEach((square)=>{
            
            if(this.FEN.getState()[square.id] != "-") spriteHandler.addSprite(square, this.FEN.getState()[square.id])
            square.addEventListener("click", (e)=>{
                console.log(square.id + " clicked. Turn: " + this.FEN.getTurn())
                const selectedSquares = document.querySelectorAll(".move-square")
                selectedSquares.forEach(selected => {
                    selected.remove();
                });
                
                // Aca puedo enviar un evento general que desacive selecciones
                let player;
                if( this.FEN.getState()[square.id] != "-" ) player = this.FEN.getState()[square.id] == this.FEN.getState()[square.id].toLowerCase() ?  "b" : "w";
                if(!this.freeze && player && player == this.FEN.getTurn()) {
                    this.drawPossibleMoves(square)
                }
                
                
            })
        })
    }

    drawPossibleMoves(DOMsquare){

        let from = DOMsquare.id;
        let validMoves = this.validMoves[from];

        if(validMoves != undefined){
            console.log("validMoves", validMoves);
            for(const to of validMoves) {
                const boardPosition = document.getElementById(to);
                let moveSquare = document.createElement("div");
                moveSquare.className = "move-square";

                moveSquare.addEventListener("click", (e) =>{
                    console.log("from: " + from + " to: " + to)
                    this.move(from,to)
                    e.stopPropagation();
                })
            
                boardPosition.appendChild(moveSquare)
            }
        }
    }
    move(from, to){
        
        return; // TODO : Maybe send request directly to sv?
    }

    

    possibleMoves(squareID){
        let listOfMoves = savedMoves[squareID];

        listOfMoves.forEach((move)=>{
            const moveSquare = document.querySelector(`#${move.id}`) // Checkear con q valor lo paso finalmente? es .id?
        })
    } 
}

export { DOMBoard };

