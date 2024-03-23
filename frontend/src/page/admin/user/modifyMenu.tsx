import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import { router } from "../../../main";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "信息修改",
  },
  {
    key: "2",
    label: "密码修改",
  },
];

const handleClick = ({ item, key, keyPath, domEvent }: any) => {
  let path = "";
  switch (key) {
    case "1":
      path = "/admin/user_info/info_modify";
      break;
    case "2":
      path = "/admin/user_info/password_modify";
      break;
  }
  console.log(path);
  router.navigate(path);
};

const ModifyMenu: React.FC = () => {
  const location = useLocation();
  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={
            location.pathname == "admin/user_info/info_modify" ? ["1"] : ["2"]
          }
          items={items}
          onClick={handleClick}
        />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default ModifyMenu;
