import { useState } from 'react';
import { User as UserIcon, Upload, ArrowRight, Home } from 'lucide-react';
import { User } from '../types';
import errorImage from 'figma:asset/d98b6e5f3aec397c3af056bc360a335b15c32744.png';

interface ProfileSetupProps {
  email: string;
  onComplete: (user: User) => void;
}

const defaultAvatars = [
  '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍💻', '👩‍💻',
  '🦁', '🐯', '🐼', '🐨', '🦊',
  '🚀', '⚡', '🌟', '🔥', '💎'
];

const groups = ['ПП-11', 'ПП-12', 'ПП-13', 'ПП-14', 'ПП-15', 'ПП-16'];

export function ProfileSetup({ email, onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState<'nickname' | 'avatar' | 'gender' | 'group' | 'week' | 'error'>('nickname');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatar, setCustomAvatar] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ПП-15');
  const [subgroup, setSubgroup] = useState<1 | 2>(1);
  const [weekType, setWeekType] = useState<'numerator' | 'denominator'>('numerator');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleNicknameNext = () => {
    if (!nickname.trim()) {
      alert('Введіть нікнейм');
      return;
    }
    setStep('avatar');
  };

  const handleAvatarNext = () => {
    if (!avatar && !customAvatar) {
      // Можна проустити
      setAvatar('👤');
    }
    setStep('gender');
  };

  const handleGenderNext = () => {
    setStep('group');
  };

  const handleGroupNext = () => {
    // Перевірка чи обрана група ПП-15
    if (selectedGroup !== 'ПП-15') {
      setStep('error');
      return;
    }
    setStep('week');
  };

  const handleComplete = () => {
    const user: User = {
      email,
      nickname: nickname.trim(),
      avatar: customAvatar || avatar || '👤',
      subgroup,
      groupName: selectedGroup,
      currentWeekType: weekType,
      lastWeekChange: new Date().toISOString(),
      theme: 'light',
      customBackground: undefined,
      gender: gender
    };
    onComplete(user);
  };

  const selectAvatar = (av: string) => {
    setAvatar(av);
    setCustomAvatar('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const resetToStart = () => {
    // Повертаємося до вибору підгрупи, а не до початку
    setStep('group');
    setSelectedGroup('ПП-15');
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-teal-50 flex items-center justify-center p-4"
      onKeyPress={(e) => {
        // Глобальна підтримка Enter для всього компонента
        if (e.key === 'Enter') {
          e.preventDefault();
          if (step === 'nickname') handleNicknameNext();
          else if (step === 'avatar') handleAvatarNext();
          else if (step === 'group') handleGroupNext();
          else if (step === 'week') handleComplete();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Progress */}
        {step !== 'error' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step === 'nickname' ? 'bg-violet-400' : 'bg-violet-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'avatar' ? 'bg-violet-400' : 'bg-violet-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'gender' ? 'bg-violet-400' : 'bg-violet-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'group' ? 'bg-violet-400' : 'bg-violet-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'week' ? 'bg-violet-400' : 'bg-violet-200'}`} />
          </div>
        )}

        {/* Error Step - Wrong Group Selected */}
        {step === 'error' && (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">😅</div>
            <img
              src={errorImage}
              alt="Студент в замішанні"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-gray-900 mb-2">Упс! Щось не так... 🤔</h2>
            <p className="text-gray-600 mb-4">
              Здається, ти обрав групу <span className="text-violet-600">{selectedGroup}</span>,
              але цей додаток створений спеціально для групи <span className="text-teal-600">ПП-15</span>!
            </p>
            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200 mb-6">
              <p className="text-sm text-gray-700">
                💡 Можливо, ти заблукав? Або хочеш підглянути, як круто живуть сусіди? 😏
              </p>
            </div>
            <button
              onClick={resetToStart}
              className="w-full bg-teal-400 text-white py-3 rounded-lg hover:bg-teal-500 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Повернутися на початок
            </button>
          </div>
        )}

        {/* Nickname Step */}
        {step === 'nickname' && (
          <div className="space-y-6">
            <div className="text-center">
              <UserIcon className="w-12 h-12 mx-auto mb-3 text-violet-400" />
              <h2 className="text-gray-900 mb-2">Оберіть нікнейм</h2>
              <p className="text-gray-600">Як вас називати в додатку?</p>
            </div>

            <div>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleNicknameNext)}
                placeholder="Введіть нікнейм"
                className="w-full px-4 py-3 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                autoFocus
              />
            </div>

            <button
              onClick={handleNicknameNext}
              className="w-full bg-violet-400 text-white py-3 rounded-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
            >
              Далі
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Avatar Step */}
        {step === 'avatar' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">{customAvatar || avatar || '👤'}</div>
              <h2 className="text-gray-900 mb-2">Оберіть аватар</h2>
              <p className="text-gray-600">Або пропустіть цей крок</p>
            </div>

            {/* Default Avatars Grid */}
            <div className="grid grid-cols-5 gap-3">
              {defaultAvatars.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => selectAvatar(av)}
                  className={`text-3xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${avatar === av && !customAvatar
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-violet-200 hover:border-violet-300'
                    }`}
                >
                  {av}
                </button>
              ))}
            </div>

            {/* Custom Avatar */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Або введіть свій емодзі</label>
              <div className="relative">
                <input
                  type="text"
                  value={customAvatar}
                  onChange={e => {
                    setCustomAvatar(e.target.value);
                    setAvatar('');
                  }}
                  onKeyPress={e => handleKeyPress(e, handleAvatarNext)}
                  placeholder="🎨"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('nickname')}
                className="flex-1 px-4 py-3 border border-violet-200 text-gray-700 rounded-lg hover:bg-violet-50 transition-colors text-center"
              >
                Назад
              </button>
              <button
                onClick={handleAvatarNext}
                className="flex-1 bg-violet-400 text-white py-3 rounded-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
              >
                Далі
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Gender Step */}
        {step === 'gender' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">⚧️</div>
              <h2 className="text-gray-900 mb-2">Ваша стать</h2>
              <p className="text-gray-600">Для персоналізації розкладу</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('male')}
                className={`py-4 rounded-lg border-2 transition-all text-center ${gender === 'male'
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-violet-200 text-gray-700 hover:border-violet-300'
                  }`}
              >
                <div className="text-3xl mb-2">👨</div>
                Хлопець
              </button>
              <button
                onClick={() => setGender('female')}
                className={`py-4 rounded-lg border-2 transition-all text-center ${gender === 'female'
                  ? 'border-pink-400 bg-pink-50 text-pink-700'
                  : 'border-violet-200 text-gray-700 hover:border-violet-300'
                  }`}
              >
                <div className="text-3xl mb-2">👩</div>
                Дівчина
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('avatar')}
                className="flex-1 px-4 py-3 border border-violet-200 text-gray-700 rounded-lg hover:bg-violet-50 transition-colors text-center"
              >
                Назад
              </button>
              <button
                onClick={handleGenderNext}
                className="flex-1 bg-violet-400 text-white py-3 rounded-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
              >
                Далі
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Group Selection Step */}
        {step === 'group' && (
          <div className="space-y-6" onKeyPress={e => handleKeyPress(e, handleGroupNext)}>
            <div className="text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h2 className="text-gray-900 mb-2">Оберіть групу та підгрупу</h2>
              <p className="text-gray-600">Щоб бачити правильний розклад</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Група</label>
              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Підгрупа</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSubgroup(1)}
                  className={`py-3 rounded-lg border-2 transition-all text-center ${subgroup === 1
                    ? 'border-teal-400 bg-teal-50 text-teal-700'
                    : 'border-violet-200 text-gray-700 hover:border-violet-300'
                    }`}
                >
                  Підгрупа 1
                </button>
                <button
                  onClick={() => setSubgroup(2)}
                  className={`py-3 rounded-lg border-2 transition-all text-center ${subgroup === 2
                    ? 'border-teal-400 bg-teal-50 text-teal-700'
                    : 'border-violet-200 text-gray-700 hover:border-violet-300'
                    }`}
                >
                  Підгрупа 2
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('avatar')}
                className="flex-1 px-4 py-3 border border-violet-200 text-gray-700 rounded-lg hover:bg-violet-50 transition-colors text-center"
              >
                Назад
              </button>
              <button
                onClick={handleGroupNext}
                className="flex-1 bg-violet-400 text-white py-3 rounded-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
              >
                Далі
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Week Type Selection Step */}
        {step === 'week' && (
          <div className="space-y-6" onKeyPress={e => handleKeyPress(e, handleComplete)}>
            <div className="text-center">
              <div className="text-5xl mb-3">📅</div>
              <h2 className="text-gray-900 mb-2">Поточний тиждень</h2>
              <p className="text-gray-600">Оберіть поточний тип тижня</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setWeekType('numerator')}
                className={`py-4 rounded-lg border-2 transition-all text-center ${weekType === 'numerator'
                  ? 'border-violet-400 bg-violet-50 text-violet-700'
                  : 'border-violet-200 text-gray-700 hover:border-violet-300'
                  }`}
              >
                <div className="mb-1">🔢</div>
                Чисельник
              </button>
              <button
                onClick={() => setWeekType('denominator')}
                className={`py-4 rounded-lg border-2 transition-all text-center ${weekType === 'denominator'
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-violet-200 text-gray-700 hover:border-violet-300'
                  }`}
              >
                <div className="mb-1">➗</div>
                Знаменник
              </button>
            </div>

            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
              <p className="text-sm text-gray-600 text-center">
                💡 Програма буде автоматично змінювати тижні кожні 7 днів
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('group')}
                className="flex-1 px-4 py-3 border border-violet-200 text-gray-700 rounded-lg hover:bg-violet-50 transition-colors text-center"
              >
                Назад
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-teal-400 text-white py-3 rounded-lg hover:bg-teal-500 transition-colors text-center"
              >
                Завершити
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}