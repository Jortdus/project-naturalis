import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Objects.css";
import data from "../../Data/dataId.json";
import Aside from "./Aside/Aside.js";
import ObjectCount from "./ObjectCount/ObjectCount.js";
import Canvas from "./Canvas/Canvas.js";

function Objects() {
    const [selectedGbifObject, setSelectedGbifObject] = useState(null);

    // Retrieve the gbif ids based on the genus from the url
    let { genus } = useParams();
    let genusObject = data.find((e) => e.genus === genus);

    // Display the Aside component based on the selected gbif object
    let aside;
    if (selectedGbifObject) {
        aside = (
            <Aside
                gbifObject={selectedGbifObject}
                setGbifObject={setSelectedGbifObject}
            />
        );
    }

    return (
        <div>
            <div>
                <ObjectCount count={genusObject.ids.length} />
            </div>
            <div>{aside}</div>
            <Canvas
                gbifIds={genusObject.ids}
                gbifObject={selectedGbifObject}
                setGbifObject={setSelectedGbifObject}
            />
        </div>
    );
}

export default Objects;
