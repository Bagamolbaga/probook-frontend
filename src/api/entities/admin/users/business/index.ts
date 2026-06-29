import { ApiClientCore } from "@/api/core";
import { RegisterArgs, RegisterRes } from "@/api/entities/user/business";

export type AdminRegisterArgs = RegisterArgs;

export class ApiClientAdminBusinessUser extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async createStore({ user_data, company_data }: AdminRegisterArgs) {
    const data = {
      user_data,
      company_data,
    };

    const res = await this.instance.post<RegisterRes>(
      "/superuser/users/company/register/",
      data
    );

    return res;
  }
}
