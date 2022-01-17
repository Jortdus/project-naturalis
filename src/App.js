import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./Components/Categories";
import Objects from "./Components/Objects";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Categories />} />
                <Route path="/objects" element={<Objects />} />
            </Routes>
        </Router>
    );
}

export default App;
