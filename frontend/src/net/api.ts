import axios from "axios";
import { LoginUserInfo } from "../login";
import { RegisterUser } from "../register";
import { UpdatePassword } from "../updatepassword";
import { message } from "antd";
import { LoginUser } from "./loginUser";
import { UserInfo } from "../page/update_info/updateInfo";

let refreshing = false;
const queue: PendingTask[] = [];

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return error.response;
  }
);

client.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.authorization = accessToken;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    const { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(client(config));
        });

        return client(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await client.get("/user/refresh", {
    params: {
      refresh_token: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.refresh_token || "");
  return res;
}

export interface BaseResponse {
  code: number;
  message: string;
}

type LoginSuccessResponse = BaseResponse & {
  data: LoginUser;
};

type FailedResponse = BaseResponse & {
  data: string;
};

export async function login(loginInfo: LoginUserInfo) {
  return await client.post<LoginSuccessResponse | FailedResponse>(
    "/user/login",
    loginInfo
  );
}

export async function adminLogin(loginInfo: LoginUserInfo) {
  return await client.post<LoginSuccessResponse | FailedResponse>(
    "/user/admin/login",
    loginInfo
  );
}

export async function registerCaptcha(email: string) {
  return await client.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

export async function register(registerUser: RegisterUser) {
  return await client.post("/user/register", registerUser);
}

export async function updatePasswordCaptcha(email: string) {
  return await client.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: UpdatePassword) {
  return await client.post("/user/update_password", data);
}

type UserInfoResponse = BaseResponse & {
  data: Partial<UserInfo>;
};

export async function getUserInfo() {
  return await client.get<UserInfoResponse>("/user/info");
}

export async function updateInfo(data: UserInfo) {
  return await client.post<BaseResponse & { data: string }>(
    "/user/update",
    data
  );
}

export async function updateUserInfoCaptcha() {
  return await client.get<BaseResponse & { data: string }>(
    "/user/update/captcha"
  );
}

interface UserSeachResult {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  createTime: Date;
}

export type UserSearchSuccessData = {
  data: UserSeachResult[];
  total: number;
};

export type UserSearchSuccessResponse = BaseResponse & {
  data: UserSearchSuccessData;
};

export async function userSearch(
  username: string,
  nickName: string,
  email: string,
  pageNo: number,
  pageSize: number
) {
  return await client.get<UserSearchSuccessResponse | FailedResponse>(
    "/user/search",
    {
      params: {
        username,
        nickName,
        email,
        pageNo,
        pageSize,
      },
    }
  );
}
