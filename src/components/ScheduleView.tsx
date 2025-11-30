import { useState, useEffect } from 'react';
import { mockSchedule } from '../data/mockData';
import { ScheduleClass } from '../types';
import { Clock, MapPin, User, BookOpen, RefreshCw } from 'lucide-react';

interface ScheduleViewProps {
  subgroup: 1 | 2;
  weekType: 'numerator' | 'denominator';
  onWeekTypeChange: (weekType: 'numerator' | 'denominator') => void;
  gender: 'male' | 'female';
}

export function ScheduleView({ subgroup, weekType, onWeekTypeChange, gender }: ScheduleViewProps) {
  const [schedule, setSchedule] = useState<ScheduleClass[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Понеділок');
  const [viewSubgroup, setViewSubgroup] = useState<1 | 2>(subgroup); // Прибрали 'all'

  const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця'];

  useEffect(() => {
    // Load from localStorage or use mock data
    const saved = localStorage.getItem('schedule');
    setSchedule(saved ? JSON.parse(saved) : mockSchedule);
  }, []);

  // Оновлюємо viewSubgroup при зміні підгрупи користувача
  useEffect(() => {
    setViewSubgroup(subgroup);
  }, [subgroup]);

  // Фільтрувати розклад за днем, підгрупою та типом тижня
  const filteredSchedule = schedule.filter(cls => {
    if (cls.day !== selectedDay) return false;
    if (cls.weekType !== weekType) return false;

    // Якщо subgroup є null - заняття для всіх
    if (cls.subgroup === null) return true;
    // Інакше - тільки для вибраної підгрупи
    return cls.subgroup === viewSubgroup;
  });

  const toggleWeekType = () => {
    const newWeekType = weekType === 'numerator' ? 'denominator' : 'numerator';
    onWeekTypeChange(newWeekType);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300';
      case 'practice':
        return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300';
      case 'lab':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'Лекція';
      case 'practice':
        return 'Практика';
      case 'lab':
        return 'Лабораторна';
      default:
        return type;
    }
  };

  return (
    <div>
      {/* Week Type Selector */}
      <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{weekType === 'numerator' ? '🔢' : '➗'}</span>
          <div>
            <p className="text-gray-700 dark:text-gray-200">
              {weekType === 'numerator' ? 'Чисельник' : 'Знаменник'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Поточний тиждень</p>
          </div>
        </div>
        <button
          onClick={toggleWeekType}
          className="flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Змінити
        </button>
      </div>



      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedDay === day
              ? 'bg-violet-400 dark:bg-violet-600 text-white shadow-md'
              : 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50'
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {filteredSchedule.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Немає занять на {selectedDay}</p>
          </div>
        ) : (
          filteredSchedule.map(cls => {
            let teacherName = cls.teacher;
            let subjectName = cls.subject;
            let roomName = cls.room;

            // Gender-based filtering for Wednesday Physical Education
            if (gender === 'male') {
              // For males keep only "Стрийський парк😥"
              roomName = roomName.replace('/#Годівничка-для тих, хто шарить😜', '');
            } else if (gender === 'female') {
              // For females keep only "#Годівничка-для тих, хто шарить😜"
              roomName = roomName.replace('Стрийський парк😥/', '');
            }


            return (
              <div
                key={cls.id}
                className="border border-violet-200 dark:border-violet-800 rounded-xl p-4 hover:shadow-md transition-shadow bg-violet-50 dark:bg-violet-900/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-violet-700 dark:text-violet-300">{subjectName}</h3>
                      {cls.subgroup && (
                        <span className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-1 rounded">
                          Підгрупа {cls.subgroup}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{cls.time}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(cls.type)}`}>
                    {getTypeLabel(cls.type)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 text-violet-400 dark:text-violet-400" />
                    <span>{teacherName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-teal-400 dark:text-teal-400" />
                    <span>{roomName}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}