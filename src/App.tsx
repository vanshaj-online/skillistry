import { Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import NavBar from "./components/ui/NavBar";
import AnalysisPage from "./components/analysis/AnalysisPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </main>
    </div>
  );
}
