import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  MapPin, 
  Clock, 
  Send, 
  Filter,
  Trophy,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { SkillMatch } from '../../types';

export const MatchesPage: React.FC = () => {
  const { user } = useAuth();
  const { skillMatches, users, skills, sendSwapRequest } = useApp();
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [minScore, setMinScore] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<SkillMatch | null>(null);
  const [message, setMessage] = useState('');
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const filteredMatches = skillMatches
    .filter(match => match.score >= minScore)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return new Date(b.offeredSkill.createdAt).getTime() - new Date(a.offeredSkill.createdAt).getTime();
    });

  const toggleExpanded = (matchId: string) => {
    setExpandedCards(prev => 
      prev.includes(matchId) 
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handleSendRequest = (match: SkillMatch) => {
    if (!message.trim()) {
      alert('Please enter a message for your swap request');
      return;
    }

    sendSwapRequest({
      receiverId: match.matchedUserId,
      message: message.trim(),
      offeredSkillId: match.offeredSkill.id,
      wantedSkillId: match.wantedSkill.id
    });

    setSelectedMatch(null);
    setMessage('');
    alert('Swap request sent successfully!');
  };

  const getMatchUser = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
          Skill Matches
        </h1>
        <p className="mt-2 text-gray-600">
          AI-powered recommendations based on your skills and preferences
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-4 flex-1">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'recent')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">Match Score</option>
                <option value="recent">Recent</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Min Score:</label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>All Matches</option>
                <option value={50}>50+ Points</option>
                <option value={70}>70+ Points</option>
                <option value={80}>80+ Points</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredMatches.length} matches found
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-6">
          {filteredMatches.map(match => {
            const matchedUser = getMatchUser(match.matchedUserId);
            const isExpanded = expandedCards.includes(match.id);
            
            if (!matchedUser) return null;

            return (
              <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={matchedUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(matchedUser.name)}&background=3B82F6&color=fff`}
                        alt={matchedUser.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{matchedUser.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {matchedUser.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {matchedUser.availability}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {matchedUser.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(match.score)}`}>
                        <Trophy className="w-4 h-4 mr-1" />
                        {match.score} points
                      </div>
                    </div>
                  </div>

                  {/* Skill Exchange Preview */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">You Offer</h4>
                        <p className="text-blue-700 font-medium">{match.offeredSkill.name}</p>
                        <p className="text-sm text-gray-600">{match.offeredSkill.description}</p>
                      </div>
                      <div className="mx-4">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xl">↔</span>
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="font-medium text-gray-900 mb-1">They Offer</h4>
                        <p className="text-purple-700 font-medium">{match.wantedSkill.name}</p>
                        <p className="text-sm text-gray-600">{match.wantedSkill.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.reasons.map((reason, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Section */}
                  <div className="border-t pt-4">
                    <button
                      onClick={() => toggleExpanded(match.id)}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-3"
                    >
                      <span className="mr-2">
                        {isExpanded ? 'Hide details' : 'Show more details'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">About {matchedUser.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{matchedUser.bio || 'No bio available'}</p>
                            <div className="text-sm text-gray-500">
                              <p>Total swaps: {matchedUser.totalSwaps}</p>
                              <p>Member since: {new Date(matchedUser.joinDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Match Analysis</h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Skill compatibility: High</p>
                              <p>Experience level: {match.wantedSkill.level}</p>
                              <p>Category: {match.wantedSkill.category}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Swap Request
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600 mb-6">
            {minScore > 0 
              ? 'Try lowering the minimum score filter to see more matches'
              : 'Add more skills to improve your matching opportunities'
            }
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Manage Skills
          </button>
        </div>
      )}

      {/* Send Request Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Send Swap Request
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Requesting swap with:</p>
              <p className="font-medium text-gray-900">{getMatchUser(selectedMatch.matchedUserId)?.name}</p>
              <p className="text-sm text-gray-600 mt-2">
                Your {selectedMatch.offeredSkill.name} ↔ Their {selectedMatch.wantedSkill.name}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Introduce yourself and explain what you'd like to learn and teach..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedMatch(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendRequest(selectedMatch)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};