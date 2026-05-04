import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminSidebar: React.FC = () => (
  <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
    <div className="p-4 text-2xl font-bold">Admin Panel</div>
    <nav>
      <ul>
        <li>
          <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-700">Products</Link>
        </li>
        <li>
          <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-700">Orders</Link>
        </li>
        <li>
          <Link to="/admin/customers" className="block px-4 py-2 hover:bg-gray-700">Customers</Link>
        </li>
        <li>
          <Link to="/admin/coupons" className="block px-4 py-2 hover:bg-gray-700">Coupons</Link>
        </li>
      </ul>
    </nav>
  </aside>
);

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-grow p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;