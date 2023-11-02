import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthRoute } from "./AuthRoute";
import { LoginPage } from "../components/LoginPage";

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
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  const router = createBrowserRouter([...publicRoutes, ...authRoutes]);

  return <RouterProvider router={router} />;
};
