export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  availability: 'mornings' | 'evenings' | 'weekends' | 'flexible';
  isPublic: boolean;
  profilePhoto?: string;
  credits: number;
  joinDate: string;
  totalSwaps: number;
  rating: number;
  bio?: string;
  isAdmin?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'offered' | 'wanted';
  userId: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  offeredSkillId: string;
  wantedSkillId: string;
  createdAt: string;
  feedback?: string;
  rating?: number;
  completedAt?: string;
}

export interface SkillMatch {
  id: string;
  userId: string;
  matchedUserId: string;
  score: number;
  offeredSkill: Skill;
  wantedSkill: Skill;
  reasons: string[];
  distance?: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'admin_adjustment';
  description: string;
  swapRequestId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'request' | 'credit' | 'feedback';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}