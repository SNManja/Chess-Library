import { test } from "@jest/globals";
import { Board } from "../src/board";
import { Position } from "../src/position";

const pos = (c , r) => new Position(c, r);
 

test("Fool's mate", ()=>{
    
    let testBoard = new Board();

    testBoard.move(pos("f",2), pos("f",3));
    expect(testBoard.getPiece(pos("f",3))).not.toBeUndefined();

    testBoard.move(pos("e",7), pos("e",6));
    expect(testBoard.getPiece(pos("e",6))).not.toBeUndefined();

    testBoard.move(pos("g",2),  pos("g",4));
    expect(testBoard.getPiece(pos("g",4))).not.toBeUndefined();

    expect(testBoard.getPiece(pos("d",8)).getType()).toBe("Q")

    testBoard.move(pos("d",8), pos("h",4));
    expect(testBoard.getPiece(pos("h",4))).not.toBeUndefined();

    expect(testBoard.getResult()).not.toBe("ongoing")
})







