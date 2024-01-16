function DOMpositionSelector(column, row) {
    try {
        if("a" <= column && column <= "h" && 1<= row && row <= 8) throw new Error("Position doesnt make sense")
        const selectedPosition = document.querySelector(`.col-${column}.row-${row}`)
        return selectedPosition
        
    } catch (e) {
        console.log("DOMpositionSelector: " + e.message)
    }
}

export { DOMpositionSelector }

