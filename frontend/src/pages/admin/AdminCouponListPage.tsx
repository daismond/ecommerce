import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { Coupon } from '../../types/coupon'; // I will create this type next

const AdminCouponListPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Coupon[]>('/admin/coupons/');
        setCoupons(response.data);
      } catch (err) {
        setError('Failed to fetch coupons.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) return <p>Loading coupons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Coupons</h1>
        <Link
          to="/admin/coupons/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Coupon
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.discount_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.discount_type === 'percent' ? `${coupon.amount}%` : `$${coupon.amount}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.used_count} / {coupon.usage_limit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/coupons/edit/${coupon.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                  {/* Delete button logic will be added later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponListPage;