import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/checkout/CheckoutForm';

// Load Stripe with your publishable key
// Make sure to set this in your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="max-w-lg mx-auto">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;