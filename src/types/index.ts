export interface User {
  email: string;
  nickname: string;
  avatar: string;
  subgroup: 1 | 2;
  groupName: string; // наприклад, "ПП-15"
  currentWeekType: 'numerator' | 'denominator'; // поточний тиждень
  lastWeekChange: string; // дата останньої зміни тижня
  theme: 'light' | 'dark'; // тема інтерфейсу
  customBackground?: string; // URL кастомного фону або ID градієнта
  backgroundId?: string; // ID вибраного preset-градієнта
  gender: 'male' | 'female'; // стать користувача
}

export interface Homework {
  id: string;
  subject: string;
  description: string;
  deadline: string;
  completed: boolean; // Keep for backward compatibility
  completedBy?: string[]; // Array of user nicknames who completed this
  subgroup?: 1 | 2 | null;
  addedBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface ScheduleClass {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'lecture' | 'practice' | 'lab';
  subgroup: 1 | 2 | null;
  weekType: 'numerator' | 'denominator';
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}