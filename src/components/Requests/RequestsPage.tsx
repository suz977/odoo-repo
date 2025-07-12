import React, { useState } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  Send,
  User,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { SwapRequest } from '../../types';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { swapRequests, updateSwapRequest, users, skills } = useApp();
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'pending' | 'completed'>('all');
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  const userRequests = swapRequests.filter(request => 
    request.senderId === user?.id || request.receiverId === user?.id
  );

  const filteredRequests = userRequests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'sent') return request.senderId === user?.id;
    if (filter === 'received') return request.receiverId === user?.id;
    if (filter === 'pending') return request.status === 'pending';
    if (filter === 'completed') return request.status === 'completed';
    return true;
  });

  const handleAcceptRequest = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'accepted' });
  };

  const handleRejectRequest = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'rejected' });
  };

  const handleCompleteRequest = (request: SwapRequest) => {
    updateSwapRequest(request.id, {
      status: 'completed',
      feedback: feedback.trim(),
      rating: rating,
      completedAt: new Date().toISOString()
    });
    setSelectedRequest(null);
    setFeedback('');
    setRating(5);
  };

  const getOtherUser = (request: SwapRequest) => {
    const otherUserId = request.senderId === user?.id ? request.receiverId : request.senderId;
    return users.find(u => u.id === otherUserId);
  };

  const getSkillName = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    return skill?.name || 'Unknown Skill';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-8 h-8 mr-3 text-blue-500" />
          Swap Requests
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your incoming and outgoing skill swap requests
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-1 mb-4">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'received', label: 'Received' },
            { id: 'sent', label: 'Sent' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({userRequests.filter(r => {
                if (tab.id === 'all') return true;
                if (tab.id === 'sent') return r.senderId === user?.id;
                if (tab.id === 'received') return r.receiverId === user?.id;
                if (tab.id === 'pending') return r.status === 'pending';
                if (tab.id === 'completed') return r.status === 'completed';
                return true;
              }).length})
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-6">
          {filteredRequests.map(request => {
            const otherUser = getOtherUser(request);
            const isSender = request.senderId === user?.id;
            
            if (!otherUser) return null;

            return (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={otherUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=3B82F6&color=fff`}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isSender ? `Request to ${otherUser.name}` : `Request from ${otherUser.name}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()} • {new Date(request.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </div>
                </div>

                {/* Skill Exchange Details */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {isSender ? 'You Offer' : 'They Offer'}
                      </h4>
                      <p className="text-blue-700 font-medium">
                        {getSkillName(isSender ? request.offeredSkillId : request.wantedSkillId)}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
                    <div className="flex-1 text-right">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {isSender ? 'They Offer' : 'You Offer'}
                      </h4>
                      <p className="text-purple-700 font-medium">
                        {getSkillName(isSender ? request.wantedSkillId : request.offeredSkillId)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                  <p className="text-gray-700">{request.message}</p>
                </div>

                {/* Feedback (if completed) */}
                {request.status === 'completed' && request.feedback && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Feedback:</h4>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{request.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{request.feedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {request.status === 'pending' && !isSender && (
                    <>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </button>
                    </>
                  )}
                  
                  {request.status === 'accepted' && (
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Complete & Review
                    </button>
                  )}
                  
                  {request.status === 'pending' && isSender && (
                    <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg">
                      Waiting for response...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'You haven\'t sent or received any swap requests yet'
              : `No ${filter} requests found`
            }
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Find Matches
          </button>
        </div>
      )}

      {/* Complete Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Complete Skill Swap
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Skill swap with:</p>
              <p className="font-medium text-gray-900">{getOtherUser(selectedRequest)?.name}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate your experience (1-5 stars)
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Share your experience with this skill swap..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteRequest(selectedRequest)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};