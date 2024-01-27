interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string | null;

  phoneNumber: string | null;

  isFrozen: boolean;

  isAdmin: boolean;

  createTime: number;

  roles: string[];

  permissions: Permission[];
}

export interface Permission {
  id: number;

  code: string;

  desc: string;
}

export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
