import React from "react";
import Sketch from "react-p5";
import "./Canvas.css";
import halton from "../../../Utils/halton.js";
import fetchData from "../../../Utils/fetchData.js";

const url = "https://api.gbif.org/v1/occurrence/";
const baseX = 2;
const baseY = 3;

let bubbles = [];
let lines = [];
let lastMouseX;
let lastMouseY;
let cursor = "grab";
let hoverSpeciesText = "";
let hoverSpeciesX = 0;
let hoverSpeciesY = 0;

function Canvas({ species, selectedGbifObject, setSelectedGbifObject }) {
    // Reset the selected button when no object has been selected
    if (!selectedGbifObject) {
        bubbles.forEach((bubble) => {
            bubble.selected = false;
        });
    }

    // Setup for the canvas
    const setup = (p5, canvasParentRef) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        p5.createCanvas(width, height).parent(canvasParentRef);
        p5.frameRate(60);

        let xAxisOffset = 0;
        let yAxisOffset = 0;

        species.forEach((species) => {
            let lastBubbleTotal = bubbles.length;
            let speciesSurface = (species.ids.length / 2) * 250 * 250; // Calculate the required surface
            let speciesWidth = Math.sqrt(speciesSurface); // Set the width and height equal to the root of the required surface
            let speciesHeight = Math.sqrt(speciesSurface);
            let indexTotal = 0;
            yAxisOffset = height / 2 - speciesHeight / 2; // Calculate the y axis offset to center the bubbles verticaly

            // Add the bubbles
            species.ids.forEach((id) => {
                let x = halton(indexTotal, baseX) * speciesWidth + xAxisOffset;
                let y = halton(indexTotal, baseY) * speciesHeight + yAxisOffset;
                let r = Math.random() * (55 - 40) + 40;

                bubbles.push(new Bubble(x, y, r, id, species.species));
                indexTotal++;
            });

            xAxisOffset += speciesWidth + 250; // Add the width to the offset to prevent species from overlapping

            // Add the lines to the canvas
            for (let i = lastBubbleTotal; i < bubbles.length; i++) {
                for (let j = lastBubbleTotal; j < bubbles.length; j++) {
                    if (bubbles[i] !== bubbles[j]) {
                        let d = p5.dist(bubbles[i].x, bubbles[i].y, bubbles[j].x, bubbles[j].y);
                        if (
                            (d >= 150 && d <= 250) || // Add a line when the distance between the bubbles is between 150 and 250
                            bubbles.length - lastBubbleTotal === 2 || // Or when a species only has two or three bubbles
                            bubbles.length - lastBubbleTotal === 3
                        ) {
                            lines.push(
                                new Line(bubbles[i].x, bubbles[i].y, bubbles[j].x, bubbles[j].y)
                            );
                            bubbles[i].line = true;
                            bubbles[j].line = true;
                        }
                    }
                }
            }

            // Ensure that each bubble is at least connected to one other bubble
            for (let i = lastBubbleTotal; i < bubbles.length; i++) {
                if (!bubbles[i].line) {
                    for (let j = lastBubbleTotal; j < bubbles.length; j++) {
                        let d = p5.dist(bubbles[i].x, bubbles[i].y, bubbles[j].x, bubbles[j].y);
                        if (d >= 50 && d <= 350) {
                            lines.push(
                                new Line(bubbles[i].x, bubbles[i].y, bubbles[j].x, bubbles[j].y)
                            );
                            break;
                        }
                    }
                }
            }
        });

        // Move the offset to the bubbles and lines to center the camera
        bubbles.forEach((bubble) => {
            bubble.x -= xAxisOffset / 2 - width / 2;
        });

        lines.forEach((line) => {
            line.x1 -= xAxisOffset / 2 - width / 2;
            line.x2 -= xAxisOffset / 2 - width / 2;
        });
    };

    const draw = (p5) => {
        p5.background(186, 216, 235);
        p5.cursor(cursor);

        // Draw the lines
        lines.forEach((line) => {
            p5.stroke(13, 92, 99);
            p5.strokeWeight(5);
            p5.line(line.x1, line.y1, line.x2, line.y2);
        });

        // Draw the bubbles
        bubbles.forEach((bubble) => {
            if (bubble.hover) {
                cursor = "pointer";
            }
            if (bubble.selected || bubble.hover) {
                p5.fill(13, 92, 99);
            } else {
                p5.fill(68, 161, 160);
            }
            p5.stroke(13, 92, 99);
            p5.strokeWeight(5);
            p5.ellipse(bubble.x, bubble.y, bubble.r);
        });

        // Draw the hover text if it is present
        if (hoverSpeciesText !== "") {
            const textSize = 15;
            const padding = 5;
            p5.fill(0, 0, 0);
            p5.strokeWeight(0);
            p5.rect(
                hoverSpeciesX,
                hoverSpeciesY - textSize,
                p5.textWidth(hoverSpeciesText) + 2 * padding,
                textSize * 1.4,
                5
            );

            p5.fill(255, 255, 255);
            p5.textSize(textSize);
            p5.text(hoverSpeciesText, hoverSpeciesX + padding, hoverSpeciesY);
        }
    };

    const mouseMoved = (p5, event) => {
        if (event.target.className === "p5Canvas") {
            // Check if mouse is currenly hovering over one of the bubbles
            bubbles.forEach((bubble) => {
                let d = p5.dist(bubble.x, bubble.y, p5.mouseX, p5.mouseY);
                if (d < bubble.r) {
                    bubble.hover = true;
                    hoverSpeciesText = bubble.species;
                    hoverSpeciesX = bubble.x - bubble.r / 2;
                    hoverSpeciesY = bubble.y - bubble.r / 2 - 15;
                } else {
                    bubble.hover = false;
                }
            });

            // If the mouse is currenly hovering over a bubble change the cursor into a pointer
            if (bubbles.some((e) => e.hover === true)) {
                cursor = "pointer";
            } else {
                hoverSpeciesText = "";
                cursor = "grab";
            }
        }
    };

    const mouseClicked = (p5, event) => {
        // Only select an object when the user clicks on the canvas
        if (event.target.className === "p5Canvas") {
            bubbles.forEach((bubble) => {
                let d = p5.dist(bubble.x, bubble.y, p5.mouseX, p5.mouseY);
                if (d < bubble.r) {
                    // Center the screen on the bubble
                    const changeX = bubble.x - window.innerWidth / 2;
                    const changeY = bubble.y - window.innerHeight / 2;
                    moveCamera(changeX, changeY);

                    // Select the bubble and fetch the corresponding GBIF data
                    bubble.selected = true;
                    fetchData(url + bubble.id).then((d) => setSelectedGbifObject(d));

                    // Reset the other bubbles when a new bubble is selected
                    for (let i = 0; i < bubbles.length; i++) {
                        if (bubble !== bubbles[i]) {
                            bubbles[i].selected = false;
                        }
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

        lastMouseX = p5.mouseX;
        lastMouseY = p5.mouseY;
        cursor = "grabbing";
    };

    const mouseReleased = () => {
        lastMouseX = null;
        lastMouseY = null;
        cursor = "grab";
    };

    function moveCamera(changeX, changeY) {
        lines.forEach((line) => {
            line.x1 -= changeX;
            line.y1 -= changeY;
            line.x2 -= changeX;
            line.y2 -= changeY;
        });

        bubbles.forEach((bubble) => {
            bubble.x -= changeX;
            bubble.y -= changeY;
        });

        hoverSpeciesX -= changeX;
        hoverSpeciesY -= changeY;
    }

    return (
        <Sketch
            setup={setup}
            draw={draw}
            mouseMoved={mouseMoved}
            mouseClicked={mouseClicked}
            mouseDragged={mouseDragged}
            mouseReleased={mouseReleased}
        />
    );
}

class Bubble {
    constructor(x, y, r, id, species) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;
        this.species = species;
        this.line = false;
        this.selected = false;
        this.hover = false;
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
