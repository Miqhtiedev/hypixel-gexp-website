import { FunctionComponent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Landing: FunctionComponent = () => {
  const navigate = useNavigate()

  return (
    <div className="center h-screen">
      <h1 className="text-white block mb-8 text-4xl sm:text-6xl">Hypixel Tools.</h1>
      <button onClick={() => navigate("/gexp")} className="actionButton animatedGrowButton bg-green-900 text-white w-[160px] h-[75px]">GEXP Checker</button>
    </div>
  );
};

export default Landing;
