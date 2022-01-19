import React from "react";
import Sketch from "react-p5";
import "./Canvas.css";
import fetchData from "../../../Utils/fetchData.js";

const url = "https://api.gbif.org/v1/occurrence/";
const baseX = 2;
const baseY = 3;

let bubbles = [];
let lastMousePosition = null;

function Canvas({ gbifIds, setGbifObject }) {
    const setup = (p5, canvasParentRef) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let canvasFactor = 1;

        // Create the canvas
        p5.createCanvas(width, height).parent(canvasParentRef);

        // This is kind of bad but it works for now
        if (gbifIds.length <= 15) {
            canvasFactor = 0.5;
        } else if (gbifIds.length >= 100) {
            canvasFactor = 2;
        }

        // Create the bubbles based on the provided gbif ids
        gbifIds.forEach((id, index) => {
            let x = halton(index, baseX) * width * canvasFactor;
            let y = halton(index, baseY) * height * canvasFactor;
            // This is also kind of bad but it works for now
            if (canvasFactor === 2) {
                x -= width / 2;
                y -= height / 2;
            } else if (canvasFactor === 0.5) {
                x += width * 0.25;
                y += height * 0.25;
            }
            let r = 30; // Circle radius
            bubbles.push(new Bubble(x, y, r, id)); // Push
        });

        p5.frameRate(30);
    };

    const draw = (p5) => {
        // Draw the background of the canvas
        p5.background(255, 255, 250);

        // Draw the bubbles onto the canvas
        bubbles.forEach((bubble) => {
            p5.stroke(13, 92, 99);
            p5.strokeWeight(2.5);
            p5.fill(68, 161, 160);
            p5.ellipse(bubble.x, bubble.y, bubble.r);
        });
    };

    const mouseClicked = (p5) => {
        bubbles.forEach((bubble) => {
            let d = p5.dist(p5.mouseX, p5.mouseY, bubble.x, bubble.y);
            if (d < bubble.r) {
                fetchData(url + bubble.id).then((d) => {
                    setGbifObject(d);
                });
            }
        });
    };

    const mouseDragged = (p5) => {
        if (lastMousePosition) {
            // Calculate the change in the mouse position
            const change = {
                x: lastMousePosition.x - p5.mouseX,
                y: lastMousePosition.y - p5.mouseY
            };
            bubbles.forEach((bubble) => {
                bubble.x -= change.x;
                bubble.y -= change.y;
            });
        }
        lastMousePosition = {
            x: p5.mouseX,
            y: p5.mouseY
        };
    };

    const mouseReleased = () => {
        lastMousePosition = null;
    };

    return (
        <Sketch
            setup={setup}
            draw={draw}
            mouseClicked={mouseClicked}
            mouseDragged={mouseDragged}
            mouseReleased={mouseReleased}
        />
    );
}

function halton(index, base) {
    let result = 0;
    let f = 1 / base;
    let i = index;
    while (i > 0) {
        result = result + f * (i % base);
        i = Math.floor(i / base);
        f = f / base;
    }
    return result;
}

class Bubble {
    constructor(x, y, r, id) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;
    }
}

export default Canvas;
