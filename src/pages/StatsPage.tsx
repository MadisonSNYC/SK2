/**
 * @fileoverview Statistics page
 * @module pages/StatsPage
 */

import StatsDashboard from '../components/stats/StatsDashboard';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Lifetime Statistics</h1>
      <StatsDashboard />
    </div>
  );
}
