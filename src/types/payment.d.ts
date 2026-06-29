type TPaymentDetails = {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  billing_period: string;
};

type TPaymentHistoryItem = Record