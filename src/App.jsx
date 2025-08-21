import { HashRouter as Router, Routes, Route } from "react-router-dom";
import RoasCalculator from "./components/RoasCalculator";
import IaPage from "./components/IaPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoasCalculator />} />
        <Route path="/ia" element={<IaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
