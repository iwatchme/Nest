import { Button, Form, Input, message } from "antd";
import React, { useCallback } from "react";
import "../../css/login.css";
import { useNavigate } from "react-router-dom";
import { adminLogin, login } from "../../net/api";
import { LoginUser } from "../../net/loginUser";

export interface LoginUserInfo {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const finish = useCallback(async (values: LoginUserInfo) => {
    const response = await adminLogin(values); 
    if (response.data?.code === 200 || response.data?.code === 201) {
      message.success("登录成功");
      const user = response.data.data as LoginUser;
      localStorage.setItem("access_token", user?.accessToken ?? "");
      localStorage.setItem("refresh_token", user?.refreshToken ?? "");
      localStorage.setItem("user_info", JSON.stringify(user?.userInfo ?? {}));
      setTimeout(() => {
        navigate("/admin/home/user_manager");
      });
    } else {
      message.error((response.data?.data as string) ?? "登录失败");
    }
  }, []);
  return (
    <div id="login-container">
      <h1>会议室预定系统</h1>
      <Form
        colon={false}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={finish}
        autoComplete={"off"}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
          <div className="links">
            <a href="">创建账号</a>
            <a href="">忘记密码</a>
          </div>
        </Form.Item>
        <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
          <Button className="btn" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLogin;
