export enum AppCategory {
  GAMES = 'Games',
  PRODUCTIVITY = 'Productivity',
  SOCIAL = 'Social',
  UTILITY = 'Utility',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health & Fitness',
  EDUCATION = 'Education'
}

export type UserRole = 'USER' | 'DEVELOPER';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppItem {
  id:string;
  name: string;
  developer: string;
  developerId: string;
  category: AppCategory;
  iconUrl: string;
  screenshots: string[];
  description: string;
  price: number; // 0 for free
  rating: number;
  downloads: string;
  size: string;
  version: string;
  fileUrl?: string; // Blob URL for the actual file
  fileName?: string;
  reviews: Review[];
}

export type ViewState = 'HOME' | 'DETAILS' | 'PUBLISH' | 'SEARCH_RESULTS' | 'AUTH' | 'PROFILE';