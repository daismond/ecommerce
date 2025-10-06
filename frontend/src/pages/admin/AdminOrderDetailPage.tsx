import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import type { Order } from '../../types/order';

const AdminOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const possibleStatuses = ["pending_payment", "processing", "shipped", "delivered", "cancelled"];

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Order>(`/admin/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      const response = await apiClient.patch<Order>(`/admin/orders/${order.id}`, { status: newStatus });
      setOrder(response.data);
      alert('Order status updated successfully!');
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order #{order.order_number}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <ul className="divide-y divide-gray-200">
            {order.items.map(item => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{item.product_variant.product.title} (x{item.quantity})</span>
                <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold text-lg mt-4 border-t pt-4">
            Total: ${order.total_amount}
          </div>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Customer & Shipping</h2>
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.street}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.zip}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Order Status</h2>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {possibleStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;