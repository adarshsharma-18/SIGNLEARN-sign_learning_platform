import React, { useState } from 'react';
import { storage } from '../../utils/storage';
import { User } from '../../types';

interface FirstTimePopupProps {
  onClose: () => void;
  userId: string;
}

interface UserPreferences {
  learningGoal: 'casual' | 'regular' | 'intensive';
  signLanguage: 'ASL' | 'BSL';
  dailyGoal: number;
}

export function FirstTimePopup({ onClose, userId }: FirstTimePopupProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    learningGoal: 'regular',
    signLanguage: 'ASL',
    dailyGoal: 15
  });

  const handleSave = () => {
    const user = storage.getUser() as User;
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };
    storage.setUser(updatedUser);
    localStorage.setItem(`first_time_login_${userId}`, 'completed');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Welcome to SignLearn!</h2>
        <p className="text-gray-600 mb-8">
          Let's personalize your learning experience. Please select your preferences below.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Goal
            </label>
            <select
              value={preferences.learningGoal}
              onChange={(e) => setPreferences({
                ...preferences,
                learningGoal: e.target.value as UserPreferences['learningGoal'],
                dailyGoal: e.target.value === 'casual' ? 10 : e.target.value === 'regular' ? 15 : 20
              })}
              className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="casual">Casual (10 minutes/day)</option>
              <option value="regular">Regular (15 minutes/day)</option>
              <option value="intensive">Intensive (20 minutes/day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sign Language
            </label>
            <select
              value={preferences.signLanguage}
              onChange={(e) => setPreferences({
                ...preferences,
                signLanguage: e.target.value as UserPreferences['signLanguage']
              })}
              className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ASL">American Sign Language (ASL)</option>
              <option value="BSL">British Sign Language (BSL)</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}