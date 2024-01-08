
import { DOMBoard } from './js/DOMBoard.js';
import DOMCustomizations from './js/DOMCustomizations.js';
//import { DOMpositionSelector } from "./utils.js";
//import { spriteHandler } from "./spriteHandler.js";

DOMCustomizations();

console.log("JS workin");




const Board = new DOMBoard("rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1");

let stateString = FEN.getState()
console.log(stateString);





console.log("Its onnn")
