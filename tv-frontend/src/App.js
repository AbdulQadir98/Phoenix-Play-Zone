import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Cricket from "./pages/Cricket";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Landing />
              <Cricket />
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
