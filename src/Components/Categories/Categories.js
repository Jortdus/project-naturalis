import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Categories.css";
import data from "../../Data/countData.json";
import Canvas from "./Canvas/Canvas.js";
import Overlay from "./Overlay/Overlay";
import ObjectCount from "../Objects/ObjectCount/ObjectCount.js";

function Categories() {
    const [rankChildren, setRankChildren] = useState(data);
    let { kingdom, phylum, classs, order, family } = useParams();

    let currentUrl;
    if (family) {
        currentUrl = `/${kingdom}/${phylum}/${classs}/${order}/${family}/`;
    } else if (order) {
        currentUrl = `/${kingdom}/${phylum}/${classs}/${order}/`;
    } else if (classs) {
        currentUrl = `/${kingdom}/${phylum}/${classs}/`;
    } else if (phylum) {
        currentUrl = `/${kingdom}/${phylum}/`;
    } else if (kingdom) {
        currentUrl = `/${kingdom}/`;
    } else {
        currentUrl = "";
    }

    return (
        <div>
            <ObjectCount total={rankChildren.count} />
            <Overlay />
            <Canvas
                rankChildren={rankChildren.children}
                setRankChildren={setRankChildren}
                kingdom={kingdom}
                family={family}
                currentUrl={currentUrl}
            />
        </div>
    );
}

export default Categories;
