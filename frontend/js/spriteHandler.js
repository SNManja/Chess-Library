class spriteHandler {
    static isSprite(domPosition){
        const sprite = domPosition.querySelector("img");
        return sprite ? true : false;
    }

    static addSprite(domPosition, pieceType){ 
        try{
            let player = pieceType == pieceType.toLowerCase() ? 1 : 0;
            let filePath = `./sprites/pieces/${player == 1 ? "b" : "w"}${pieceType.toUpperCase()}.svg`
    
            let oldSprite =  domPosition.querySelector("img");
            if(oldSprite) this.removeSprite(domPosition);
    
            const sprite = document.createElement("img")
            sprite.src= filePath;
            sprite.setAttribute("class", `sprite player-${player}`);
    
            domPosition.appendChild(sprite);
        } catch (e){
            console.log("spriteHandler addSprite: "+e.message)
        }

    }
    static removeSprite(domPosition){
        const sprite = domPosition.querySelector("img");
        domPosition.removeChild(sprite);
    }
}


export { spriteHandler };

