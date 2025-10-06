import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api';
import type { ProductVariantWithProduct } from '../../../types/responses';

const CriticalStock: React.FC = () => {
  const [variants, setVariants] = useState<ProductVariantWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ProductVariantWithProduct[]>('/admin/reports/critical-stock')
      .then(response => {
        setVariants(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading stock levels...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Critical Stock Levels (10 or less)</h3>
      <ul className="divide-y divide-gray-200">
        {variants.map(variant => (
          <li key={variant.id} className="py-2 flex justify-between">
            <div>
              <p>{variant.product.title}</p>
              <p className="text-sm text-gray-500">{Object.values(variant.attributes).join(' / ')}</p>
            </div>
            <span className="font-semibold text-red-600">{variant.stock} left</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriticalStock;