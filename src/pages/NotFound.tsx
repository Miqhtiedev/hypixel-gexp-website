import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField";

const NotFound: FunctionComponent = () => {
  const navigate = useNavigate()
  return (
    <div className="center">
      <h1 className="text-white text-4xl sm:text-6xl mb-6">Page Not Found</h1>
    </div>
  );
};

export default NotFound;
