import React from "react";
import Sketch from "react-p5";
import Count_0 from "../data/Count_0.json";

let x;
let y;

function Categories() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(
            canvasParentRef
        );
        p5.noLoop();
    };
    const draw = (p5) => {
        p5.noStroke();
        p5.background(102, 102, 255);
        Count_0.forEach((e) => {
            x = p5.width / 2 + p5.random(-300, 300);
            y = p5.height / 2 + p5.random(-300, 300);
            p5.ellipse(x, y, 100, 100);
        });
    };

    return <Sketch setup={setup} draw={draw} />;
}

export default Categories;
