import { useState, useEffect } from 'react';
import { mockSchedule } from '../data/mockData';
import { Homework } from '../types';
import { Plus, Calendar, User, Globe, Lock, Check, Trash2, Users } from 'lucide-react';
import { AddHomeworkDialog } from './AddHomeworkDialog';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface HomeworkViewProps {
  currentUser: string;
  userSubgroup: 1 | 2;
}

export function HomeworkView({ currentUser, userSubgroup }: HomeworkViewProps) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);

  // Real-time Firebase listener
  useEffect(() => {
    const q = query(collection(db, 'homework'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const homeworkData: Homework[] = [];
      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const deadline = new Date(data.deadline);
        const diffMs = now.getTime() - deadline.getTime();

        // Auto-delete if more than 1 day past deadline
        if (diffMs > oneDayMs) {
          deleteDoc(doc(db, 'homework', docSnap.id)).catch(err =>
            console.error('Failed to auto-delete expired homework:', err)
          );
        } else {
          homeworkData.push({
            id: docSnap.id,
            ...data
          } as Homework);
        }
      });

      setHomework(homeworkData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching homework:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addHomework = async (hw: Omit<Homework, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'homework'), {
        ...hw,
        createdAt: new Date().toISOString(),
        completed: false,
        completedBy: []
      });
    } catch (error) {
      console.error('Error adding homework:', error);
      alert('Помилка при додаванні завдання. Перевірте підключення до Firebase.');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const homeworkItem = homework.find(hw => hw.id === id);
      if (homeworkItem) {
        const completedBy = homeworkItem.completedBy || [];
        const isCompleted = completedBy.includes(currentUser);

        let newCompletedBy;
        if (isCompleted) {
          // Remove user from completedBy array
          newCompletedBy = completedBy.filter(user => user !== currentUser);
        } else {
          // Add user to completedBy array
          newCompletedBy = [...completedBy, currentUser];
        }

        await updateDoc(doc(db, 'homework', id), {
          completedBy: newCompletedBy
        });
      }
    } catch (error) {
      console.error('Error updating homework:', error);
      alert('Помилка при оновленні завдання.');
    }
  };

  const deleteHomework = async (id: string) => {
    const homeworkItem = homework.find(hw => hw.id === id);

    // Only allow deleting own homework
    if (homeworkItem && homeworkItem.addedBy !== currentUser) {
      alert('Ви можете видаляти тільки свої завдання!');
      return;
    }

    if (confirm('Видалити це завдання?')) {
      try {
        await deleteDoc(doc(db, 'homework', id));
      } catch (error) {
        console.error('Error deleting homework:', error);
        alert('Помилка при видаленні завдання.');
      }
    }
  };

  const filteredHomework = homework
    .filter(hw => {
      // First check if homework is public or belongs to current user
      if (!hw.isPublic && hw.addedBy !== currentUser) {
        return false; // Don't show private homework of other users
      }

      // Check if current user completed this homework
      const isCompletedByUser = hw.completedBy?.includes(currentUser) || false;

      // Фільтр за статусом (per-user)
      if (filter === 'active' && isCompletedByUser) return false;
      if (filter === 'completed' && !isCompletedByUser) return false;

      // Фільтр за підгрупою - показувати завдання для всіх та для підгрупи користувача
      if (hw.subgroup !== null && hw.subgroup !== undefined && hw.subgroup !== userSubgroup) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    // Reset time components for accurate day comparison
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = date.getTime() - now.getTime();
    const diffDaysExact = (dateDay.getTime() - nowDay.getTime()) / (1000 * 60 * 60 * 24);

    if (diffMs < 0) {
      return { text: 'Прострочено', color: 'text-red-600' };
    } else if (diffDaysExact === 0) {
      // Same day
      return { text: `Сьогодні о ${date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`, color: 'text-orange-600' };
    } else if (diffDaysExact < 7) {
      const days = Math.ceil(diffDaysExact);
      return { text: `Через ${days} дн.`, color: 'text-yellow-600' };
    } else {
      return { text: date.toLocaleDateString('uk-UA'), color: 'text-gray-600' };
    }
  };

  const getSubgroupBadge = (subgroup: 1 | 2 | null | undefined) => {
    if (subgroup === null || subgroup === undefined) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs">
          <Users className="w-3 h-3" />
          <span>Для всіх</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded text-xs">
        <span>Підгрупа {subgroup}</span>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'active'
              ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20'
              }`}
          >
            Активні
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'all'
              ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20'
              }`}
          >
            Усі
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'completed'
              ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20'
              }`}
          >
            Виконані
          </button>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-500 dark:hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Додати ДЗ
        </button>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="animate-spin w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p>Завантаження домашніх завдань...</p>
          </div>
        ) : filteredHomework.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Check className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{filter === 'completed' ? 'Немає виконаних завдань' : 'Немає домашніх завдань'}</p>
          </div>
        ) : (
          filteredHomework.map(hw => {
            const deadline = formatDate(hw.deadline);
            const isCompletedByUser = hw.completedBy?.includes(currentUser) || false;

            return (
              <div
                key={hw.id}
                className={`border rounded-xl p-4 transition-all ${isCompletedByUser
                  ? 'bg-violet-100 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 opacity-60'
                  : 'border-violet-200 dark:border-violet-800 hover:shadow-md bg-violet-50 dark:bg-violet-900/20'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(hw.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isCompletedByUser
                      ? 'bg-teal-400 dark:bg-teal-600 border-teal-400 dark:border-teal-600'
                      : 'border-violet-300 dark:border-violet-600 hover:border-violet-400 dark:hover:border-violet-500'
                      }`}
                  >
                    {isCompletedByUser && <Check className="w-3 h-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className={`text-violet-700 dark:text-violet-300 ${isCompletedByUser ? 'line-through' : ''}`}>
                        {hw.subject}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getSubgroupBadge(hw.subgroup)}
                        {hw.isPublic ? (
                          <span title="Для всієї групи">
                            <Globe className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                          </span>
                        ) : (
                          <span title="Особисте">
                            <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3">{hw.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className={`flex items-center gap-1 ${deadline.color} dark:opacity-90`}>
                        <Calendar className="w-4 h-4" />
                        <span>{deadline.text}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{hw.addedBy}</span>
                      </div>
                      <button
                        onClick={() => deleteHomework(hw.id)}
                        className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Homework Dialog */}
      {showAddDialog && (
        <AddHomeworkDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={addHomework}
          subjects={mockSchedule.map(cls => cls.subject).filter((v, i, a) => a.indexOf(v) === i)}
          currentUser={currentUser}
          userSubgroup={userSubgroup}
        />
      )}
    </div>
  );
}
