import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./Components/Categories";
import Objects from "./Components/Objects/Objects";
import ParticleModule from "./Components/Particles/Particles";
import Overlay from "./Components/Objects/Overlay/Overlay";

function App() {
    return (
        <div>
        <Overlay />
        <ParticleModule/>
        <Router>
            <Routes>
                <Route path="/" element={<Categories />} />
                <Route path="/:genus/objects" element={<Objects />} />
            </Routes>
        </Router>
        </div>
        

    );
}

export default App;
