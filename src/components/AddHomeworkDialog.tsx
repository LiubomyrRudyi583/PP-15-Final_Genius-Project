import { useState } from 'react';
import { X } from 'lucide-react';
import { Homework } from '../types';

interface AddHomeworkDialogProps {
  onClose: () => void;
  onAdd: (homework: Omit<Homework, 'id' | 'createdAt'>) => void;
  subjects: string[];
  currentUser: string;
  userSubgroup: 1 | 2;
}

export function AddHomeworkDialog({ onClose, onAdd, subjects, currentUser, userSubgroup }: AddHomeworkDialogProps) {
  const [formData, setFormData] = useState({
    subject: subjects[0] || '',
    description: '',
    deadline: '',
    addedBy: currentUser,
    isPublic: true,
    subgroup: null as 1 | 2 | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.description || !formData.deadline || !formData.addedBy) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    onAdd({
      subject: formData.subject,
      description: formData.description,
      deadline: formData.deadline,
      addedBy: formData.addedBy,
      isPublic: formData.isPublic,
      completed: false,
      subgroup: formData.subgroup
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Додати домашнє завдання</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Предмет</label>
            <select
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Опис завдання</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
              placeholder="Що потрібно зробити?"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Дедлайн</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Ваше ім'я</label>
            <input
              type="text"
              value={formData.addedBy}
              onChange={e => setFormData({ ...formData, addedBy: e.target.value })}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Наприклад: Олексій К."
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Для кого це завдання?</label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, subgroup: null })}
                className={`w-full py-2 px-4 rounded-lg border-2 transition-all text-center ${formData.subgroup === null
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-violet-200 text-gray-700 hover:border-violet-300'
                  }`}
              >
                Для всієї групи (обидві підгрупи)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, subgroup: 1 })}
                  className={`py-2 px-4 rounded-lg border-2 transition-all text-center ${formData.subgroup === 1
                    ? 'border-violet-400 bg-violet-50 text-violet-700'
                    : 'border-violet-200 text-gray-700 hover:border-violet-300'
                    }`}
                >
                  Тільки підгрупа 1
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, subgroup: 2 })}
                  className={`py-2 px-4 rounded-lg border-2 transition-all text-center ${formData.subgroup === 2
                    ? 'border-violet-400 bg-violet-50 text-violet-700'
                    : 'border-violet-200 text-gray-700 hover:border-violet-300'
                    }`}
                >
                  Тільки підгрупа 2
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-teal-400 rounded focus:ring-2 focus:ring-teal-300"
            />
            <label htmlFor="isPublic" className="text-gray-700">
              Поділитися з усією групою
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-violet-200 text-gray-700 rounded-lg hover:bg-violet-50 transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors"
            >
              Додати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
