import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LessonPageProps {
  lesson: {
    id: string;
    title: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    demonstrations: Array<{
      word: string;
      gifUrl: string;
      description: string;
    }>;
  };
  onComplete: () => void;
  onStartQuiz: () => void;
}

export function LessonPage({ lesson, onComplete, onStartQuiz }: LessonPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = lesson.demonstrations.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentDemo = lesson.demonstrations[currentStep];

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
              <button
                onClick={onComplete}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center">
              {/* Progress Bar */}
              <div className="w-full max-w-md mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">{currentDemo.word}</h3>
              <div className="relative w-full max-w-lg aspect-square mb-6">
                <img
                  src={currentDemo.gifUrl}
                  alt={`Sign for ${currentDemo.word}`}
                  className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-600 text-center max-w-md mb-8">
                {currentDemo.description}
              </p>

              {/* Navigation */}
              <div className="flex justify-between w-full max-w-md">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center px-4 py-2 rounded-md ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
                {currentStep === totalSteps - 1 ? (
                  <button
                    onClick={onStartQuiz}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Start Quiz
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                  >
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}