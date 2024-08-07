import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthRoute } from "./AuthRoute";
import { LoginPage } from "../components/LoginPage";
import { LogoutPage } from "../components/LogoutPage";
import { AccountPage } from "../components/AccountPage";
import { HomePage } from "../components/HomePage";

export const Routes = () => {
  const publicRoutes = [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ];

  const authRoutes = [
    {
      path: "/",
      element: <AuthRoute />,
      children: [
        {
          path: "/account",
          element: <AccountPage />,
        },
        {
          path: "/logout",
          element: <LogoutPage />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([...publicRoutes, ...authRoutes]);

  return <RouterProvider router={router} />;
};
