import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartView: React.FC = () => {
  const { cart, loading, removeFromCart, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    try {
      await applyCoupon(couponCode);
    } catch (error) {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + item.product_variant.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {cart.items.map(item => (
            <li key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-md mr-4">
                  {/* Image placeholder */}
                </div>
                <div>
                  <p className="font-semibold">{item.product_variant.product.title}</p>
                  <p className="text-sm text-gray-600">
                    {Object.values(item.product_variant.attributes).join(' / ')}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.product_variant.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold mt-1"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-200 flex justify-between items-start">
          <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="p-2 border rounded-md"
            />
            <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded-lg">Apply</button>
            {couponError && <p className="text-red-500 text-sm ml-2">{couponError}</p>}
          </form>
          <div className="text-right">
            <p className="text-lg">Subtotal: ${calculateSubtotal()}</p>
            {cart.discount_amount > 0 && (
              <p className="text-lg text-green-600">Discount: -${cart.discount_amount.toFixed(2)}</p>
            )}
            <p className="text-xl font-bold mt-2">
              Total: ${(parseFloat(calculateSubtotal()) - cart.discount_amount).toFixed(2)}
            </p>
            <Link to="/checkout" className="mt-4 inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;