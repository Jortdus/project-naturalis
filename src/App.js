import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Kingdom from "./Components/Kingdom";
import Phylum from "./Components/Phylum";
import Class from "./Components/Class";
import Order from "./Components/Order";
import Family from "./Components/Family";
import Genus from "./Components/Genus";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kingdom />} />
        <Route path="/phylum" element={<Phylum />} />
        <Route path="/class" element={<Class />} />
        <Route path="/order" element={<Order />} />
		<Route path="/family" element={<Family />} />
		<Route path="/genus" element={<Genus />} />
      </Routes>
    </Router>
  );
}

export default App;