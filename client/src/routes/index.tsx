import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthRoute } from "./AuthRoute";
import { LoginPage } from "../components/LoginPage";
import { LogoutPage } from "../components/LogoutPage";

export const Routes = () => {
  const publicRoutes = [
    {
      path: "/",
      element: <div>Home Page</div>,
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
          path: "/service",
          element: <div>Service Page</div>,
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
