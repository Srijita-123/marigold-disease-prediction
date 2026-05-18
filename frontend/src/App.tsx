import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import "./App.css";

export default function App() {
  return (
    <div className="layout">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">🌼</span>
          <div>
            <h1>Marigold Health</h1>
            <p className="tagline">Disease detection dashboard</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Detect
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
            History
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}
