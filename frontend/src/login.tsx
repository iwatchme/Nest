import { Button, Form, Input, message } from "antd";
import React, { useCallback } from "react";
import "./css/login.css";
import { login } from "./Api";
import { useNavigate } from "react-router-dom";

export interface LoginUserInfo {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const finish = useCallback(async (values: LoginUserInfo) => {
    const response = await login(values);
    if (response.data?.code === 200 || response.data?.code === 201) {
      message.success("登录成功");
      setTimeout(() => {
        navigate("/");
      });
    } else {
      message.error(response.data?.data ?? "登录失败");
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

export default Login;
