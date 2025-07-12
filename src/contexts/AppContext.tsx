import React, { createContext, useContext, useState, useEffect } from 'react';
import { Skill, SwapRequest, SkillMatch, CreditTransaction, Notification, User } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  skills: Skill[];
  swapRequests: SwapRequest[];
  skillMatches: SkillMatch[];
  creditTransactions: CreditTransaction[];
  notifications: Notification[];
  users: User[];
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  sendSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  addCreditTransaction: (transaction: Omit<CreditTransaction, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  findMatches: (userId: string) => SkillMatch[];
  updateUserCredits: (userId: string, amount: number) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React Development',
    description: 'Frontend development with React and TypeScript',
    type: 'offered',
    userId: '1',
    category: 'Programming',
    level: 'advanced',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'UI/UX Design',
    description: 'User interface and experience design using Figma',
    type: 'wanted',
    userId: '1',
    category: 'Design',
    level: 'intermediate',
    createdAt: '2024-01-22'
  }
];

const mockUsers: User[] = [
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    location: 'San Francisco, CA',
    availability: 'evenings',
    isPublic: true,
    credits: 12,
    joinDate: '2024-01-10',
    totalSwaps: 6,
    rating: 4.6,
    bio: 'Design enthusiast and React developer',
    profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    location: 'Los Angeles, CA',
    availability: 'weekends',
    isPublic: true,
    credits: 18,
    joinDate: '2024-01-05',
    totalSwaps: 12,
    rating: 4.9,
    bio: 'Full-stack developer passionate about teaching',
    profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    status: 'pending',
    message: 'Hi! I can teach you UI/UX design in exchange for React development lessons.',
    offeredSkillId: '3',
    wantedSkillId: '1',
    createdAt: '2024-01-25'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);
  const [skillMatches, setSkillMatches] = useState<SkillMatch[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addSkill = (skill: Omit<Skill, 'id' | 'createdAt'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(prev => prev.map(skill => 
      skill.id === id ? { ...skill, ...updates } : skill
    ));
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const sendSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setSwapRequests(prev => [...prev, newRequest]);
    
    // Add notification for receiver
    const notification: Notification = {
      id: Date.now().toString(),
      userId: request.receiverId,
      title: 'New Swap Request',
      message: 'You have received a new skill swap request!',
      type: 'request',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [...prev, notification]);
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev => prev.map(request => 
      request.id === id ? { ...request, ...updates } : request
    ));
    
    if (updates.status === 'completed' && updates.rating) {
      // Award credits and update user stats
      const request = swapRequests.find(r => r.id === id);
      if (request) {
        updateUserCredits(request.senderId, 1);
        updateUserCredits(request.receiverId, -1);
      }
    }
  };

  const addCreditTransaction = (transaction: Omit<CreditTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: CreditTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCreditTransactions(prev => [...prev, newTransaction]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const updateUserCredits = (userId: string, amount: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, credits: u.credits + amount } : u
    ));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
  };

  const findMatches = (userId: string): SkillMatch[] => {
    const userSkills = skills.filter(s => s.userId === userId);
    const offeredSkills = userSkills.filter(s => s.type === 'offered');
    const wantedSkills = userSkills.filter(s => s.type === 'wanted');
    
    const matches: SkillMatch[] = [];
    
    users.forEach(otherUser => {
      if (otherUser.id === userId || !otherUser.isPublic) return;
      
      const otherUserSkills = skills.filter(s => s.userId === otherUser.id);
      const otherOfferedSkills = otherUserSkills.filter(s => s.type === 'offered');
      const otherWantedSkills = otherUserSkills.filter(s => s.type === 'wanted');
      
      // Find mutual matches
      offeredSkills.forEach(myOffered => {
        otherWantedSkills.forEach(theirWanted => {
          wantedSkills.forEach(myWanted => {
            otherOfferedSkills.forEach(theirOffered => {
              const skillMatch = myOffered.name.toLowerCase().includes(theirWanted.name.toLowerCase()) ||
                               theirWanted.name.toLowerCase().includes(myOffered.name.toLowerCase());
              const reverseMatch = myWanted.name.toLowerCase().includes(theirOffered.name.toLowerCase()) ||
                                 theirOffered.name.toLowerCase().includes(myWanted.name.toLowerCase());
              
              if (skillMatch && reverseMatch) {
                let score = 50; // Base score for skill match
                const reasons: string[] = ['Mutual skill interest'];
                
                // Check availability overlap
                const currentUser = users.find(u => u.id === userId);
                if (currentUser && currentUser.availability === otherUser.availability) {
                  score += 20;
                  reasons.push('Matching availability');
                }
                
                // Check location proximity (simplified)
                if (currentUser && currentUser.location === otherUser.location) {
                  score += 10;
                  reasons.push('Same location');
                }
                
                matches.push({
                  id: `${myOffered.id}-${theirOffered.id}`,
                  userId: userId,
                  matchedUserId: otherUser.id,
                  score: score,
                  offeredSkill: myOffered,
                  wantedSkill: theirOffered,
                  reasons: reasons
                });
              }
            });
          });
        });
      });
    });
    
    return matches.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  useEffect(() => {
    if (user) {
      setSkillMatches(findMatches(user.id));
    }
  }, [user, skills, users]);

  return (
    <AppContext.Provider value={{
      skills,
      swapRequests,
      skillMatches,
      creditTransactions,
      notifications,
      users,
      addSkill,
      updateSkill,
      deleteSkill,
      sendSwapRequest,
      updateSwapRequest,
      addCreditTransaction,
      markNotificationAsRead,
      findMatches,
      updateUserCredits,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};