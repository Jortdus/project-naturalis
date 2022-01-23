import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./Components/Categories";
import Objects from "./Components/Objects/Objects";
import ParticleModule from "./Components/Particles/Particles";

function App() {
    return (
        <div>
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
