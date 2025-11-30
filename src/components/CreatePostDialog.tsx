import { useState } from 'react';
import { X } from 'lucide-react';
import { Post } from '../types';

interface CreatePostDialogProps {
  onClose: () => void;
  onAdd: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  currentUser: string;
  userAvatar: string;
  categories: string[];
}

export function CreatePostDialog({ onClose, onAdd, currentUser, userAvatar, categories }: CreatePostDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: categories[0] || 'Інше'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    onAdd({
      author: currentUser,
      avatar: userAvatar,
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Створити новий пост</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Категорія</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Заголовок</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Про що ваш пост?"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Опис</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
              placeholder="Розкажіть детальніше..."
            />
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
              className="flex-1 px-4 py-2 bg-violet-400 text-white rounded-lg hover:bg-violet-500 transition-colors"
            >
              Опублікувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
