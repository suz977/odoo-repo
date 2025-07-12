import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Coins, 
  BarChart3,
  Plus,
  Minus,
  Edit,
  Trash2,
  Shield
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { User, Skill, SwapRequest } from '../../types';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { users, skills, swapRequests, updateUser, addCreditTransaction } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'skills' | 'requests' | 'credits'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState('');

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const handleCreditAdjustment = () => {
    if (!selectedUser || !creditAmount || !creditReason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    updateUser(selectedUser.id, { 
      credits: selectedUser.credits + creditAmount 
    });

    addCreditTransaction({
      userId: selectedUser.id,
      amount: creditAmount,
      type: 'admin_adjustment',
      description: creditReason.trim()
    });

    setSelectedUser(null);
    setCreditAmount(0);
    setCreditReason('');
    alert('Credit adjustment completed successfully!');
  };

  const totalCreditsInSystem = users.reduce((sum, u) => sum + u.credits, 0);
  const totalActiveUsers = users.filter(u => !u.isAdmin).length;
  const totalSkills = skills.length;
  const totalSwaps = swapRequests.length;

  const stats = [
    {
      label: 'Active Users',
      value: totalActiveUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Skills',
      value: totalSkills,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Swap Requests',
      value: totalSwaps,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Credits in System',
      value: totalCreditsInSystem,
      icon: Coins,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
    { id: 'credits', label: 'Credits', icon: Coins }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-blue-500" />
          Admin Panel
        </h1>
        <p className="mt-2 text-gray-600">Manage users, skills, and platform settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Swaps</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.filter(u => !u.isAdmin).map(userItem => (
                      <tr key={userItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={userItem.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.name)}&background=3B82F6&color=fff`}
                              alt={userItem.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                              <div className="text-sm text-gray-500">{userItem.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.credits}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.totalSwaps}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.rating.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedUser(userItem)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Adjust Credits
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => {
                  const skillUser = users.find(u => u.id === skill.userId);
                  return (
                    <div key={skill.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          skill.type === 'offered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {skill.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                      <p className="text-xs text-gray-500">By: {skillUser?.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Swap Requests</h3>
              <div className="space-y-4">
                {swapRequests.map(request => {
                  const sender = users.find(u => u.id === request.senderId);
                  const receiver = users.find(u => u.id === request.receiverId);
                  return (
                    <div key={request.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {sender?.name} → {receiver?.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          request.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'credits' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Management</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{totalCreditsInSystem}</p>
                    <p className="text-sm text-gray-600">Total Credits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {(totalCreditsInSystem / Math.max(totalActiveUsers, 1)).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Avg per User</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{swapRequests.filter(r => r.status === 'completed').length}</p>
                    <p className="text-sm text-gray-600">Completed Swaps</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit Adjustment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Adjust Credits for {selectedUser.name}
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Balance: {selectedUser.credits} credits</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Adjustment
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount (positive to add, negative to subtract)"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Reason for credit adjustment..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreditAdjustment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};