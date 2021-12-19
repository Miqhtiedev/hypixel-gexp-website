import { HomeIcon as HomeIconComponent } from "@heroicons/react/solid";
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GexpChecker from "./pages/GexpChecker";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import "./tailwind.css";

const noHomeButton = ["/"]

const HomeIcon: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return !noHomeButton.includes(location.pathname) ? <HomeIconComponent onClick={() => navigate("/")} className="homeIcon" /> : <div />;
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <HomeIcon />
      <Routes>
        <Route element={<Landing />} path="/" />
        <Route element={<GexpChecker />} path="/gexp" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
