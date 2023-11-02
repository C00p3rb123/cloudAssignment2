import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  token: string | null;
  updateToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  updateToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children?: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const updateToken = (newToken: string) => {
    setToken(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      updateToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
