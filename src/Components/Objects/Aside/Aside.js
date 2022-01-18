import React from "react";
import "./Aside.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

function Aside({ gbifObject, setGbifObject }) {
    function handleClick() {
        document.getElementById("object").classList.add("close");
        setTimeout(() => {
            setGbifObject(null);
        }, 500);
    }

    return (
        <aside id="object">
            <div className="object-container">
                <button onClick={() => handleClick()}></button>
                <div className="header">
                    <h2>{gbifObject.species}</h2>
                    <ul>
                        <li>{gbifObject.kingdom}</li>
                        <li>{gbifObject.phylum}</li>
                        <li>{gbifObject.class}</li>
                        <li>{gbifObject.order}</li>
                        <li>{gbifObject.family}</li>
                        <li>{gbifObject.genus}</li>
                    </ul>
                </div>

                {gbifObject.media.length > 0 && (
                    <div className="image-container">
                        <Carousel showThumbs={false}>
                            {gbifObject.media.map((e) => (
                                <div>
                                    <img src={e.identifier} alt=""></img>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}

                <div className="collection-data-container">
                    <ul>
                        <li>{gbifObject.identifiedBy}</li>
                        <li>{gbifObject.eventDate}</li>
                        <li>{gbifObject.identifier}</li>
                    </ul>
                </div>

                <a
                    href={"https://www.gbif.org/occurrence/" + gbifObject.key}
                    target="_blank"
                >
                    Link naar object op gbif
                </a>
            </div>
        </aside>
    );
}

export default Aside;
