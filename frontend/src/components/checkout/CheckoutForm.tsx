import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import apiClient from '../../services/api';
import { useCart } from '../../context/CartContext';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({ name: '', street: '', city: '', zip: '' });
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [succeeded, setSucceeded] = useState<boolean>(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !cart) {
      return;
    }
    setProcessing(true);

    try {
      // 1. Create a checkout session on our backend
      const { data: session } = await apiClient.post('/checkout/', { shipping_address: shippingAddress });
      const clientSecret = session.client_secret;

      // 2. Confirm the card payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card Element not found");
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: shippingAddress.name },
        },
      });

      if (paymentResult.error) {
        setError(`Payment failed: ${paymentResult.error.message}`);
        setProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          // Here you would typically clear the cart and redirect to a success page
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setProcessing(false);
    }
  };

  if (succeeded) {
    return <h2 className="text-2xl font-bold text-green-600">Payment Succeeded! Thank you for your order.</h2>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
      <input name="name" placeholder="Full Name" onChange={handleAddressChange} required className="w-full p-2 border mb-2" />
      <input name="street" placeholder="Street Address" onChange={handleAddressChange} required className="w-full p-2 border mb-2" />
      <input name="city" placeholder="City" onChange={handleAddressChange} required className="w-full p-2 border mb-2" />
      <input name="zip" placeholder="ZIP Code" onChange={handleAddressChange} required className="w-full p-2 border mb-4" />

      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
      <div className="p-3 border rounded-md">
        <CardElement />
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : `Pay $${cart?.items.reduce((t, i) => t + i.product_variant.price * i.quantity, 0).toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;