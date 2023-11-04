import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export const HomePage = () => {
  return (
    <div className="bg-[#000e23] text-white min-h-screen flex flex-col justify-center items-center">
      <img src={logo} alt="Password Manager Logo" className="h-32 mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-blue-500">
        Welcome to CipherGuard
      </h1>
      <p className="text-lg text-center mb-8">
        Manage your passwords with ease.
      </p>
      <NavLink to="/login">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to App
        </button>
      </NavLink>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-500">Features</h2>
        <ul className="list-disc list-inside text-lg">
          <li>Securely store and manage your passwords</li>
          <li>Sync passwords across devices</li>
          <li>[Coming soon] Generate strong passwords</li>
          <li>[Coming soon] Auto-fill passwords on websites</li>
        </ul>
      </div>
    </div>
  );
};
