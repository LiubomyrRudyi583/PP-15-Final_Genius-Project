import { X, Download, Monitor, CheckCircle } from 'lucide-react';
import logo from 'figma:asset/1c48c0d0410a0300d245194d4d6c84495a6138c4.png';

interface DownloadModalProps {
  onClose: () => void;
}

export function DownloadModal({ onClose }: DownloadModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ШО Logo" className="w-12 h-12 object-contain" />
            <h2 className="text-gray-900 dark:text-gray-100">ШО</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Для доступу до цієї функції завантажте десктопну версію ШО
          </p>

          {/* Windows Download */}
          <div className="bg-gradient-to-br from-violet-50 to-teal-50 dark:from-violet-900/20 dark:to-teal-900/20 rounded-xl p-4 border-2 border-violet-200 dark:border-violet-800 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Windows</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Версія 1.0.0 • 45 МБ</p>
              </div>
            </div>
            <button className="w-full bg-violet-400 dark:bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-500 dark:hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Завантажити
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">У десктопній версії доступно:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">ШІ-Асистент для навчання</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Форум з одногрупниками</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Офлайн режим</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Швидший доступ</p>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Системні вимоги:</p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Windows 10 або новіше</li>
              <li>• 4 ГБ RAM</li>
              <li>• 100 МБ вільного місця</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
