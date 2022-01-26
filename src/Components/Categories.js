import React from "react";
import Sketch from "react-p5";
import Count_0 from "../Data/Count_0.json";

let x;
let y;
let r = window.innerWidth / 16;
let circlePositions = [];
let rawData = Count_0;
let urlPath;
let lastMousePosition = null;
const baseX = 2;
const baseY = 3;

function Categories() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(
            canvasParentRef
        );

        let canvasFactor = 1;

        if (circlePositions.length <= 15) {
            canvasFactor = 0.5;
        } else if (circlePositions.length >= 500) {
            canvasFactor = 2;
        }

        rawData.forEach((e, index) => {
            x = 300 + halton(index, baseX) * (p5.width - 600) * canvasFactor;
            y = 200 + halton(index, baseY) * (p5.height - 450 * canvasFactor);
            circlePositions.push([e.taxonomicRankName, x, y, r]);
        });
    };

    const draw = (p5) => {
        p5.frameRate(60)
        p5.noStroke();

        p5.strokeWeight(2);
        p5.fill(68, 161, 160);

        circlePositions.forEach((e) => {
            p5.ellipse(e[1], e[2], p5.width / 8, p5.width / 8);
        });

        circlePositions.forEach((e) => {
            p5.textAlign("center", "center");
            p5.textSize(28);
            p5.fill("white");
            p5.noStroke();
            p5.text(e[0], e[1], e[2]);
        });
    };

    const mouseClicked = (p5) => {
        circlePositions.forEach((e) => {
            let d = p5.dist(p5.mouseX, p5.mouseY, e[1], e[2]);
            if (d < e[3]) {
                p5.clear();
                window.history.pushState("", "Title", e[0].toLowerCase());
                urlPath = p5.getURLPath()[0];
                Count_0.forEach((c) => {
                    if (c.taxonomicRankName.toLowerCase() === urlPath) {
                        rawData = c.children;
                        p5.clear();
                        circlePositions = [];
                        p5.redraw();
                        let canvasFactor = 1;

                        if (rawData.length <= 5) {
                            canvasFactor = 0.5;
                        } else if (rawData.length >= 10) {
                            canvasFactor = 1;
                        }

                        rawData.forEach((e, index) => {
                            x = halton(index, baseX) * p5.width * canvasFactor;
                            y = halton(index, baseY) * p5.height * canvasFactor;
                            circlePositions.push([
                                e.taxonomicRankName,
                                x,
                                y,
                                r
                            ]);
                        });

                        // console.log(rawData)
                    }
                });
            }
        });
    };

    const mouseDragged = (p5) => {
        if (lastMousePosition) {
            p5.clear();
            // Calculate the change in the mouse position
            const change = {
                x: lastMousePosition.x - p5.mouseX,
                y: lastMousePosition.y - p5.mouseY
            };
            circlePositions.forEach((e) => {
                e[1] -= change.x;
                e[2] -= change.y;
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
            mouseDragged={mouseDragged}
            mouseReleased={mouseReleased}
            mouseClicked={mouseClicked}
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

export default Categories;
