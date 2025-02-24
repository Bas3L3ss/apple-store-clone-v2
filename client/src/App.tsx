import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ItemSearch from "./pages/items-search";
import ItemDetails from "./item-details";

function App() {
  return (
    <Router>
      <nav>hi</nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<ItemSearch />} />
        <Route path="/items/:slug" element={<ItemDetails />} />
      </Routes>
      <footer>bye</footer>
    </Router>
  );
}

export default App;
