import { UserOutlined } from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import "../../css/admin.css";

const AdminIndex: React.FC = () => {
  return (
    <div id="index-container">
      <div className="header">
        <Link to="/admin/home" className="sys_name">
          <h1>会议室预定系统-后台管理</h1>
        </Link>
        <Link to="/admin/user_info">
          {" "}
          <UserOutlined className="icon" />
        </Link>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default AdminIndex;
