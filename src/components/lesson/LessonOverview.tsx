import React, { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Search, MessageSquare, BookOpen, Play, Award } from 'lucide-react';
import { Lesson } from '../../types';

interface LessonOverviewProps {
  lesson: Lesson;
  onStartLesson: () => void;
  onBack: () => void;
  onStartQuiz?: () => void;
  onPlayTopic?: (topicIndex: number) => void;
}

export function LessonOverview({ lesson, onStartLesson, onBack, onStartQuiz, onPlayTopic }: LessonOverviewProps) {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePlayTopic = (index: number) => {
    setSelectedTopic(index);
    if (onPlayTopic) {
      onPlayTopic(index);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header with back button */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Greet people and ask them how they are doing.
            </p>
          </div>

          {/* Lesson content */}
          <div className="px-4 py-5 sm:p-6">
            {/* Lesson 1 - Hello and welcome */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="bg-amber-100 rounded-lg p-4 mb-6 flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="bg-white text-amber-600 font-semibold px-2 py-1 rounded text-xs mr-2">
                      LESSON 1
                    </div>
                    <h3 className="text-lg font-semibold">Hello and welcome</h3>
                  </div>
                  <p className="text-sm mt-1">Greet people and ask them how they are doing.</p>
                </div>
                <div className="bg-green-500 rounded-full p-2">
                  <Check className="h-5 w-5 text-white" />
                </div>
              </div>

              {lesson.demonstrations.map((demo, index) => {
                // Determine which icon to use based on the index
                let Icon = Search;
                let bgColor = "bg-indigo-100";
                let textColor = "text-indigo-600";
                
                if (index === 1) {
                  Icon = MessageSquare;
                  bgColor = "bg-orange-100";
                  textColor = "text-orange-500";
                } else if (index === 2) {
                  Icon = BookOpen;
                  bgColor = "bg-pink-100";
                  textColor = "text-pink-500";
                }
                
                // Determine if this topic is completed
                const isCompleted = lesson.completed;
                
                return (
                  <div key={index} className="flex items-center mb-4">
                    <div className={`${bgColor} rounded-full p-4 mr-4`}>
                      <Icon className={`h-6 w-6 ${textColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{demo.word}</h4>
                      <p className="text-sm text-gray-500">{index === 0 ? "Discover new vocabulary" : index === 1 ? "Practice a dialogue" : "Learn new signs"}</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <button
                        onClick={() => handlePlayTopic(index)}
                        className={`rounded-full ${isCompleted ? "bg-green-500" : "bg-gray-400"} p-2 cursor-pointer transition-colors hover:opacity-90`}
                        aria-label={`Go to ${demo.word}`}
                      >
                        <Check className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="bg-indigo-100 rounded-lg p-4 mb-6 flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="bg-white text-indigo-600 font-semibold px-2 py-1 rounded text-xs mr-2">
                      QUIZ
                    </div>
                    <h3 className="text-lg font-semibold">Test your knowledge</h3>
                  </div>
                  <p className="text-sm mt-1">Take a quiz to test what you've learned in this lesson.</p>
                </div>
                <div className="bg-indigo-500 rounded-full p-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <button
                onClick={onStartQuiz}
                className="w-full py-3 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Start Quiz
              </button>
            </div>
            
            {/* Continue learning button */}
            <div className="mt-8">
              <button
                onClick={onStartLesson}
                className="w-full py-3 px-4 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center"
              >
                Continue learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}