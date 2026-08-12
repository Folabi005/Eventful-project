const paystackSecret = process.env.PAYSTACK_SECRET_KEY || '';
const shouldUseMockPaystack =
  !paystackSecret ||
  paystackSecret.startsWith('pk_') ||
  process.env.PAYSTACK_USE_MOCK === 'true' ||
  process.env.NODE_ENV !== 'production';

export const paymentService = {
  initializePayment: async (email: string, amountCents: number) => {
    if (shouldUseMockPaystack) {
      return {
        authorization_url: 'https://paystack.com/mock-payment',
        access_code: 'mock-access-code',
        reference: `MOCK-${Date.now()}`,
      };
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, amount: amountCents }),
    });
    const result = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; access_code: string; reference: string };
    };
    if (!result.status || !result.data) {
      throw new Error(result.message || 'Paystack initialization failed');
    }
    return result.data;
  },
  verifyPayment: async (reference: string) => {
    if (reference.startsWith('MOCK-') || shouldUseMockPaystack) {
      return { status: true, reference };
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });
    const result = (await response.json()) as {
      status: boolean;
      data?: { status: string };
      message?: string;
    };
    if (!result.status || !result.data) {
      throw new Error(result.message || 'Paystack verification failed');
    }
    return { status: result.data.status === 'success', reference };
  },
};
