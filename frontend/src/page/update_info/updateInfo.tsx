import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/updateInfo.css";
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from "../../net/api";
import HeadPic from "./headerpic";

export interface UserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UpdateInfo: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const onFinish = useCallback(async (values: UserInfo) => {
    const resp = await updateInfo(values);
    if (resp.status === 201 || resp.status === 200) {
      message.success("修改成功");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } else {
      message.error(resp.data.data || "系统繁忙，请稍后再试");
    }
  }, []);

  const sendCaptcha = useCallback(async function () {
    const resp = await updateUserInfoCaptcha();
    if (resp.status === 201 || resp.status === 200) {
      message.success(resp.data.data);
    } else {
      if (resp.status === 401 || resp.status === 403) {
        navigate("/login");
      }
      message.error(resp.data.data || "系统繁忙，请稍后再试");
    }
  }, []);

  useEffect(() => {
    async function query() {
      const res = await getUserInfo();

      const { data } = res.data;

      if (res.status === 201 || res.status === 200) {
        console.log(`result: ${JSON.stringify(data)}`);
        form.setFieldValue("headPic", data.headPic ?? "");
        form.setFieldValue("nickName", data.nickName ?? "");
        form.setFieldValue("email", data.email ?? "");
      }
    }
    query();
  }, []);

  return (
    <div id="updateInfo-container">
      <Form
        form={form}
        onFinish={onFinish}
        {...layout1}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="头像"
          name="headPic"
          rules={[{ required: true, message: "请输入头像!" }]}
          shouldUpdate
        >
          <HeadPic></HeadPic>
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "请输入昵称!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            { type: "email", message: "请输入合法邮箱地址!" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <div className="captcha-wrapper">
          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div>

        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            修改用户信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateInfo;
