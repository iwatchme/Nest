import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import "../../css/menu.css";
import { router } from "../../main";

const items = [
  {
    key: "1",
    label: "会议室管理",
  },
  {
    key: "2",
    label: "预定管理",
  },
  {
    key: "3",
    label: "用户管理",
  },
  {
    key: "4",
    label: "统计",
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  console.log(location.pathname);

  function handleClick({ item, key, keyPath, domEvent }) {
    console.log({ item, key, keyPath, domEvent });
    let path = "";
    switch (key) {
      case "1":
        break;
      case "2":
        break;
      case "3":
        path = "/admin/home/user_manager";
        break;
      case "4":
        break;
    }
    console.log(path);
    router.navigate(path);
  }

  function getSelectedKey() {
    let key = ["1"];
    switch (location.pathname) {
      case "/admin/home/user_manager":
        key = ["3"];
        break;
    }
    return key;
  }

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={getSelectedKey()}
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

export default Menu;
