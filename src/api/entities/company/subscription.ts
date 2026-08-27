import { ApiClientCore } from "@/api/core";

export type TGetCompanySubscriptionArgs = {
  companyId: string;
};

export type TUpdateCompanySubscriptionArgs = {
  companyId: string;
  body: {
    num_employees: number;
  };
};

export class ApiClientCompanySubscription extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getSubscription({ companyId }: TGetCompanySubscriptionArgs) {
    return this.instance.get<TCompanySubscription>(
      `/companies/${companyId}/subscription/`
    );
  }

  async updateSubscription({ companyId, body }: TUpdateCompanySubscriptionArgs) {
    return this.instance.patch<TCompanySubscription>(
      `/companies/${companyId}/subscription/`,
      body
    );
  }

  async cancelSubscription({ companyId }: TGetCompanySubscriptionArgs) {
    return this.instance.delete<unknown>(`/companies/${companyId}/subscription/`);
  }
}
