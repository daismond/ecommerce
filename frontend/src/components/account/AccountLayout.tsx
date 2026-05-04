import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AccountSidebar: React.FC = () => (
  <aside className="w-64 bg-gray-100 p-6 rounded-lg">
    <h2 className="text-xl font-bold mb-4">My Account</h2>
    <nav>
      <ul>
        <li>
          <Link to="/account/orders" className="block py-2 text-gray-700 hover:text-blue-600">My Orders</Link>
        </li>
        <li>
          <Link to="/account/addresses" className="block py-2 text-gray-700 hover:text-blue-600">My Addresses</Link>
        </li>
        <li>
          <Link to="/account/settings" className="block py-2 text-gray-700 hover:text-blue-600">Account Settings</Link>
        </li>
      </ul>
    </nav>
  </aside>
);

const AccountLayout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex gap-8">
      <AccountSidebar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;