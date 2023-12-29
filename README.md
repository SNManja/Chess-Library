# Chess-Library ♟

First chess engine. The goal es to create a playable game start to end. In the long run, the idea is to make a chess website and maybe an ai. 

My goal with this project is to make a library or api, with the idea of implementing my own chess webpage in the future:
* Database of historic matches
* Ability to play online (via sockets)
* Artificial intelligence to play with
* Portable game notation parser, with the idea of adding the ability to import matches without a hustle

At the moment, whats made is:
* Moves from each piece
* Check detector, valid moves filter when checked. NEEDS TESTING

TODO:
* Turns. This is simple to implement, but i didnt make it at the time because it's not needed for debugging at this stage
* Pin detection (filtering moves which should be a suicide for the king)
* PGN translator, mainly for debugging purposes