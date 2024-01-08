import { Board } from "../chess-library/board";
import { Position } from "../chess-library/position";


let testBoard = new Board();

let position = new Position("e", 2);
testBoard.printState();

let validMoves = testBoard.getMoves(position)
console.log(validMoves);
testBoard.move(position, new Position("e",3))
testBoard.printState();

console.log("Finished")






