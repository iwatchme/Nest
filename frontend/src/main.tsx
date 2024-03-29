import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./errorpage";
import Login from "./login";
import Register from "./register";
import UpdatePassword from "./updatepassword";
import Index from "./page";
import UpdateInfo from "./page/update_info/updateInfo";
import AdminIndex from "./page/admin/index";
import AdminLogin from "./page/admin/login";
import UserManager from "./page/admin/usermanager";
import Menu from "./page/admin/menu";
import ModifyMenu from "./page/admin/user/modifyMenu";
import InfoModify from "./page/admin/user/InfoModify";
import PasswordModify from "./page/admin/user/passwordmodify";

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
  {
    path: "/admin",
    element: <AdminIndex></AdminIndex>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "home",
        element: <Menu></Menu>,
        children: [
          {
            path: "user_manager",
            element: <UserManager></UserManager>,
          },
        ],
      },
      {
        path: "user_info",
        element: <ModifyMenu></ModifyMenu>,
        children: [
          {
            path: "info_modify",
            element: <InfoModify></InfoModify>,
          },
          {
            path: "password_modify",
            element: <PasswordModify></PasswordModify>,
          },
        ],
      },
      {
        path: "login",
        element: <AdminLogin></AdminLogin>,
      },
    ],
  },
];
export const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);
