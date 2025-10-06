import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import type { Order } from '../../types/order';
import { useAuth } from '../../context/AuthContext';

const UserOrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Order[]>('/orders/me');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch your orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">Order #{order.order_number}</p>
                <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Status: <span className="font-medium">{order.status}</span></p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.total_amount}</p>
                <Link to={`/account/orders/${order.id}`} className="text-blue-600 hover:underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderListPage;