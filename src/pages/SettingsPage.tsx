export default function SettingsPage() {
  return (
    <div className="p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400 mb-4">Coming in Phase 5</p>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>• Theme customization (dark/light)</li>
          <li>• TTS voice and speed settings</li>
          <li>• Currency preferences</li>
          <li>• Data export/import</li>
          <li>• Account management</li>
        </ul>
      </div>
    </div>
  );
}
