import { User } from "@/types/user";
import { ApiClientCore } from "../../../core";

type LoginRes = {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  refreshToken: string;
  user: User;
};

export type RegisterRes = {
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  company: TCompany;
};

type GetCurrentUserRes = User;

type GetCurrentUserSessionRes = {
  user: User;
};

export type RegisterArgs = {
  user_data: {
    first_name: string;
    last_name: string;
    email: string;
    // password: string;
    // subscribe_news: boolean;
  };
  company_data: {
    name: string;
    num_employees: string;
    business_type: string;
    phone: string;
    pos: {
      lat: number;
      lng: number;
    };
  };
};

type SetPasswordArgs = {
  token: string;
  password: string;
};

type RecoverPasswordArgs = {
  email: string;
};

export type TUploadUserAvatarArgs = {
  userId: number;
  data: {
    file: File;
  };
};

export type TUpdateBusinessUserLineId = { userId: number; lineUserId: string };

export class ApiClientBusinessUser extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async login({ email, password }: { email: string; password: string }) {
    const res = await this.instanceWithoutAuth.post<LoginRes>("/auth/login", {
      email,
      password,
    });

    return res;
  }

  async register({ user_data, company_data }: RegisterArgs) {
    const data = {
      user_data,
      company_data,
    };

    const res = await this.instance.post<RegisterRes>("/users/company/register/", data);

    return res;
  }

  async setPassword({ token, password }: SetPasswordArgs) {
    const data = {
      token,
      password,
    };

    const res = await this.instance.post<RegisterRes>(
      "/users/company/register/set-password",
      data
    );

    return res;
  }

  async recoverPassword({ email }: RecoverPasswordArgs) {
    const data = {
      email,
    };

    const res = await this.instance.post<undefined>(
      "/users/company/reset-password/",
      data
    );

    return res;
  }

  async recoverPasswordSetPassword({ token, password }: SetPasswordArgs) {
    const data = {
      token,
      password,
    };

    const res = await this.instance.put<undefined>(
      "/users/company/reset-password/",
      data
    );

    return res;
  }

  async getCurrentUser() {
    const res = await this.instance.get<GetCurrentUserRes>(
      `/users/${this.currentUserId}`
    );

    return res;
  }

  async getCurrentUserSession() {
    const res = await this.instance.get<GetCurrentUserSessionRes>(`/auth/me`);

    return res;
  }

  async updateUserInformation(inputDto: Partial<User> & { id: string }) {
    const res = await this.instance.put<User>("/users/update", inputDto);

    return res;
  }

  async uploadUserAvatar(inputDto: TUploadUserAvatarArgs) {
    const formData = new FormData();
    formData.append("avatar", inputDto.data.file);

    const res = await this.instance.post<User>(
      `/users/avatar/upload/${inputDto.userId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  }

  async updateUserLineId({ userId, lineUserId }: TUpdateBusinessUserLineId) {
    return this.instance.patch<User>(`/users/${userId}/`, {
      line_user_id: lineUserId,
    });
  }
  // async uploadProfileAvatar(inputDto: { file: File }) {
  //   const formData = new FormData();
  //   formData.append("file", inputDto.file);

  //   const res = await this.instance.post<User>("/users/me/upload-avatar", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  //   return res;
  // }

  // async uploadProfileCoverImage(inputDto: { file: File }) {
  //   const formData = new FormData();
  //   formData.append("file", inputDto.file);

  //   const res = await this.instance.post<User>("/users/me/upload-cover-image", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  //   return res;
  // }
}
