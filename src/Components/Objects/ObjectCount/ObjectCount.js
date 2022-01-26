import React from "react";
import "./ObjectCount.css";

function ObjectCount({ total }) {
    return (
        <div id="object-count">
            <img src={process.env.PUBLIC_URL + "/logo.webp"} alt="Naturalis logo" />
            <section>
                <p>
                    {total} <strong>objecten</strong>
                </p>
                <p>van 550 miljoen jaar geleden tot nu</p>
            </section>
        </div>
    );
}

export default ObjectCount;
