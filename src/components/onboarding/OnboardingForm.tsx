import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { User } from '../../types';

export function OnboardingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    learningGoal: 'regular' as const,
    signLanguage: 'ASL' as const,
    dailyGoal: 30,
  });

  const handleSubmit = () => {
    const user = storage.getUser();
    if (user) {
      const updatedUser: User = {
        ...user,
        preferences,
      };
      storage.setUser(updatedUser);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Personalize Your Learning</h2>
          <div className="mt-4 flex justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  step === i ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Choose your sign language</h3>
            <div className="space-y-4">
              {['ASL', 'BSL'].map((lang) => (
                <button
                  key={lang}
                  className={`w-full p-4 rounded-lg border-2 ${
                    preferences.signLanguage === lang
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setPreferences({ ...preferences, signLanguage: lang as 'ASL' | 'BSL' })}
                >
                  {lang === 'ASL' ? 'American Sign Language' : 'British Sign Language'}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">What's your learning goal?</h3>
            <div className="space-y-4">
              {[
                { value: 'casual', label: 'Casual (15 min/day)' },
                { value: 'regular', label: 'Regular (30 min/day)' },
                { value: 'intensive', label: 'Intensive (60 min/day)' },
              ].map((goal) => (
                <button
                  key={goal.value}
                  className={`w-full p-4 rounded-lg border-2 ${
                    preferences.learningGoal === goal.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      learningGoal: goal.value as 'casual' | 'regular' | 'intensive',
                      dailyGoal: goal.value === 'casual' ? 15 : goal.value === 'regular' ? 30 : 60,
                    })
                  }
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Ready to start!</h3>
            <p className="text-gray-600">
              You've chosen to learn {preferences.signLanguage} with a {preferences.learningGoal} pace
              ({preferences.dailyGoal} minutes per day).
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            className="ml-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {step === 3 ? 'Start Learning' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}