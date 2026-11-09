export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface SubscriptionResult {
  subscriptionId: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  trialEnd: string | null;
  currentPeriodEnd: string;
}

export interface PaymentProvider {
  createSubscription(params: {
    planId: string;
    email: string;
    sessionId: string;
  }): Promise<{ clientSecret: string; subscriptionId: string }>;

  confirmSubscription(subscriptionId: string): Promise<SubscriptionResult>;

  createOneTimePayment(params: {
    upsellId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
  }): Promise<{ success: boolean }>;
}

export class MockPaymentProvider implements PaymentProvider {
  async createSubscription(params: {
    planId: string;
    email: string;
    sessionId: string;
  }): Promise<{ clientSecret: string; subscriptionId: string }> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      clientSecret: `mock_secret_${Date.now()}`,
      subscriptionId: `mock_sub_${Date.now()}`,
    };
  }

  async confirmSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    await new Promise((r) => setTimeout(r, 500));
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const periodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    return {
      subscriptionId,
      status: "trialing",
      trialEnd,
      currentPeriodEnd: periodEnd,
    };
  }

  async createOneTimePayment(): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true };
  }
}
