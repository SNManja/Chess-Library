import { Board } from "./Board";
import { PGNtranslator } from "./PGNTranslator";
import { Position } from "./Position";
import { logger } from "./logger";


let xd = new PGNtranslator(`[Event "Live Chess"]
[Site "Chess.com"]
[Date "2023.05.01"]
[Round "?"]
[White "Pollinki"]
[Black "PromoTX"]
[Result "1-0"]
[ECO "E61"]
[WhiteElo "717"]
[BlackElo "677"]
[TimeControl "180+2"]
[EndTime "18:47:35 PDT"]
[Termination "Pollinki won on time"]

1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. Nf3 O-O 5. e3 d6 6. Bd3 Na6 7. a3 c5 8. d5 e6
9. dxe6 Bxe6 10. Qa4 Bd7 11. Qc2 d5 12. cxd5 c4 13. Bxc4 Nc5 14. Bd2 Re8 15. O-O
Nce4 16. Nxe4 Nxe4 17. Bc3 Bxc3 18. bxc3 Bf5 19. Qb3 Nc5 20. Qb4 Qc7 21. Bb5 a6
22. Bxe8 Nd3 23. Bxf7+ Kxf7 24. Qb3 Nc5 25. d6+ Kg7 26. dxc7 1-0`);



let testBoard = new Board();

let position = new Position("e", 2);
testBoard.printState();

let validMoves = testBoard.getMoves(position)
console.log(validMoves);
testBoard.move(position, new Position("e",3))
testBoard.printState();

testBoard.move( new Position("d",7),  new Position("d",6) );
testBoard.printState();

testBoard.move( new Position("c",8),  new Position("g",4) );
testBoard.printState();

logger.debug(testBoard.getMoves(new Position("d",1)))


console.log("Finished")






