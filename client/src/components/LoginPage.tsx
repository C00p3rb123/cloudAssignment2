import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import LoadingOverlay from "react-loading-overlay-ts";
import toast from "react-hot-toast";
import { handleAxiosError } from "../utils/handleAxiosError";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading your content...");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateToken } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingText("Logging in...");
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/account/login`, {
        email,
        password,
      });
      const { token } = response.data;
      updateToken(token);
      navigate("/account", { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      }
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setLoadingText("Registering...");
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/account/create-account`, {
        email,
        password,
      });
      toast.success("Account created successfully!", {
        position: "top-right",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      }
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className=" bg-[#000e23] flex flex-col items-center justify-center h-screen">
      <LoadingOverlay active={isLoading} spinner text={loadingText}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Master Password Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <label className="text-lg font-medium">
              Email:
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                placeholder="Enter your email"
                required
              />
            </label>
            <label className="text-lg font-medium">
              Password:
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full"
                placeholder="Enter your password"
                required
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
        </div>
      </LoadingOverlay>
    </div>
  );
};
