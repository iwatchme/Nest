import { Outlet } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "../css/index.css";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <div id="index-container">
      <div className="header">
        <h1>会议室预定系统</h1>
        <Link to="/update_info">  <UserOutlined className="icon" /></Link>
      
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Index;
