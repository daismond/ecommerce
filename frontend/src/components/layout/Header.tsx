import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const { cartItemCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          E-commerce
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;