import { Button, Form, Input, message } from "antd";
import { useCallback, useState } from "react";
import "../../css/usermanager.css";
import Table, { ColumnsType } from "antd/es/table";
import { UserSearchSuccessData, userSearch } from "../../net/api";
import { Response } from "express";
import { UserInfo } from "../update_info/updateInfo";

interface SearchUser {
  username: string;
  nickName: string;
  email: string;
}
interface UserSearchResult {
  username: string;
  nickName: string;
  email: string;
  headPic: string;
  createTime: Date;
}
const columns: ColumnsType<UserSearchResult> = [
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "头像",
    dataIndex: "headPic",
  },
  {
    title: "昵称",
    dataIndex: "nickName",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
  },
];

const data = [
  {
    key: "1",
    username: "xx",
    headPic: "xxx.png",
    nickName: "xxx",
    email: "xx@xx.com",
    createTime: new Date(),
  },
  {
    key: "12",
    username: "yy",
    headPic: "yy.png",
    nickName: "yyy",
    email: "yy@yy.com",
    createTime: new Date(),
  },
];

const UserManager: React.FC = () => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [userResult, setUserResult] = useState<UserSearchResult[]>();

  const searchUser = useCallback(async (values: SearchUser) => {
    const response = await userSearch(
      values.username,
      values.nickName,
      values.email,
      pageNo,
      pageSize
    );
    if (response.data?.code === 200 || response.data?.code === 201) {
      const users = response.data.data as UserSearchSuccessData;
      const result = users.data.map((user) => {
        return {
          key: user.username,
          ...user,
        };
      });
      setUserResult(result);
    } else {
      message.error((response.data.data as string) || "系统繁忙，请稍后再试");
    }
  }, []);

  return (
    <div id="userManage-container">
      <div className="userManage-form">
        <Form onFinish={searchUser} name="search" layout="inline" colon={false}>
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: "email", message: "请输入合法邮箱地址!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索用户
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="userManage-table">
        <Table
          columns={columns}
          dataSource={userResult}
          pagination={{
            pageSize: 10,
          }}
        />
      </div>
    </div>
  );
};

export default UserManager;
