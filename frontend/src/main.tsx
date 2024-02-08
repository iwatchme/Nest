import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./errorpage";
import Login from "./login";
import Register from "./register";
import UpdatePassword from "./updatepassword";
import Index from "./page";
import UpdateInfo from "./page/update_info/updateInfo";

const routes = [
  {
    path: "/",
    element: <Index></Index>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "update_info",
        element: <UpdateInfo></UpdateInfo>,
      },
      {
        path: "bbb",
        element: <div>bbb</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/updatepassword",
    element: <UpdatePassword></UpdatePassword>,
  },
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);
