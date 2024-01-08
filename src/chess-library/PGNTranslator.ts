

class PGNtranslator {
    headers : Map<string,string>;
    movements ;
    exceptions;
    matchState;

    constructor(PGNString) {
        this.headers = new Map<string,string>();
        const headerRegex = new RegExp(/\[([^\[\]]+)\]/g); // CHECK THAT ITS CORRECT
        let tempHeaders = PGNString.split(headerRegex).filter((elem)=>{
            return elem != "\n"
        })

        let tempMovements = tempHeaders.pop() // set aside movements from headers
        if(tempHeaders.length < 7){
            /*
            Los headers obligatorios son los siguientes:
                Event: El nombre del evento en el que se jugó la partida.
                Site: La ubicación del evento.
                Date: La fecha de la partida.
                Round: La ronda en la que se jugó la partida.
                White: El nombre del jugador blanco.
                Black: El nombre del jugador negro.
                Result: El resultado de la partida.
            */
            throw new Error("PGN doesn't have all the necessary headers");
        }

        tempHeaders.forEach((header) => {
            if(header == ""){
                return;
            }
            let value = header.match(/"([^"]*)"/g)[0].split('"')[1]

            let key = header.replace(/"([^"]*)"/g, "")

            this.headers[key] = value
        })
        
        // Now parse the movements
        tempMovements = tempMovements.replace(/\n/g, " ").split(/\d+\.{1}(?![^{]*})(?!\.)/g)
        
        this.movements = []
        this.exceptions = []
        let possibleEndings = ["0-1", "1-0", "1/2-1/2", "*"]

        for (const movement of tempMovements){  
            let thisMove = movement.trim().split(" ")
            if(thisMove.length == 2){
                this.movements.push(thisMove)
                continue
            } else if(thisMove.length == 1 && thisMove[0] == ''){ // Avoid the case ['']
                continue
            } else if(thisMove[thisMove.length - 1] == "("){ // Avoid comment of the best possible path that chess.com makes
                break
            } else if(thisMove.length == 3 &&  possibleEndings.includes(thisMove[thisMove.length - 1])){ // Black wins
                this.movements.push(thisMove)
                break
            } else {
                this.movements.push([thisMove[0], thisMove[thisMove.length - 1]]) // When there's comments... Horrible horrible thing, not robust at all
                continue
            }
        }
            
        if(this.exceptions.length > 0){ 
            throw new Error("Exception in the PGN translator")
        }
            
    }



    getHeaders(){
        return this.headers;
    }

    getMovements(){
        return this.movements
    }

    getExceptions(){// this is for debugging purposes
        return this.exceptions
    }

}

export { PGNtranslator };

