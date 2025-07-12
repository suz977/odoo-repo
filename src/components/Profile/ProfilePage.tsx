import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Clock, 
  Mail, 
  Calendar,
  Star,
  Trophy,
  Coins,
  Edit,
  Save,
  X,
  Camera,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    availability: user?.availability || 'flexible',
    bio: user?.bio || '',
    isPublic: user?.isPublic || true
  });

  const handleSave = () => {
    if (user) {
      updateUser(user.id, formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      location: user?.location || '',
      availability: user?.availability || 'flexible',
      bio: user?.bio || '',
      isPublic: user?.isPublic || true
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=128`}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors duration-200">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
                <p className="text-blue-100 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.credits}</p>
              <p className="text-sm text-gray-600">Credits</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.totalSwaps}</p>
              <p className="text-sm text-gray-600">Total Swaps</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.rating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.isPublic ? 'Public' : 'Private'}</p>
              <p className="text-sm text-gray-600">Profile</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-8 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {user.location}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                {isEditing ? (
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="mornings">Mornings</option>
                    <option value="evenings">Evenings</option>
                    <option value="weekends">Weekends</option>
                    <option value="flexible">Flexible</option>
                  </select>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {user.availability.charAt(0).toUpperCase() + user.availability.slice(1)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell others about yourself and your interests..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {user.bio || 'No bio provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Settings
              </label>
              <div className="bg-gray-50 px-3 py-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Public Profile</p>
                      <p className="text-sm text-gray-600">Allow others to find and match with you</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isPublic ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isPublic ? 'Public' : 'Private'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};