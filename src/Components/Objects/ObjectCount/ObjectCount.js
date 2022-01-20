import React from "react";
import "./ObjectCount.css";

function ObjectCount({ count }) {
    return (
        <div id="object-count">
            <img src={process.env.PUBLIC_URL + "/logo.webp"} alt="" />
            <section>
                <p>
                    {count} <strong>objecten</strong>
                </p>
                <p>van 550 miljoen jaar geleden tot nu</p>
            </section>
        </div>
    );
}

export default ObjectCount;
