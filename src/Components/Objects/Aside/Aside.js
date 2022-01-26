import React from "react";
import "./Aside.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const url = "https://www.gbif.org/occurrence/";

function Aside({ gbifObject, setGbifObject }) {
    const monthNumberToString = [
        "Januari",
        "Februari",
        "April",
        "Mei",
        "Juni",
        "Maart",
        "Juli",
        "Augustus",
        "September",
        "October",
        "November",
        "December"
    ];

    // Display the images when they are present
    let imageContainer;
    if (gbifObject.media[0]) {
        imageContainer = (
            <div className="images">
                <ul>
                    {gbifObject.media.map((e, index) => (
                        <li key={`image-${index}`}>
                            <img src={e.identifier} alt={`An image of ${gbifObject.species}`} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Display the discoverer when he/she is present
    let identifiedByListElement;
    if (gbifObject.identifiedBy) {
        identifiedByListElement = (
            <li>
                <p>
                    <strong>Ontdekker</strong>
                </p>
                <p>{gbifObject.identifiedBy}</p>
            </li>
        );
    }

    // Display the date based on the available data
    let date;
    if (gbifObject.day) {
        date = (
            <p>{`${gbifObject.day} ${monthNumberToString[gbifObject.month - 1]} ${
                gbifObject.year
            }`}</p>
        );
    } else if (gbifObject.month) {
        date = <p>{`${monthNumberToString[gbifObject.month - 1]} ${gbifObject.year}`}</p>;
    } else if (gbifObject.year) {
        date = <p>{gbifObject.year}</p>;
    }

    function handleClick() {
        setGbifObject(null);
    }

    return (
        <aside>
            <div className="object-container">
                <div className="close-button" onClick={() => handleClick()}>
                    <img src={process.env.PUBLIC_URL + "/close.svg"} alt="Close button" />
                </div>

                <div className="header">
                    <h2>{gbifObject.species}</h2>
                    <ol className="taxonomic-ranks">
                        <li>{gbifObject.kingdom}</li>
                        <li>{gbifObject.phylum}</li>
                        <li>{gbifObject.class}</li>
                        <li>{gbifObject.order}</li>
                        <li>{gbifObject.family}</li>
                        <li>{gbifObject.genus}</li>
                    </ol>
                </div>

                {imageContainer}

                <div className="collection-data">
                    <p id="institution-name">naturalis biodiversity center</p>
                    <h3>{gbifObject.species}</h3>
                    <ul>
                        {identifiedByListElement}
                        <li>
                            <p>
                                <strong>Verzameldatum</strong>
                            </p>
                            {date}
                        </li>

                        <li>
                            <strong>GBIF id</strong>
                            <p>{gbifObject.key}</p>
                        </li>
                    </ul>
                </div>

                <div className="gbif-link">
                    <a href={url + gbifObject.key} target="_blank">
                        Alle gegevens van dit object
                    </a>
                </div>
            </div>
        </aside>
    );
}

export default Aside;
