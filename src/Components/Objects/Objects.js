import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Objects.css";
import data from "../../Data/dataId.json";
import fetchData from "../../Utils/fetchData.js";
import Aside from "./Aside/Aside.js";
import Canvas from "./Canvas/Canvas.js";

const url = "https://api.gbif.org/v1/occurrence/";

function Objects() {
    const [selectedGbifObject, setSelectedGbifObject] = useState(null);

    // Retrieve the gbif ids based on the genus from the url
    let { genus } = useParams();
    let genusObject = data.find((e) => e.genus === genus);

    // Function to set the selected gbif object
    function fetchGbifData(id) {
        fetchData(url + id).then((d) => {
            setSelectedGbifObject(d);
            console.log(d);
        });
    }

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
                {/* <h1>{genus}</h1>
                <ul>
                    {genusObject.ids.map((id) => (
                        <li onClick={(e) => fetchGbifData(e.target.innerHTML)}>
                            {id}
                        </li>
                    ))}
                </ul> */}
                {aside}
            </div>
            <Canvas
                gbifIds={genusObject.ids}
                setSelectedGbifObject={setSelectedGbifObject}
            />
        </div>
    );
}

export default Objects;
