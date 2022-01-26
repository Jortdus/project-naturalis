import React from "react";
import Sketch from "react-p5";
import "./Canvas.css";
import halton from "../../../Utils/halton.js";

const baseX = 2;
const baseY = 3;
const imgWidth = 200; // Hardcoded width and height for example image.
const imgHeight = 0.78 * imgWidth;

let bubbles = [];
let lines = [];
let lastMouseX;
let lastMouseY;
let cursor = "grab";
let hoverSpeciesText = "";
let hoverSpeciesX = 0;
let hoverSpeciesY = 0;
let strokeColor;
let bubbleColor;
let changeXPerTick = 0;
let changeYPerTick = 0;
let animationTicks = 0;

let img;
let imgX;
let imgY;
let trainglePositions = {};

function Canvas({
    species,
    gbifObjects,
    objectsWithtImage,
    selectedGbifObject,
    setSelectedGbifObject
}) {
    //
    if (gbifObjects) {
        // Reset the selected button when no object has been selected
        if (!selectedGbifObject) {
            bubbles.forEach((bubble) => {
                bubble.selected = false;
            });
        }

        const preload = (p5) => {
            img = p5.loadImage(process.env.PUBLIC_URL + "/exampleImg.png");
        };

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
                    let r = gbifObjects.find((e) => e.key == id).radius;

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

                // Select the colors based on the kingdom
                if (gbifObjects[0].kingdom === "Animalia") {
                    bubbleColor = p5.color(206, 160, 174);
                    strokeColor = p5.color(104, 69, 81);
                } else if (gbifObjects[0].kingdom === "Plantae") {
                    bubbleColor = p5.color(177, 207, 95);
                    strokeColor = p5.color(27, 81, 45);
                } else if (gbifObjects[0].kingdom === "Fungi") {
                    bubbleColor = p5.color(115, 111, 78);
                    strokeColor = p5.color(59, 57, 35);
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

            if (objectsWithtImage[0]) {
                placeImageAndTraingle(objectsWithtImage[0]); // Place the example image into the canvas
            }
        };

        let ticks = 0;
        let imgIndex = 0;
        const draw = (p5) => {
            p5.background(216, 212, 212);
            p5.cursor(cursor);

            // Draw the lines
            lines.forEach((line) => {
                p5.stroke(strokeColor);
                p5.strokeWeight(5);
                p5.line(line.x1, line.y1, line.x2, line.y2);
            });

            // Draw the bubbles
            bubbles.forEach((bubble) => {
                if (bubble.hover) {
                    cursor = "pointer";
                }
                if (bubble.selected || bubble.hover) {
                    p5.fill(strokeColor);
                } else {
                    p5.fill(bubbleColor);
                }
                p5.stroke(strokeColor);
                p5.strokeWeight(5);
                p5.ellipse(bubble.x, bubble.y, bubble.r);
            });

            p5.image(img, imgX, imgY, imgWidth, imgHeight);
            p5.fill(255, 255, 255);
            p5.strokeWeight(0);
            p5.triangle(
                trainglePositions.x1,
                trainglePositions.y1,
                trainglePositions.x2,
                trainglePositions.y2,
                trainglePositions.x3,
                trainglePositions.y3
            );

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

            // Move the example image every 5 seconds
            ticks++;
            if (ticks >= 300) {
                ticks = 0;
                if (objectsWithtImage[0]) {
                    // Only when one object has an image.
                    imgIndex++;
                    if (imgIndex < objectsWithtImage.length) {
                        placeImageAndTraingle(objectsWithtImage[imgIndex]);
                    } else {
                        placeImageAndTraingle(objectsWithtImage[0]);
                        imgIndex = 0;
                    }
                }
            }

            if ((changeXPerTick !== 0 || changeYPerTick !== 0) && animationTicks < 20) {
                animationTicks++;
                moveCamera(changeXPerTick, changeYPerTick);
            } else {
                changeXPerTick = 0;
                changeYPerTick = 0;
            }
        };

        const mouseMoved = (p5, event) => {
            if (event.target.className === "p5Canvas") {
                // Check if mouse is currenly hovering over one of the bubbles
                bubbles.forEach((bubble) => {
                    let d = p5.dist(bubble.x, bubble.y, p5.mouseX, p5.mouseY);
                    if (d < bubble.r / 2) {
                        bubble.hover = true;
                        hoverSpeciesText = bubble.species;
                        hoverSpeciesX = bubble.x - p5.textWidth(hoverSpeciesText) / 2 - 5; // Postion the hover text in the middle of the bubble
                        hoverSpeciesY = bubble.y - bubble.r / 2 - 15; // Postion the hover text above the bubble
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
                    if (d < bubble.r / 2) {
                        // Center the screen on the bubble by culculating the distance the objects need to be moved per tick
                        changeXPerTick = (bubble.x - window.innerWidth / 2) / 20;
                        changeYPerTick = (bubble.y - window.innerHeight / 2) / 20;
                        animationTicks = 0;

                        // Select the bubble and fetch the corresponding GBIF data
                        bubble.selected = true;
                        setSelectedGbifObject(gbifObjects.find((e) => e.key == bubble.id));

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

        function placeImageAndTraingle(firstIdWithImg) {
            let firstBubbleWithImg = bubbles.find((e) => e.id == firstIdWithImg);
            imgX = firstBubbleWithImg.x - imgWidth / 2; // Position the image in the middle of the bubble on the x axis
            imgY = firstBubbleWithImg.y - (imgHeight + firstBubbleWithImg.r / 2 + 20); // Position the image above the bubble
            trainglePositions.x1 = firstBubbleWithImg.x - 10; // Set the postions of the triagle pointing to the bubble from the image
            trainglePositions.x2 = firstBubbleWithImg.x + 10;
            trainglePositions.x3 = firstBubbleWithImg.x;
            trainglePositions.y1 = firstBubbleWithImg.y - (firstBubbleWithImg.r / 2 + 20);
            trainglePositions.y2 = firstBubbleWithImg.y - (firstBubbleWithImg.r / 2 + 20);
            trainglePositions.y3 = firstBubbleWithImg.y - (firstBubbleWithImg.r / 2 + 10);
        }

        function moveCamera(changeX, changeY) {
            // Update line positions
            lines.forEach((line) => {
                line.x1 -= changeX;
                line.y1 -= changeY;
                line.x2 -= changeX;
                line.y2 -= changeY;
            });

            // Update bubble postions
            bubbles.forEach((bubble) => {
                bubble.x -= changeX;
                bubble.y -= changeY;
            });

            // Update the hover text postions
            hoverSpeciesX -= changeX;
            hoverSpeciesY -= changeY;

            // Update the image postions
            imgX -= changeX;
            imgY -= changeY;

            // Update the triangle positions
            trainglePositions.x1 -= changeX;
            trainglePositions.x2 -= changeX;
            trainglePositions.x3 -= changeX;
            trainglePositions.y1 -= changeY;
            trainglePositions.y2 -= changeY;
            trainglePositions.y3 -= changeY;
        }

        return (
            <Sketch
                preload={preload}
                setup={setup}
                draw={draw}
                mouseMoved={mouseMoved}
                mouseClicked={mouseClicked}
                mouseDragged={mouseDragged}
                mouseReleased={mouseReleased}
            />
        );
    } else return <div className="empty-canvas"></div>;
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
