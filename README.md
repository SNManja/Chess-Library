# Chess-Library ♟

First chess engine. Made all by intuition, for this project i will not focus in investigating how to build it, i want it to be an all self made challenge.
What this means for the project? I will not implement any optimizations (like specifics algorithms, bitboards, etc). 

My goal with this project is to make a library or api, with the idea of implementing my own chess webpage in the future:
* Database of historic matches
* Ability to play online (via sockets)
* Artificial intelligence to play with
* Portable game notation parser, with the idea of adding the ability to import matches without a hustle

At the moment, whats made is:
* Moves from each piece
* Check detector, valid moves filter when checked. NEEDS TESTING
* Turns, games now can end

TODO:
* Pin detection (filtering moves which should be a suicide for the king)
* En passant
* Ties (stalemates, 50 move rule, threefold repetition). Im just lazy to do this, 
* PGN translator, mainly for debugging purposes
* MAYBE i do a simple user interface for debugging with comfort