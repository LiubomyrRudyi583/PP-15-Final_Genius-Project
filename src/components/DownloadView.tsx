import { Download, Monitor, Apple, Smartphone, CheckCircle } from 'lucide-react';
import logo from '../assets/logo_pictogram.png';

export function DownloadView() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="ШО Logo" className="w-32 h-32 object-contain" />
        </div>
        <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-gray-100 mb-4">
          Отримайте повний функціонал у десктоп-додатку ШО!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Встановіть додаток на свій комп'ютер для швидшого доступу
        </p>
      </div>

      {/* Download Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Windows Installer */}
        <div className="bg-gradient-to-br from-violet-50 to-teal-50 dark:from-violet-900/20 dark:to-teal-900/20 rounded-2xl p-6 border-2 border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Windows Installer
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Рекомендовано
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Автоматична інсталяція з ярликом на робочому столі. Натисніть кнопку нижче, щоб завантажити файл встановлення.
          </p>

          <a
            href="https://github.com/YOUR_USERNAME/REPO_NAME/releases/download/v0.1.0/SHO.Setup.0.1.0.exe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-white py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 font-medium shadow-md"
            style={{ backgroundColor: '#8b5cf6' }} // Force violet color
          >
            <Download className="w-5 h-5" />
            Завантажити Windows App (Setup)
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            SHO Setup 0.1.0.exe • ~45 МБ
          </p>
        </div>

        {/* Portable Version */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Portable Version
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Без інсталяції
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            ZIP-архів для запуску без інсталяції. Просто розпакуйте і запустіть.
          </p>

          <a
            href="https://github.com/YOUR_USERNAME/REPO_NAME/releases/download/v0.1.0/SHO-0.1.0-win.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-white py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 font-medium shadow-md"
            style={{ backgroundColor: '#14b8a6' }} // Force teal color
          >
            <Download className="w-5 h-5" />
            Завантажити Portable (ZIP)
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            SHO-0.1.0-win.zip • ~55 МБ
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-violet-50 to-teal-50 dark:from-violet-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-violet-200 dark:border-violet-800">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">Переваги десктопного додатку</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-800 dark:text-gray-200">Швидший доступ</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Запускай додаток одним кліком</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-800 dark:text-gray-200">Офлайн режим</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Працюй без інтернету</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-800 dark:text-gray-200">ШІ-Асистент</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Розумний помічник для навчання</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-800 dark:text-gray-200">Форум з Одногрупниками</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Обговорюй завдання разом з групою</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-gray-900 dark:text-gray-100 mb-4">Системні вимоги</h3>
        <div className="text-sm max-w-xs mx-auto">
          <p className="text-violet-600 dark:text-violet-400 mb-2">Windows</p>
          <ul className="text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Windows 10 або новіше</li>
            <li>• 4 ГБ RAM</li>
            <li>• 100 МБ вільного місця</li>
          </ul>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          ℹ️ <span>Веб-версія завжди доступна за адресою вашого браузера. Десктопний додаток - це зручніший спосіб користуватися ШО.</span>
        </p>
      </div>
    </div>
  );
}