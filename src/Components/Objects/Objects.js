import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Objects.css";
import fetchData from "../../Utils/fetchData.js";
import data from "../../Data/idData.json";

import Aside from "./Aside/Aside.js";
import ObjectCount from "./ObjectCount/ObjectCount.js";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs.js";
import Canvas from "./Canvas/Canvas.js";

const url = "https://api.gbif.org/v1/occurrence/";

function Objects() {
    const [selectedGbifObject, setSelectedGbifObject] = useState(null);
    const [taxomicRanks, setTaxonomicRanks] = useState(null);

    // Retrieve the gbif ids based on the genus from the url
    let { genus } = useParams();
    let genusObject = data.find((e) => e.genus === genus);

    // Display the Aside component based on the selected gbif object
    let aside;
    if (selectedGbifObject) {
        aside = <Aside gbifObject={selectedGbifObject} setGbifObject={setSelectedGbifObject} />;
    }

    // Set the taxonomic ranks for the breadcrumbs component
    fetchData(url + genusObject.species[0].ids[0]).then((d) => {
        // Uses fetch for now schould use ranks from url
        setTaxonomicRanks({
            kingdom: d.kingdom,
            phylum: d.phylum,
            class: d.class,
            order: d.order,
            family: d.family,
            genus: d.genus
        });
    });

    return (
        <div>
            <ObjectCount species={genusObject.species} />
            <Breadcrumbs taxomicRanks={taxomicRanks} />
            <div>{aside}</div>
            <Canvas
                species={genusObject.species}
                selectedGbifObject={selectedGbifObject}
                setSelectedGbifObject={setSelectedGbifObject}
            />
        </div>
    );
}

export default Objects;
