import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Categories.css";
import data from "../../Data/countData.json";
import Canvas from "./Canvas/Canvas.js";
import Overlay from "./Overlay/Overlay";
import ObjectCount from "../Objects/ObjectCount/ObjectCount.js";
import Breadcrumbs from "../Objects/Breadcrumbs/Breadcrumbs.js";

function Categories() {
    const [rankChildren, setRankChildren] = useState(data);
    let { kingdom, phylum, classs, order, family } = useParams();

    let taxomicRanks;
    let currentUrl;
    if (family) {
        currentUrl = `/${kingdom}/${phylum}/${classs}/${order}/${family}/`;
        taxomicRanks = getRanks(kingdom, phylum, classs, order, family, "Genus");
    } else if (order) {
        currentUrl = `/${kingdom}/${phylum}/${classs}/${order}/`;
        taxomicRanks = getRanks(kingdom, phylum, classs, order, "Family", "Genus");
    } else if (classs) {
        currentUrl = `/${kingdom}/${phylum}/${classs}/`;
        taxomicRanks = getRanks(kingdom, phylum, classs, "Order", "Family", "Genus");
    } else if (phylum) {
        currentUrl = `/${kingdom}/${phylum}/`;
        taxomicRanks = getRanks(kingdom, phylum, "Class", "Order", "Family", "Genus");
    } else if (kingdom) {
        currentUrl = `/${kingdom}/`;
        taxomicRanks = getRanks(kingdom, "Phylum", "Class", "Order", "Family", "Genus");
    } else {
        currentUrl = "";
        taxomicRanks = getRanks("Kingdom", "Phylum", "Class", "Order", "Family", "Genus");
    }

    function getRanks(kingdom, phylum, classs, order, family, genus) {
        return {
            kingdom: kingdom,
            phylum: phylum,
            classs: classs,
            order: order,
            family: family,
            genus: genus
        };
    }

    return (
        <div>
            <Overlay />
            <ObjectCount total={rankChildren.count} />
            <Breadcrumbs taxomicRanks={taxomicRanks} />
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
