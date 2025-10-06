import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import type { Order } from '../../types/order';
import { useAuth } from '../../context/AuthContext';

const UserOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Order>(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details. You may not be authorized to view this order.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <Link to="/account/orders" className="text-blue-600 hover:underline mb-6 block">&larr; Back to My Orders</Link>
      <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
            <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Status</p>
            <p className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 inline-block">{order.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Shipping Address</h2>
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.street}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.zip}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Order Summary</h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map(item => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>{item.product_variant.product.title} (x{item.quantity})</span>
                  <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-lg mt-2 border-t pt-2">
              Total: ${order.total_amount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetailPage;