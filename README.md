# Chess-Library ♟
PGN parser with board implementation

Everything that has been lost, is already re implemented. Some things like the PGN reader need to be redone.

At the time the main problems are:
- Filtering movements and making the move in the board -> This is boards task to avoid coupling

- At the long run, i know how to solve pawns and paths. The only thing that procupies me is the check and checkmate.

- Efficiency is something i have in the back of my mind all the time. This is a game that needs a lot of little calculations, and at the same time i know somethings could be improved at the cost of less maintainability and space. When im certified that things work, i will probably make caching for possible moves of each piece.

- What will be the interface for the end user? I want this library to be abstracted and simplified. In a way that nothing has to be a problem when implementing a chess with this. Even if its done vs a machine, a player or whatever.
