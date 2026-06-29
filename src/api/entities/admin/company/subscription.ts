import { ApiClientCore } from "@/api/core";

export type TGetCompanySubscriptionArgs = {
  companyId: number;
};

export type TUpdateCompanySubscriptionAsPayedArgs = TGetCompanySubscriptionArgs;

export type TUpdateCompanySubscriptionArgs = {
  companyId: number;
  body: {
    num_employees?: number;
    price_per_employee?: number;
  };
};

export class ApiClientCompanySubscription extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getSubscription({ companyId }: TGetCompanySubscriptionArgs) {
    return this.instance.get<TCompanySubscription>(
      `/superuser/companies/${companyId}/subscription/`
    );
  }

  async updateSubscription({ companyId, body }: TUpdateCompanySubscriptionArgs) {
    return this.instance.patch<TCompanySubscription>(
      `/superuser/companies/${companyId}/subscription/`,
      body
    );
  }

  async cancelSubscription({ companyId }: TGetCompanySubscriptionArgs) {
    return this.instance.delete<unknown>(
      `/superuser/companies/${companyId}/subscription/`
    );
  }
  
  async markSubscriptionAsPayed({ companyId }: TUpdateCompanySubscriptionAsPayedArgs) {
    return this.instance.post<unknown>(
      `/superuser/companies/${companyId}/subscription/pay/`
    );
  }
}
