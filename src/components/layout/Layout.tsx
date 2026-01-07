import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 text-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-yellow-400">🎰 SkillMachine</h1>
        <p className="text-xs text-gray-400">PA Skill Game Tracker</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-gray-800 border-t border-gray-700 flex">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm ${isActive ? 'text-yellow-400 bg-gray-700' : 'text-gray-400'}`
          }
        >
          🏠 Home
        </NavLink>
        <NavLink
          to="/follow-me"
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm ${isActive ? 'text-yellow-400 bg-gray-700' : 'text-gray-400'}`
          }
        >
          🎯 Follow Me
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm ${isActive ? 'text-yellow-400 bg-gray-700' : 'text-gray-400'}`
          }
        >
          📊 Stats
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm ${isActive ? 'text-yellow-400 bg-gray-700' : 'text-gray-400'}`
          }
        >
          ⚙️ Settings
        </NavLink>
      </nav>
    </div>
  );
}
