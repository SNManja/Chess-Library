const flipBoardButton =document.querySelector('#flip-board-button');


export default ()=>{
    flipBoardButton.addEventListener('click',(e)=>{
        const board = document.querySelector('#board')
        document.querySelectorAll('.board-row').forEach((row)=>{
            if(board.style.flexDirection =="column"){
                row.style.flexDirection = "row";
            } else {
                row.style.flexDirection = "row-reverse";
            }
        })
        board.style.flexDirection = board.style.flexDirection =="column" ? "column-reverse" : "column";
    })
}

