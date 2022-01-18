import React from "react";
import Sketch from "react-p5";
import "./Canvas.css";
import fetchData from "../../../Utils/fetchData.js";

const url = "https://api.gbif.org/v1/occurrence/";
let bubbles = [];

function Canvas({ gbifIds, setSelectedGbifObject }) {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(
            canvasParentRef
        );

        const minRadius = 25;
        const maxRadius = 50;
        gbifIds.forEach((gbifId) => {
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            let r = Math.random() * (maxRadius - minRadius) + minRadius;
            bubbles.push(new Bubble(x, y, r, gbifId));
        });

        p5.noLoop();
    };

    const draw = (p5) => {
        p5.background(102, 102, 255);
        bubbles.forEach((bubble) => {
            p5.ellipse(bubble.x, bubble.y, bubble.r);
        });
    };

    const mouseClicked = (p5) => {
        bubbles.forEach((bubble) => {
            let d = p5.dist(p5.mouseX, p5.mouseY, bubble.x, bubble.y);
            if (d < bubble.r) {
                fetchData(url + bubble.id).then((d) => {
                    setSelectedGbifObject(d);
                });
            }
        });
    };

    class Bubble {
        constructor(x, y, r, id) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.id = id;
        }
    }

    return <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />;
}

export default Canvas;
