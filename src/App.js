import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./Components/Categories/Categories";
import Objects from "./Components/Objects/Objects";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Categories />} />
                    <Route path="/:kingdom" element={<Categories />} />
                    <Route path="/:kingdom/:phylum" element={<Categories />} />
                    <Route path="/:kingdom/:phylum/:classs" element={<Categories />} />
                    <Route path="/:kingdom/:phylum/:classs/:order" element={<Categories />} />
                    <Route
                        path="/:kingdom/:phylum/:classs/:order/:family"
                        element={<Categories />}
                    />
                    <Route
                        path="/:kingdom/:phylum/:classs/:order/:family/:genus/objects"
                        element={<Objects />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
