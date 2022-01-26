import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Objects.css";
import data from "../../Data/idData.json";
import fetchData from "../../Utils/fetchData.js";
import Aside from "./Aside/Aside.js";
import ObjectCount from "./ObjectCount/ObjectCount.js";
import Canvas from "./Canvas/Canvas.js";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";

const url = "https://api.gbif.org/v1/occurrence/";
let objectsWithImage = [];

function Objects() {
    const [selectedGbifObject, setSelectedGbifObject] = useState(null);
    const [gbifObjects, setGbifObjects] = useState(null);

    // Display the Aside component based on the selected gbif object
    let aside;
    if (selectedGbifObject) {
        aside = <Aside gbifObject={selectedGbifObject} setGbifObject={setSelectedGbifObject} />;
    }

    // Retrieve the gbif ids based on the genus from the url
    let { kingdom, phylum, classs, order, family, genus } = useParams();
    let genusObject = data.find((e) => e.genus === genus);

    // Fetch object data
    useEffect(() => {
        let promises = [];
        genusObject.species.forEach((species) => {
            species.ids.forEach((id) => {
                promises.push(fetchData(url + id));
            });
        });

        Promise.all(promises).then((values) => {
            // Calculate the circle radius for each of the objects
            values.forEach((value) => {
                value.radius = calculateRadius(value);
            });
            setGbifObjects(values);
        });
    }, []);

    let objectTotal = 0;
    genusObject.species.forEach((species) => {
        objectTotal += species.ids.length;
    });

    function calculateRadius(value) {
        let radius = 50;
        if (value.media[0]) {
            radius += 50;
            objectsWithImage.push(value.key);
        }
        if (value.identifiedBy) {
            radius += 10;
        }
        return radius;
    }

    return (
        <div>
            <ObjectCount total={objectTotal} />
            <div>{aside}</div>
            <Breadcrumbs
                taxomicRanks={{
                    kingdom: kingdom,
                    phylum: phylum,
                    classs: classs,
                    order: order,
                    family: family,
                    genus: genus
                }}
            />
            <Canvas
                species={genusObject.species}
                gbifObjects={gbifObjects}
                objectsWithtImage={objectsWithImage}
                selectedGbifObject={selectedGbifObject}
                setSelectedGbifObject={setSelectedGbifObject}
            />
        </div>
    );
}

export default Objects;
