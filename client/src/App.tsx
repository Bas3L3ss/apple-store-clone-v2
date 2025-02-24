import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ItemDetails from "./item-details";
import ItemSearch from "@/src/pages/items-search";
import Navbar from "./components/nav-bar";
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-[100vw] pt-16 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<ItemSearch />} />
          <Route path="/items/:slug" element={<ItemDetails />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
