import { Board } from "./Board";
import { Position } from "./Position";


let testBoard = new Board();

let position = new Position("e", 2);
testBoard.printState();

let validMoves = testBoard.getMoves(position)
console.log(validMoves);
testBoard.move(position, new Position("e",3))
//testBoard.printState();

testBoard.move( new Position("d",7),  new Position("d",6) );
//testBoard.printState();


console.debug("White king moves: ")
console.debug(testBoard.getMoves(new Position("d",1)))


console.log("Finished")






