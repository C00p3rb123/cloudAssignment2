import "./index.css";
import { AuthProvider } from "./provider/AuthProvider";
import { Routes } from "./routes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
