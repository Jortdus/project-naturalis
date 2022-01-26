import React from "react";
import Particles from "react-tsparticles";

function ParticleModule() {
    return (
        <Particles
            options={{
                backgroundMode: {
                    enable: true,
                    zIndex: -1
                },
                background: {
                    color: "#467D92"
                },
                fpsLimit: 60,
                particles: {
                    color: { value: "#fff" },
                    links: {
                        color: "#ffffff",
                        distance: 500,
                        enable: false,
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        attract: { enable: false, rotateX: 600, rotateY: 1200 },
                        direction: "bottom",
                        enable: true,
                        outMode: "out",
                        random: false,
                        size: true,
                        speed: 1,
                        straight: false
                    },
                    number: {
                        density: { enable: true, area: 1000 },
                        value: 1000
                    },
                    opacity: {
                        random: true,
                        value: 0.5
                    },
                    shape: {
                        type: "circle"
                    },
                    size: {
                        random: true,
                        value: 3
                    }
                },
                detectRetina: true
            }}
        />
    );
}

export default ParticleModule;
