export default function StatsPage() {
  return (
    <div className="p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Lifetime Statistics</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400 mb-4">Coming in Phase 6</p>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>• Total sessions and play time</li>
          <li>• Net profit/loss</li>
          <li>• Win rate and ROI</li>
          <li>• Biggest wins and losses</li>
          <li>• Win/lose streaks</li>
          <li>• Follow Me statistics</li>
          <li>• Machine-specific performance</li>
        </ul>
      </div>
    </div>
  );
}
