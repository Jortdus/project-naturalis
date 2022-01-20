import React from "react";
import Sketch from "react-p5";
import "./Canvas.css";
import fetchData from "../../../Utils/fetchData.js";

const url = "https://api.gbif.org/v1/occurrence/";
const baseX = 2;
const baseY = 3;

let bubbles = [];
let lines = [];
let lastMousePosition = null;
let cursor = "grab";

function Canvas({ gbifIds, gbifObject, setGbifObject }) {
    if (!gbifObject) {
        bubbles.forEach((bubble) => {
            bubble.selected = false;
        });
    }

    const setup = (p5, canvasParentRef) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let canvasFactor = 1;

        // Create the canvas
        p5.createCanvas(width, height).parent(canvasParentRef);

        // This is kind of bad but it works for now
        if (gbifIds.length <= 15) {
            canvasFactor = 0.5;
        } else if (gbifIds.length >= 100 && gbifIds.length < 250) {
            canvasFactor = 2;
        } else if (gbifIds.length >= 250) {
            canvasFactor = 3;
        }

        console.log(canvasFactor);

        // Create the bubbles based on the provided gbif ids
        gbifIds.forEach((id, index) => {
            let x = halton(index, baseX) * width * canvasFactor;
            let y = halton(index, baseY) * height * canvasFactor;

            // This is also kind of bad but it works for now
            if (canvasFactor === 0.5) {
                x += width * 0.25;
                y += height * 0.25;
            } else if (canvasFactor === 2) {
                x -= width / 2;
                y -= height / 2;
            } else if (canvasFactor === 3) {
                x -= width;
                y -= height;
            }
            let r = Math.random() * (55 - 40) + 40; // Circle radius
            bubbles.push(new Bubble(x, y, r, id));
        });

        bubbles.forEach((bubble) => {
            for (let i = 0; i < bubbles.length; i++) {
                let d = p5.dist(bubble.x, bubble.y, bubbles[i].x, bubbles[i].y);
                if (d < 125) {
                    lines.push(
                        new Line(bubble.x, bubble.y, bubbles[i].x, bubbles[i].y)
                    );
                }
            }
        });

        p5.frameRate(30);
    };

    const draw = (p5) => {
        // Draw the background of the canvas
        p5.background(186, 216, 235);

        p5.cursor(cursor);

        // Draw the lines that connect the bubbles
        lines.forEach((line) => {
            p5.stroke(13, 92, 99);
            p5.strokeWeight(5);
            p5.line(line.x1, line.y1, line.x2, line.y2);
        });

        // Draw the bubbles onto the canvas
        bubbles.forEach((bubble) => {
            p5.stroke(13, 92, 99);
            p5.strokeWeight(5);
            if (bubble.selected) {
                p5.fill(13, 92, 99);
            } else {
                p5.fill(68, 161, 160);
            }
            p5.ellipse(bubble.x, bubble.y, bubble.r);
        });
    };

    const mouseClicked = (p5) => {
        bubbles.forEach((bubble) => {
            let d = p5.dist(p5.mouseX, p5.mouseY, bubble.x, bubble.y);
            if (d < bubble.r) {
                let changeX = bubble.x - window.innerWidth / 2;
                let changeY = bubble.y - window.innerHeight / 2;

                bubbles.forEach((bubble) => {
                    bubble.selected = false;
                    bubble.x -= changeX;
                    bubble.y -= changeY;
                });

                lines.forEach((line) => {
                    line.x1 -= changeX;
                    line.y1 -= changeY;
                    line.x2 -= changeX;
                    line.y2 -= changeY;
                });

                fetchData(url + bubble.id).then((d) => {
                    bubble.selected = true;
                    setGbifObject(d);
                });
            }
        });
    };

    const mouseDragged = (p5) => {
        cursor = "grabbing";

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
            lines.forEach((line) => {
                line.x1 -= change.x;
                line.y1 -= change.y;
                line.x2 -= change.x;
                line.y2 -= change.y;
            });
        }
        lastMousePosition = {
            x: p5.mouseX,
            y: p5.mouseY
        };
    };

    const mouseReleased = () => {
        cursor = "grab";
        lastMousePosition = null;
    };

    const mouseMoved = (p5) => {};

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
        this.selected = false;
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

export default Canvas;
