class FENparser {
    state;
    turn;
    castling;
    fiftyRules;

    constructor(FENstring) {
        try {
            const FENsplit = FENstring.split(" ");
            this.state = this.parseState(FENsplit[0]);
            if(FENsplit[1] == "-" || FENsplit[1] == "w" || FENsplit[1] == "b") this.turn = FENsplit[1];
            this.castling = FENstring[FENsplit[2]];
            this.fiftyRule = FENstring[3];

        } catch(e) {
            console.log("FENparser constructor error: " + e.message)
        }
    }
    
    static isValidNumber (number) {
        return !isNaN(number) && !(number < 1 || number > 8);
    }

    static isValidLetter (letter) {
        if(letter.length != 1) false;
        return (letter == "Q" || letter == "q") || (letter == "N" || letter == "n") || (letter == "R" || letter == "r") 
            || (letter == "B" || letter == "b") || (letter == "P" || letter == "p") || (letter == "K" || letter == "k") 

    }

    static isValidLine(line){
        try{
            let counter =0;
            line.split("").forEach((char) =>{
                if (FENparser.isValidNumber(char)) { // Check if it's a number
                    counter += Number(char); // Parse the number
                } else if(!FENparser.isValidLetter(char)) {
                    throw new Error("invalid char, " + char)
                } else {
                    counter +=1;
                }
            })
            if(counter != 8) throw new Error("line didnt sum to 8. Counter:" + counter)
            return true;
        } catch(e){
            console.error("FENparser isValidLine: " + e.message + ". Line: " + line)
            return false;
        }

    }

    parseState(FENStateString) { 
        class QueueFENLine{
            line;
            current;

            constructor(FENLine){
                try {
                    let isThisLineValid = FENparser.isValidLine(FENLine)
                    if(!isThisLineValid) throw new Error("Invalid line: " + FENstate[row-1]);
                    this.line = FENLine.split("");
                    this.current = 0;
                } catch(e) {
                    console.error("FENparser parseState QueueFENLine: " + e.message)
                }
            }
            
            isEmpty() {
                return this.line.length == 0;
            }

            next(){
                if(this.current == 0 && this.line.length ==0) throw new Error("QueueFENLine is empty")
                if(this.current == 0) {
                    let getNext = this.line.shift();
                    if(!isNaN(getNext)){
                        
                        this.current = Number.parseInt(getNext);
                        this.current -= 1;
                        return "-"
                    } else {
                        return getNext;
                    }
                } else {
                    this.current -= 1;
                    return "-"
                }
            }

            toString(){
                return `${current}${line}`;
            }
        }
        
        try{
            let stateDict = new Map();
            let FENstate = FENStateString.split("/").reverse(); // Now its in the correct order, from row 1 to 8 rather than 8 to 1
            if(FENstate.length != 8) throw new Error("Invalid FENstate size");
            for(let row = 1; row <= FENstate.length; row++){
                let queue = new QueueFENLine(FENstate[row-1]);
                for(let column of ["a","b","c","d","e","f","g","h"]){
                    stateDict[`${column}${row}`] = queue.next()
                }
                if(!queue.isEmpty()) throw new Error("Queue ended without being empty? Que: " + queue.toString());
            }

            return stateDict;
        } catch (e) {   
            console.error("FENparser parseState error: " + e.message);
        }
    }

    getState(){
        return this.state;
    }

    getTurn() {
        return this.turn;
    }

}

export { FENparser };

