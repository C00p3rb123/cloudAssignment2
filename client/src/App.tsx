import { Toaster } from "react-hot-toast";
import "./index.css";
import { AuthProvider } from "./provider/AuthProvider";
import { Routes } from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
      <Toaster />
    </AuthProvider>
  );
};

export default App;
