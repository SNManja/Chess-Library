class spriteHandler {
    static isSprite(domPosition){
        const sprite = domPosition.querySelector("img");
        return sprite ? true : false;
    }

    static addSprite(domPosition, pieceType, player){ 
        if(player != 0 && player != 1) throw new Error("invalid player")
        let filePath = `./sprites/pieces/${player == 1 ? "b" : "w"}${pieceType}.svg`

        let oldSprite =  domPosition.querySelector("img");
        if(oldSprite) this.removeSprite(domPosition);

        const sprite = document.createElement("img")
        sprite.src= filePath;
        sprite.setAttribute("class", `sprite player-${player}`);

        domPosition.appendChild(sprite);
    }
    static removeSprite(domPosition){
        const sprite = domPosition.querySelector("img");
        domPosition.removeChild(sprite);
    }
}


export { spriteHandler };

