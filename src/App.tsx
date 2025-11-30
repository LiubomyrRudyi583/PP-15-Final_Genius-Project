import { useState, useEffect } from 'react';
import { ScheduleView } from './components/ScheduleView';
import { HomeworkView } from './components/HomeworkView';
import { SettingsView } from './components/SettingsView';
import { DownloadView } from './components/DownloadView';
import { DownloadModal } from './components/DownloadModal';
import { LoginScreen } from './components/LoginScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { Calendar, BookOpen, Settings, LogOut, MessagesSquare, Sparkles, Download, Lock } from 'lucide-react';
import { User } from './types';
import { getBackgroundForTheme } from './utils/backgrounds';
import logo from './assets/logo_main.png';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'schedule' | 'homework' | 'forum' | 'chat' | 'settings' | 'download'>('schedule');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    // Завантажити користувача з localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData: User = JSON.parse(savedUser);

      // Міграція: додати теми та фон для існуючих користувачів
      if (!userData.theme) {
        userData.theme = 'light';
      }
      if (userData.customBackground === undefined) {
        userData.customBackground = undefined;
      }

      // Автоматична зміна тижня кожні 7 днів
      const lastChange = new Date(userData.lastWeekChange);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));

      // Якщо минуло 7 днів або більше, змінити тип тижня
      if (daysDiff >= 7) {
        const weeksToChange = Math.floor(daysDiff / 7);
        let newWeekType = userData.currentWeekType;

        // Якщо непарна кількість тижнів - змінити тип
        if (weeksToChange % 2 === 1) {
          newWeekType = userData.currentWeekType === 'numerator' ? 'denominator' : 'numerator';
        }

        const updatedUser = {
          ...userData,
          currentWeekType: newWeekType,
          lastWeekChange: now.toISOString()
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setUser(userData);
        // Зберегти оновлені дані після міграції
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
  }, []);

  const handleLogin = (email: string, showProfileSetup: boolean) => {
    if (showProfileSetup) {
      // РЕЄСТРАЦІЯ → показати екран "Оберіть нікнейм"
      setTempEmail(email);
      setIsSettingUp(true);
    } else {
      // ЛОГІН → створити тимчасового користувача і одразу увійти в додаток
      // Для демо створюємо базовий профіль
      const tempUser: User = {
        email,
        nickname: email.split('@')[0].split('.')[0], // Використати ім'я з email
        avatar: '👤',
        subgroup: 1,
        groupName: 'ПП-15',
        currentWeekType: 'numerator',
        lastWeekChange: new Date().toISOString(),
        theme: 'light',
        customBackground: undefined,
        gender: 'male' // Default gender for temp users
      };
      setUser(tempUser);
      localStorage.setItem('user', JSON.stringify(tempUser));
    }
  };

  const handleProfileComplete = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsSettingUp(false);
    setTempEmail('');
  };

  const handleWeekTypeChange = (newWeekType: 'numerator' | 'denominator') => {
    if (user) {
      const updatedUser = {
        ...user,
        currentWeekType: newWeekType,
        lastWeekChange: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    if (confirm('Ви впевнені, що хочете вийти?')) {
      setUser(null);
      localStorage.removeItem('user');
      setShowUserMenu(false);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLockedTabClick = (tab: 'forum' | 'chat') => {
    setShowDownloadModal(true);
  };

  // Якщо користувач не авторизований
  if (!user && !isSettingUp) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Якщо налаштування профілю
  if (isSettingUp) {
    return <ProfileSetup email={tempEmail} onComplete={handleProfileComplete} />;
  }

  // Головний інтерфейс
  return (
    <div
      className={`min-h-screen transition-colors ${user.theme === 'dark' ? 'dark' : ''}`}
      style={{
        background: getBackgroundForTheme(user.backgroundId, user.customBackground, user.theme),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-sm">
              <img src={logo} alt="ШО Logo" className="w-24 h-24 object-contain" />
              <div>
                <p className="text-sm text-teal-600 dark:text-teal-400">{user.groupName} • Підгрупа {user.subgroup}</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-2xl">{user.avatar}</span>
                <span className="text-gray-700 dark:text-gray-200">{user.nickname}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Увійшли як</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Вийти
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 shadow-sm max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${activeTab === 'schedule'
              ? 'bg-violet-400 dark:bg-violet-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/30'
              }`}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">Розклад</span>
          </button>
          <button
            onClick={() => setActiveTab('homework')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${activeTab === 'homework'
              ? 'bg-teal-400 dark:bg-teal-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30'
              }`}
          >
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">ДЗ</span>
          </button>

          {/* LOCKED: Forum */}
          <button
            onClick={() => handleLockedTabClick('forum')}
            className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 relative"
          >
            <MessagesSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ШО там?</span>
            <Lock className="w-3 h-3 absolute top-1 right-1" />
          </button>

          {/* LOCKED: AI Assistant */}
          <button
            onClick={() => handleLockedTabClick('chat')}
            className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 relative"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ШІ-Асистент</span>
            <Lock className="w-3 h-3 absolute top-1 right-1" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${activeTab === 'settings'
              ? 'bg-gray-400 dark:bg-gray-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">Налаштування</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${activeTab === 'download'
              ? 'bg-green-400 dark:bg-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30'
              }`}
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm">Завантажити</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          {activeTab === 'schedule' ? (
            <ScheduleView
              subgroup={user.subgroup}
              weekType={user.currentWeekType}
              onWeekTypeChange={handleWeekTypeChange}
              gender={user.gender}
            />
          ) : activeTab === 'homework' ? (
            <HomeworkView currentUser={user.nickname} userSubgroup={user.subgroup} />
          ) : activeTab === 'download' ? (
            <DownloadView />
          ) : (
            <SettingsView user={user} onUpdateUser={handleUpdateUser} />
          )}
        </div>
      </div>

      {/* Close menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal onClose={() => setShowDownloadModal(false)} />
      )}
    </div>
  );
}
