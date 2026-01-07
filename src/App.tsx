import { useState } from 'react';
import MachineList from './components/machines/MachineList';
import FollowMeHelper from './components/follow-me/FollowMeHelper';

type Tab = 'tracker' | 'follow-me' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tracker');

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 text-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-yellow-400">🎰 SkillMachine</h1>
        <p className="text-gray-400 text-xs mt-1">PA Skill Game Tracker</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {activeTab === 'tracker' && <MachineList />}

        {activeTab === 'follow-me' && <FollowMeHelper />}

        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            <p className="text-gray-400 text-sm">Coming in Phase 4</p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg max-w-sm mx-auto">
              <p className="text-xs text-gray-500">
                Theme, TTS settings, data export
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="flex justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'tracker'
                ? 'bg-gray-700 text-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="text-xs mt-1">Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('follow-me')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'follow-me'
                ? 'bg-gray-700 text-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-lg">🎯</span>
            <span className="text-xs mt-1">Follow Me</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-gray-700 text-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
