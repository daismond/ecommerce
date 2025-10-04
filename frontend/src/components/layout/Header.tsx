import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          E-commerce
        </Link>
        <nav>
          <ul className="flex space-x-6">
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
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                Cart
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