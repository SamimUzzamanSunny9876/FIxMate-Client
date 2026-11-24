import React from 'react';

const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: boolean }>;
}) => {
  const { canceled } = await searchParams;

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    );
  }

  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <button type="submit" role="link">
          Checkout 
        </button>
      </section>
    </form>
  );
};

export default PaymentPage;