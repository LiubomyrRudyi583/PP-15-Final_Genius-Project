import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import AuthPage from './components/auth/AuthPage';
import { ProfileSetup } from './components/ProfileSetup';
import { ScheduleView } from './components/ScheduleView';
import { SettingsView } from './components/SettingsView';
import { Calendar, Settings, LogOut } from 'lucide-react';
import { User } from './types';
import logoWhite from './assets/logo_white.png';
import logoBlack from './assets/logo_black.png';

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isSettingUp, setIsSettingUp] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const email = user.email || '';
                const savedUser = localStorage.getItem('user_v2');

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    // New user - needs setup
                    setTempEmail(email);
                    setIsSettingUp(true);
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user_v2', JSON.stringify(updatedUser));
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('user_v2');
            setUser(null);
            setActiveTab('schedule');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileComplete = (profileData: Omit<User, 'email'>) => {
        const newUser: User = {
            ...profileData,
            email: tempEmail,
            theme: 'light',
            backgroundId: 'default',
            currentWeekType: 'numerator',
            lastWeekChange: new Date().toISOString()
        };
        setUser(newUser);
        localStorage.setItem('user_v2', JSON.stringify(newUser));
        setIsSettingUp(false);
    };

    // Apply theme
    useEffect(() => {
        if (user?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user?.theme]);

    if (!user) {
        return <AuthPage />;
    }

    if (isSettingUp) {
        return <ProfileSetup email={tempEmail} onComplete={handleProfileComplete} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src={user.theme === 'dark' ? logoWhite : logoBlack}
                                alt="SHO Logo"
                                className="h-10 w-auto"
                            />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SHO</h1>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{user.avatar}</span>
                                <span className="text-gray-900 dark:text-white font-medium">{user.nickname}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="Вийти"
                            >
                                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 py-2">
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'schedule'
                                ? 'bg-orange-400 dark:bg-orange-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                                }`}
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Розклад</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'settings'
                                ? 'bg-orange-400 dark:bg-orange-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Налаштування</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'schedule' && (
                    <ScheduleView
                        weekType={user.currentWeekType}
                        subgroup={user.subgroup}
                        gender={user.gender}
                        onWeekTypeChange={(newType) => handleUpdateUser({ ...user, currentWeekType: newType })}
                    />
                )}
                {activeTab === 'settings' && (
                    <SettingsView
                        user={user}
                        onUpdateUser={handleUpdateUser}
                        onLogout={handleLogout}
                    />
                )}
            </main>
        </div>
    );
}
