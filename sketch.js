/**
 *  @author 
 *  @date 2022.07.12
 *
 * A list of unneeded exceptions to the file structure in canisback.com
 *
 * Domination:
 *    Taste of Blood - GreenTerror_TasteOfBlood.png
 *
 * Inspiration:
 *    ApproachVelocity - missing
 *    Certain obsolete runes, like Kleptomancy
 *
 * Precision:
 *    LethalTempo - LethalTempoTemp.png ☒
 *    Overheal - No directory
 *    Triumph - No directory
 *
 * Resolve:
 *    Aftershock - VeteranAftershock/VeteranAftershock.png
 *
 * Sorcery:
 *    Celerity - CelerityTemp.png
 *    LastStand should be in Precision
 *    NimbusCloak - 6361.png, must have been an item previously
 *    NullifyingOrb - Pokeshield.png
 *    Unflinching should be in Resolve
 *
 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let runeImageList = []
let runeImageListIndex

// our current rune image
let currentRuneImage

// image size, imageSize by imageSize
let imageSize = 30

function preload() {
    font = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)

    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    // background(234, 34, 24)

    loadJSON("https://ddragon.canisback.com/12.12.1/data/en_US/runesReforged.json", gotData)
}

function gotData(data) {
    // iterate through all the paths in our data
    for (let paths of data) {
        let currentRunePathImageList = []

        currentRunePathImageList.push(
            loadImage(
                `https://ddragon.canisback.com/img/${paths["icon"]}`
            )
        )

        // iterate through the slots in the current path
        for (let runes of paths["slots"]) {
            // iterate through the runes of each path, and output the key
            for (let rune of runes["runes"]) {
                let runeKey = rune["key"]

                print(runeKey)

                print(`https://ddragon.canisback.com/img/${rune["icon"]}`)

                let runeImage = loadImage(`https://ddragon.canisback.com/img/${rune["icon"]}`)

                // fetch the image of the current rune
                currentRunePathImageList.push(runeImage)

                // runeImage.width = imageSize
                // runeImage.height = imageSize
                //
                // image(runeImage, 0, 0)
            }
        }
        runeImageList.push(currentRunePathImageList)

        // whitespace between each rune page
        console.log("\n\n\n")
    }
    //
    // // set the rune image list index to a random image
    // runeImageListIndex = int(random(0, runeImageList.length))
    //
    // currentRuneImage = loadImage(runeImageList[runeImageListIndex])
    //
    // print(runeImageList[runeImageListIndex])
}

function draw() {
    background(234, 34, 24)
    //
    // currentRuneImage.width = imageSize
    // currentRuneImage.height = imageSize
    //
    // image(currentRuneImage, 0, 0)
    //

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    // debugCorner.show()

    if (frameCount > 3000)
        noLoop()

    // the current position of each image
    let imageXPos = 0
    let imageYPos = 0

    for (let pathRuneImage of runeImageList) {
        for (let runeImage of pathRuneImage) {
            runeImage.resize(imageSize, 0)

            image(runeImage, imageXPos, imageYPos)

            imageXPos += imageSize
        }

        imageYPos += imageSize
        imageXPos = 0
    }

    // noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

        /* semi-transparent background */
        fill(0, 0, 0, 10)
        rectMode(CORNERS)
        const TOP_PADDING = 3 /* extra padding on top of the 1st line */
        rect(
            0,
            height,
            width,
            DEBUG_Y_OFFSET - LINE_HEIGHT*this.debugMsgList.length - TOP_PADDING
        )

        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}