import { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import logo from 'figma:asset/1c48c0d0410a0300d245194d4d6c84495a6138c4.png';

interface LoginScreenProps {
  onLogin: (email: string, showProfileSetup: boolean) => void;
}

interface FieldError {
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreement?: string;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [generalError, setGeneralError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    const errors: FieldError = {};

    // Валідація полів
    if (!email.trim()) {
      errors.email = 'Це поле не може бути порожнім';
    } else {
      // Перевірка формату email
      const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\.pp\.2025@lpnu\.ua$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Введіть дійсну адресу пошти у форматі: ім\'я.прізвище.pp.2025@lpnu.ua';
      }
    }

    if (!password.trim()) {
      errors.password = 'Це поле не може бути порожнім';
    } else if (password.length < 6) {
      errors.password = 'Пароль занадто короткий (мінімум 6 символів)';
    }

    if (isRegistering) {
      if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Це поле не може бути порожнім';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Паролі не співпадають';
      }
    }

    if (!agreed) {
      errors.agreement = 'Ви маєте погодитись з умовами';
    }

    // Якщо є помилки, показуємо їх
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Симуляція відповіді сервера
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      if (isRegistering) {
        // РЕЄСТРАЦІЯ через Email → завжди показати екран "Оберіть нікнейм"
        setRegistrationSuccess(true);
        setTimeout(() => {
          onLogin(email, true); // true = показати ProfileSetup
        }, 1500);
      } else {
        // ЛОГІН через Email → завжди пропустити налаштування
        onLogin(email, false); // false = пропустити ProfileSetup
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Перевірка чи користувач погодився
    if (!agreed) {
      setFieldErrors({ agreement: 'Підтвердіть, будь ласка, щоб продовжити' });
      return;
    }

    // Симуляція Google OAuth
    const names = ['Олександр', 'Марія', 'Іван', 'Анна', 'Максим', 'Софія'];
    const surnames = ['Коваленко', 'Шевченко', 'Бойко', 'Мельник', 'Петренко', 'Іваненко'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    const generatedEmail = `${randomName}.${randomSurname}.pp.2025@lpnu.ua`;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      if (isRegistering) {
        // РЕЄСТРАЦІЯ через Google → завжди показати екран "Оберіть нікнейм"
        onLogin(generatedEmail, true); // true = показати ProfileSetup
      } else {
        // ЛОГІН через Google → завжди пропустити налаштування
        onLogin(generatedEmail, false); // false = пропустити ProfileSetup
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ШО Logo" className="w-40 h-40 object-contain" />
          </div>
          <p className="text-gray-700 mb-2">Слава Ісусу Христу🙏</p>
          <p className="text-gray-600">
            Вас вітає <span className="text-violet-500">ШО</span> - Шикарне Оповіщення
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">Увійдіть через корпоративну пошту LPNU</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Електронна пошта"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.email 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-violet-200 focus:ring-violet-300'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введіть пароль"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-violet-200 focus:ring-violet-300'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.password}
              </div>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="block text-gray-700 mb-2">Підтвердження пароля</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Підтвердіть пароль"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-violet-200 focus:ring-violet-300'
                  }`}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-5 h-5 appearance-none border-2 border-violet-300 rounded checked:bg-violet-400 checked:border-violet-400 focus:ring-2 focus:ring-violet-300 cursor-pointer"
              />
              {agreed && (
                <svg
                  className="absolute w-5 h-5 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <label htmlFor="agreement" className="text-sm text-gray-700 cursor-pointer">
              Слава Навіки Богу🙌🕊️
            </label>
          </div>

          {fieldErrors.agreement && (
            <div className="text-red-500 text-sm mt-1">
              {fieldErrors.agreement}
            </div>
          )}

          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Реєстрація успішна!
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-400 text-white py-3 rounded-lg hover:bg-violet-500 transition-colors text-center flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isRegistering ? 'Зареєструватися' : 'Увійти'}
          </button>

          {/* Toggle between login and register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFieldErrors({});
                setGeneralError('');
                setConfirmPassword('');
                setRegistrationSuccess(false);
              }}
              className="text-sm text-violet-600 hover:text-violet-700 transition-colors"
            >
              {isRegistering ? (
                <>Вже є акаунт? <span className="underline">Увійти</span></>
              ) : (
                <>Ще не з нами? <span className="underline">Приєднатися</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}