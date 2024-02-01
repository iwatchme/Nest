import axios from "axios";
import { LoginUserInfo } from "./login";
import { RegisterUser } from './register';

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

export interface CustomResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export async function login(loginInfo: LoginUserInfo) {
  return await client.post<CustomResponse<string>>("/user/login", loginInfo);
}

export async function registerCaptcha(email: string) {
    return await client.get('/user/register-captcha', {
        params: {
            address: email
        }
    });
}

export async function register(registerUser: RegisterUser) {
  return await client.post('/user/register', registerUser);
}
