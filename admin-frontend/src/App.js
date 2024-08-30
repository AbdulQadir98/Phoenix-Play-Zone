import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SideMenu from "./components/SideMenu";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<SideMenu />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
