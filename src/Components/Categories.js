import React from "react";
import Sketch from "react-p5";
import Count_0 from "../data/Count_0.json";

let x;
let y;
let circlePositions = [];

function Categories() {
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent(
            canvasParentRef
        );
        p5.noLoop();
        p5.overlapping = false
        p5.textAlign("center", "center")
        p5.textSize(28)
        p5.textFont('Helvetica');
    };
    const draw = (p5) => {
        p5.noStroke();
        p5.background(102, 102, 255);
        // console.log(Count_0[0].count);
        Count_0.forEach ((e) => {
            console.log(e.taxonomicRankName);
            x = p5.width / 2 + p5.random(-300, 300);
            y = p5.height / 2 + p5.random(-300, 300);
            p5.ellipse(x, y, p5.width / 8, p5.width / 8);
            p5.text(e.taxonomicRankName, x, y)
            circlePositions.push([e.taxonomicRankName,x,y], )
        });
        
    };
    console.log(circlePositions)
    const mousePressed = (p5) => {
        if (p5.dist(p5.mouseX,p5.mouseY,circlePositions[0][1],circlePositions[0][2]) < p5.width / 16 || circlePositions[0][0] === "Plantae"){
            alert("Plantae")
        } else if (p5.dist(p5.mouseX,p5.mouseY,circlePositions[0][1],circlePositions[0][2]) < p5.width / 16 || circlePositions[0][0] === "Animalia"){
            alert("Animalia")
        } else if (p5.dist(p5.mouseX,p5.mouseY,circlePositions[0][1],circlePositions[0][2]) < p5.width / 16 || circlePositions[0][0] === "Fungi"){
            alert("Fungi")
        }
    }

    

    return <Sketch setup={setup} draw={draw} mousePressed={mousePressed}/>;
}

export default Categories;
