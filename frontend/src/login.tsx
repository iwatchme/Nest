import { Button, Form, Input } from "antd";
import React from "react";
import "./css/login.css";

interface LoginUserInfo {
  username: string;
  password: string;
}

const finish = (values: LoginUserInfo) => {
  console.log(values);
};


const Login: React.FC = () => {
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
      </Form>
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
    </div>
  );
};

export default Login;
