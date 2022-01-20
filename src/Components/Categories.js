import React from "react";
import Sketch from "react-p5";
import Count_0 from "../Data/Count_0.json";


let x;
let y;
let r = window.innerWidth / 16;
let circlePositions = [];
let rawData = Count_0
let urlPath;
// let lastMousePosition = null;

function Categories() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(
            canvasParentRef
        );

    };

    const draw = (p5) => {
        p5.background(102, 102, 255);
        p5.stroke(13, 92, 99);
        p5.strokeWeight(2);
        p5.fill(68, 161, 160);

        rawData.forEach(e => {
            x = p5.width / 2 + p5.random(-500, 500);
            y = p5.height / 2 + p5.random(-300, 300);
            circlePositions.push([e.taxonomicRankName, x, y, r])
        });


        circlePositions.forEach(e => {
            p5.ellipse(e[1], e[2], p5.width / 8, p5.width / 8);
        });

        // if (circlePositions.length === 3) {
        //     circlePositions.forEach(e => {
        //         p5.ellipse(e[1], e[2], p5.width / 8, p5.width / 8);
        //         if (x || y === e[1] || e[2]) {
        //             console.log(e[1], e[2], x, y)
        //         } else {}
        //     });
        // }

        circlePositions.forEach((e) => {
            p5.textAlign("center", "center")
            p5.textSize(28)
            p5.fill("white")
            p5.noStroke()
            p5.text(e[0], e[1], e[2])
        });
        p5.noLoop();
    };

    const mouseClicked = (p5) => {
        circlePositions.forEach((e) => {
            let d = p5.dist(p5.mouseX, p5.mouseY, e[1], e[2]);
            if (d < e[3]) {
                p5.clear()
                window.history.pushState('', 'Title', e[0].toLowerCase())
                p5.background(102, 102, 255);
                urlPath = p5.getURLPath()[0];
                Count_0.forEach(c => {
                    if (c.taxonomicRankName.toLowerCase() === urlPath) {
                        rawData = c.children
                        p5.clear()
                        circlePositions = []
                        p5.redraw()
                        // console.log(rawData)
                    }
                });
            }
        });
    };

    // const mouseDragged = (p5) => {
    //     if (lastMousePosition) {
    //         // Calculate the change in the mouse position
    //         const change = {
    //             x: lastMousePosition.x - p5.mouseX,
    //             y: lastMousePosition.y - p5.mouseY
    //         };
    //         circlePositions.forEach((e) => {
    //             e[1] -= change.x;
    //             e[2] -= change.y;
    //         });
    //     }
    //     lastMousePosition = {
    //         x: p5.mouseX,
    //         y: p5.mouseY
    //     };
    // };

    // const mouseReleased = () => {
    //     lastMousePosition = null;
    // };

    return ( <
        Sketch setup = {
            setup
        }
        draw = {
            draw
        }
        // mouseDragged={mouseDragged}
        // mouseReleased={mouseReleased}
        mouseClicked = {
            mouseClicked
        }
        />
    );
}

export default Categories;