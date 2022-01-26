import React from "react";
import "./Breadcrumbs.css";

function Breadcrumbs({ taxomicRanks }) {
    let breadcrumbs;
    if (taxomicRanks) {
        breadcrumbs = (
            <nav>
                <ol>
                    <li>
                        <a href="">{taxomicRanks.kingdom}</a>
                    </li>
                    <li>
                        <a href="">{taxomicRanks.phylum}</a>
                    </li>
                    <li>
                        <a href="">{taxomicRanks.classs}</a>
                    </li>
                    <li>
                        <a href="">{taxomicRanks.order}</a>
                    </li>
                    <li>
                        <a href="">{taxomicRanks.family}</a>
                    </li>
                    <li>
                        <a href="">{taxomicRanks.genus}</a>
                    </li>
                </ol>
            </nav>
        );
    }

    return <div className="breadcrumbs">{breadcrumbs}</div>;
}

export default Breadcrumbs;
