import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import { Coupon, DiscountType } from '../../types/coupon';

const AdminCouponFormPage: React.FC = () => {
  const { couponId } = useParams<{ couponId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(couponId);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: DiscountType.Percent,
    amount: 10,
    usage_limit: 100,
    valid_to: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the existing coupon data here
      // apiClient.get(`/admin/coupons/${couponId}`).then(...)
    }
  }, [couponId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Construct payload, ensuring correct types
    const payload = {
        ...formData,
        amount: parseFloat(String(formData.amount)),
        usage_limit: parseInt(String(formData.usage_limit), 10),
        valid_to: formData.valid_to || null, // Send null if empty
    };

    try {
      if (isEditMode) {
        await apiClient.patch(`/admin/coupons/${couponId}`, payload);
      } else {
        await apiClient.post('/admin/coupons/', payload);
      }
      navigate('/admin/coupons');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Coupon' : 'Create New Coupon'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg max-w-lg mx-auto">
        <div>
          <label>Code</label>
          <input name="code" value={formData.code} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label>Discount Type</label>
          <select name="discount_type" value={formData.discount_type} onChange={handleChange} className="w-full p-2 border">
            <option value={DiscountType.Percent}>Percent</option>
            <option value={DiscountType.Fixed}>Fixed Amount</option>
          </select>
        </div>
        <div>
          <label>Amount ({formData.discount_type === DiscountType.Percent ? '%' : '$'})</label>
          <input name="amount" type="number" value={formData.amount} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label>Usage Limit</label>
          <input name="usage_limit" type="number" value={formData.usage_limit} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label>Valid Until (Optional)</label>
          <input name="valid_to" type="date" value={formData.valid_to} onChange={handleChange} className="w-full p-2 border" />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg">
          {loading ? 'Saving...' : 'Save Coupon'}
        </button>
      </form>
    </div>
  );
};

export default AdminCouponFormPage;