import React from "react";
import "./Aside.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const url = "https://www.gbif.org/occurrence/";

function Aside({ gbifObject, setGbifObject }) {
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
                    <ul>
                        <li>{gbifObject.identifiedBy}</li>
                        <li>{gbifObject.eventDate}</li>
                        <li>{gbifObject.identifier}</li>
                        <li>{gbifObject.key}</li>
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
