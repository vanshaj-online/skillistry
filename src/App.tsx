import { Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import NavBar from "./components/ui/NavBar";
import InterviewPage from "./components/interview/InterviewPage";
import InterviewReportRoute from "./components/interview/InterviewReportRoute";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 w-full flex flex-col">
        <Routes>
          {/* Existing routes — unchanged */}
          <Route path="/" element={<HomePage />} />

          {/* New interview routes */}
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/report/:sessionId" element={<InterviewReportRoute />} />
        </Routes>
      </main>
    </div>
  );
}
