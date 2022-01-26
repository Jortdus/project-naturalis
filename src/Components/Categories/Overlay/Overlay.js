import React from "react";
import "./Overlay.css";

function Overlay() {
    function overlayOff() {
        let element = document.getElementById("overlay");
        element.classList.add("hidden");
    }

    return (
        <div id="overlay" onClick={overlayOff}>
            <div id="overlay-text">
                Naturalis
                <br />
                Verlies je zelf in de natuur
                <p>
                    Klik door de bubbels en ontdek de objecten uit de collectie van het Naturalis!
                </p>
            </div>
        </div>
    );
}

export default Overlay;
