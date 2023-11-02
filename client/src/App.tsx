import "./index.css";
import { useState } from "react";
import { MainPage } from "./components/MainPage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/";

const App = () => {
  return <MainPage />;
};

export default App;
