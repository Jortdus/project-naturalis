import React from "react";
import "./ObjectCount.css";

function ObjectCount({ species }) {
    // Calculate the total amount of objects
    let objectTotal = 0;
    species.forEach((species) => {
        objectTotal += species.ids.length;
    });

    return (
        <div id="object-count">
            <img src={process.env.PUBLIC_URL + "/logo.webp"} alt="Naturalis logo" />
            <section>
                <p>
                    {objectTotal} <strong>objecten</strong>
                </p>
                <p>van 550 miljoen jaar geleden tot nu</p>
            </section>
        </div>
    );
}

export default ObjectCount;
