export const DEFAULT_BACKGROUNDS = [
  {
    id: 'gradient-1',
    name: 'Лавандовий градієнт',
    light: 'linear-gradient(135deg, #f5f3ff 0%, #e9d5ff 100%)',
    dark: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%)'
  },
  {
    id: 'gradient-2',
    name: 'М\'ятний градієнт',
    light: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
    dark: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
  },
  {
    id: 'gradient-3',
    name: 'Персиковий градієнт',
    light: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    dark: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)'
  },
  {
    id: 'gradient-4',
    name: 'Блакитний градієнт',
    light: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    dark: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
  },
  {
    id: 'gradient-5',
    name: 'Рожевий градієнт',
    light: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    dark: 'linear-gradient(135deg, #831843 0%, #9f1239 100%)'
  },
  {
    id: 'solid-white',
    name: 'Білий/Сірий',
    light: '#ffffff',
    dark: '#1f2937'
  }
];

export function getBackgroundForTheme(
  backgroundId: string | undefined,
  customBackground: string | undefined,
  theme: 'light' | 'dark'
): string {
  // Якщо є кастомний фон (URL), використовувати його
  if (customBackground && customBackground.startsWith('url(')) {
    return customBackground;
  }

  // Якщо є ID градієнта, знайти його і повернути відповідну версію
  if (backgroundId) {
    const bg = DEFAULT_BACKGROUNDS.find(b => b.id === backgroundId);
    if (bg) {
      return bg[theme];
    }
  }

  // Дефолтний фон
  return theme === 'dark' ? '#1f2937' : '#ffffff';
}
