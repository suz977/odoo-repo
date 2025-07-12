import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Coins, 
  BookOpen, 
  MessageSquare,
  ChevronRight,
  Trophy,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { skills, swapRequests, skillMatches, notifications } = useApp();

  const userSkills = skills.filter(s => s.userId === user?.id);
  const offeredSkills = userSkills.filter(s => s.type === 'offered');
  const wantedSkills = userSkills.filter(s => s.type === 'wanted');
  const pendingRequests = swapRequests.filter(r => 
    (r.receiverId === user?.id || r.senderId === user?.id) && r.status === 'pending'
  );
  const topMatches = skillMatches.slice(0, 3);
  const recentNotifications = notifications.filter(n => n.userId === user?.id).slice(0, 3);

  const stats = [
    {
      label: 'Total Credits',
      value: user?.credits || 0,
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+2 this week',
      changeColor: 'text-green-600'
    },
    {
      label: 'Skills Offered',
      value: offeredSkills.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${offeredSkills.length > 0 ? '+' + offeredSkills.length : 'Add some'}`,
      changeColor: 'text-blue-600'
    },
    {
      label: 'Swap Rating',
      value: user?.rating ? user.rating.toFixed(1) : '0.0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: 'Based on ' + (user?.totalSwaps || 0) + ' swaps',
      changeColor: 'text-yellow-600'
    },
    {
      label: 'Pending Requests',
      value: pendingRequests.length,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: pendingRequests.length > 0 ? 'Needs attention' : 'All clear',
      changeColor: pendingRequests.length > 0 ? 'text-red-600' : 'text-green-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Here's what's happening with your skill exchanges</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.changeColor}`}>{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Matches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Top Skill Matches
            </h2>
            <button
              onClick={() => setCurrentPage('matches')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {topMatches.length > 0 ? (
            <div className="space-y-4">
              {topMatches.map((match, index) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Score: {match.score}</p>
                      <p className="text-sm text-gray-600">{match.reasons.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{match.offeredSkill.name}</p>
                    <p className="text-xs text-gray-500">↔ {match.wantedSkill.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
              <p className="text-gray-600 mb-4">Add some skills to find potential swap partners</p>
              <button
                onClick={() => setCurrentPage('skills')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Skills
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Recent Activity
            </h2>
            <button
              onClick={() => setCurrentPage('requests')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {recentNotifications.length > 0 ? (
            <div className="space-y-4">
              {recentNotifications.map(notification => (
                <div key={notification.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.isRead ? 'bg-gray-400' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Your recent notifications will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to start swapping skills?</h2>
        <p className="text-blue-100 mb-6">Connect with like-minded individuals and grow your skillset through meaningful exchanges.</p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentPage('skills')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Manage Skills
          </button>
          <button
            onClick={() => setCurrentPage('matches')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors duration-200"
          >
            Find Matches
          </button>
        </div>
      </div>
    </div>
  );
};