import React from "react";
import { UNSAFE_LocationContext, useNavigate } from "react-router";
import Sketch from "react-p5";
import halton from "../../../Utils/halton.js";

const baseX = 2;
const baseY = 3;

let bubbles = [];
let text = [];
let lastMouseX;
let lastMouseY;
let cursor = "grab";

// Deze code is super last minute in elkaar geflanst en is dus best heel erg slecht. Please forgive me, for I have sinned.

function Canvas({ rankChildren, setRankChildren, kingdom, family, currentUrl }) {
    let navigate = useNavigate();

    let speciesSurface = rankChildren.length * 325 * 325; // Calculate the required surface
    let requiredWidth = Math.sqrt(speciesSurface); // Set the width and height equal to the root of the required surface
    let requiredHeight = Math.sqrt(speciesSurface);
    let xAxisOffset = window.innerWidth / 2 - requiredWidth / 2;
    let yAxisOffset = window.innerHeight / 2 - requiredHeight / 2;

    let bubbleColor = { r: 239, g: 241, b: 243 };
    let strokeColor = { r: 34, g: 56, b: 67 };

    // Select the colors based on the kingdom
    if (kingdom) {
        if (kingdom === "Animalia") {
            bubbleColor = { r: 206, g: 160, b: 174 };
            strokeColor = { r: 104, g: 69, b: 81 };
        } else if (kingdom === "Plantae") {
            bubbleColor = { r: 177, g: 207, b: 95 };
            strokeColor = { r: 27, g: 81, b: 45 };
        } else if (kingdom === "Fungi") {
            bubbleColor = { r: 115, g: 111, b: 78 };
            strokeColor = { r: 59, g: 57, b: 35 };
        }
    }

    let minCount = Infinity;
    let maxCount = -Infinity;
    for (let i = 0; i < rankChildren.length; i++) {
        let tmp = rankChildren[i].count;
        if (tmp < minCount) minCount = tmp;
        if (tmp > maxCount) maxCount = tmp;
    }

    bubbles = [];
    rankChildren.forEach((child, index) => {
        let x = halton(index, baseX) * requiredWidth + xAxisOffset;
        let y = halton(index, baseY) * requiredHeight + yAxisOffset;
        let r = calculateBubbleSize(minCount, maxCount, child.count);
        bubbles.push(new Bubble(x, y, r, child.taxonomicRankName));
    });

    text = [];
    bubbles.forEach((bubble) => {
        let name = bubble.rankName;
        let x = bubble.x;
        let y = bubble.y;
        text.push(new TextNode(x, y, name));
    });

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    };

    const draw = (p5) => {
        p5.background(216, 212, 212);
        p5.cursor(cursor);
        p5.frameRate(60);

        bubbles.forEach((bubble) => {
            p5.fill(bubbleColor.r, bubbleColor.g, bubbleColor.b);
            p5.stroke(strokeColor.r, strokeColor.g, strokeColor.b);
            p5.strokeWeight(5);
            p5.ellipse(bubble.x, bubble.y, bubble.r);
        });

        text.forEach((textItem) => {
            p5.fill(0, 0, 0);
            p5.strokeWeight(0);
            p5.textSize(24);

            let textWidth = p5.textWidth(textItem.name) / 2;

            p5.text(textItem.text, textItem.x - textWidth, textItem.y);
        });
    };

    // Check if user clicks on bubble
    const mouseClicked = (p5, event) => {
        if (event.target.className === "p5Canvas") {
            bubbles.forEach((bubble) => {
                let d = p5.dist(bubble.x, bubble.y, p5.mouseX, p5.mouseY);
                if (d < bubble.r / 2) {
                    if (family) {
                        navigate(currentUrl + bubble.rankName + "/objects");
                    } else {
                        navigate(currentUrl + bubble.rankName);
                        setRankChildren(
                            rankChildren.find((e) => e.taxonomicRankName === bubble.rankName)
                        );
                    }
                }
            });
        }
    };

    const mouseDragged = (p5) => {
        // Move the camera based on the change of the mouse position
        if (lastMouseX) {
            const changeMouseX = lastMouseX - p5.mouseX;
            const changeMouseY = lastMouseY - p5.mouseY;
            moveCamera(changeMouseX, changeMouseY);
        }

        // Set the last mouse position and change the cursor
        lastMouseX = p5.mouseX;
        lastMouseY = p5.mouseY;
        cursor = "grabbing";
    };

    const mouseReleased = () => {
        // Reset last mouse position and cursor when the mouse is released
        lastMouseX = null;
        lastMouseY = null;
        cursor = "grab";
    };

    function calculateBubbleSize(minCount, maxCount, count) {
        const minSize = 150;
        const maxSize = 300;
        const minMaxDifference = maxCount - minCount;
        if (minCount !== count) {
            let stepCount = (maxSize - minSize) / minMaxDifference;
            let steps = count - minCount;
            return stepCount * steps + minSize;
        }
        return minSize;
    }

    function moveCamera(changeX, changeY) {
        bubbles.forEach((bubble) => {
            bubble.x -= changeX;
            bubble.y -= changeY;
        });

        text.forEach((textItem) => {
            textItem.x -= changeX;
            textItem.y -= changeY;
        });
    }

    return (
        <Sketch
            setup={setup}
            draw={draw}
            mouseDragged={mouseDragged}
            mouseReleased={mouseReleased}
            mouseClicked={mouseClicked}
        />
    );
}

class Bubble {
    constructor(x, y, r, rankName) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rankName = rankName;
    }
}

class TextNode {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }
}

export default Canvas;
