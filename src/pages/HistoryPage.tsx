export default function HistoryPage() {
  return (
    <div className="p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Session History</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400 mb-4">Coming in Phase 6</p>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>• View all past sessions</li>
          <li>• Filter by machine, location, date</li>
          <li>• Sort by profit/loss, duration</li>
          <li>• View detailed session breakdowns</li>
          <li>• Export session data</li>
        </ul>
      </div>
    </div>
  );
}
