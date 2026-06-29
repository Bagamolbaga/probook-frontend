import { ApiClientCore } from "@/api/core";

type TCreateSubscriptionCheckoutLinkArgs = {
  stripePriceId: string;
  successUrl?: string;
  cancelUrl?: string;
};

type TCreateSubscriptionCheckoutLinkRes = {
  checkout_url: string;
};

type TGetPaymentDetailsAndHistoryRes = {
  payment_details: TPaymentDetails;
  payment_history: any[];
};

type TGetSubscriptionPlansRes = {
  plans: {
    id: string;
    name: string
    description: string
    features: string[]
    amount: number;
    currency: string;
    interval: string;
  }[];
};

export class ApiClientPayments extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async createSubscriptionCheckoutLink({
    stripePriceId,
    successUrl,
    cancelUrl,
  }: TCreateSubscriptionCheckoutLinkArgs) {
    const data = {
      price_id: stripePriceId,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
    };

    const res = await this.instance.post<TCreateSubscriptionCheckoutLinkRes>(
      `/payments/create-checkout-session/`,
      data
    );
    return res;
  }

  async getSubscriptionPlans() {
    return await this.instance.get<TGetSubscriptionPlansRes>("/payments/plans");
  }

  async getPaymentDetailsAndHistory() {
    return await this.instance.get<TGetPaymentDetailsAndHistoryRes>(
      "/payments/transaction-history"
    );
  }
}
