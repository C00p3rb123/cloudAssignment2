import "./index.css";
import { AuthProvider } from "./provider/AuthProvider";
import { Routes } from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
