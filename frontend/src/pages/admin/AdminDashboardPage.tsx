import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { SalesSummary } from '../../types/reports';
import StatCard from '../../components/admin/dashboard/StatCard';
import TopSellingProducts from '../../components/admin/dashboard/TopSellingProducts';
import CriticalStock from '../../components/admin/dashboard/CriticalStock';
// Placeholder icons
const DollarSignIcon = () => <span>$</span>;
const ShoppingCartIcon = () => <span>&#128722;</span>;

const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<SalesSummary>('/admin/reports/summary')
      .then(response => {
        setSummary(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {loading ? (
          <p>Loading summary...</p>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`$${summary?.total_revenue.toFixed(2) || '0.00'}`}
              icon={<DollarSignIcon />}
            />
            <StatCard
              title="Total Orders"
              value={summary?.total_orders || 0}
              icon={<ShoppingCartIcon />}
            />
          </>
        )}
      </div>

      {/* Other Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts />
        <CriticalStock />
      </div>
    </div>
  );
};

export default AdminDashboardPage;