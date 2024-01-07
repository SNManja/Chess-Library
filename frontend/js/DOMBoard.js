
class DOMBoard {
    validMoves;

    
    constructor(FEN = undefined, validMoves = new Map()){
        validMoves = validMoves;
        this.init();
    }

    init (){
        const squares = document.querySelectorAll(".board-square");
        squares.forEach((square)=>{
            square.addEventListener("click", (e)=>{
                this.possibleMoves(square.id)
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

