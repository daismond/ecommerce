import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartView: React.FC = () => {
  const { cart, loading, removeFromCart } = useCart();

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
        <div className="p-4 border-t border-gray-200 flex justify-end items-center">
          <div className="text-right">
            <p className="text-xl font-bold">Subtotal: ${calculateSubtotal()}</p>
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