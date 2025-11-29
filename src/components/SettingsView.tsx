import { Moon, Sun } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export function SettingsView({ user, onUpdateUser, onLogout }: SettingsViewProps) {
  const handleThemeChange = (theme: 'light' | 'dark') => {
    onUpdateUser({ ...user, theme });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-400 rounded-lg flex items-center justify-center">
            {user.theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-gray-100">Тема інтерфейсу</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Вибери світлу або темну тему</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              user.theme === 'light'
                ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
            }`}
          >
            <Sun className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">Світла</span>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              user.theme === 'dark'
                ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
            }`}
          >
            <Moon className="w-5 h-5 text-blue-500" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">Темна</span>
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-gray-900 dark:text-gray-100 mb-4">Акаунт</h2>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Вийти з акаунта
        </button>
      </div>
    </div>
  );
}
