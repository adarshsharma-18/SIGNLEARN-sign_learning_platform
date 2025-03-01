import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Calendar,
  LogOut,
  BookOpen,
  Activity,
  Settings,
  Flame,
  HandMetal,
} from 'lucide-react';
import { FirstTimePopup } from '../onboarding/FirstTimePopup';
import { storage } from '../../utils/storage';
import { User } from '../../types';
import { LessonQuiz } from '../lesson/LessonQuiz';
import { LessonPage } from '../lesson/LessonPage';
import { LessonOverview } from '../lesson/LessonOverview';

const mockLessons = [
  {
    id: '1',
    title: 'Basic Greetings',
    category: 'basic-greetings',
    difficulty: 'beginner' as const,
    duration: 15,
    completed: false,
    demonstrations: [
      {
        word: 'Hello',
        gifUrl: '/src/assets/gifs/basic-greetings/hello.gif',
        description: 'Wave your open hand side to side near your face'
      },
      {
        word: 'Thank You',
        gifUrl: '/src/assets/gifs/basic-greetings/thank-you.gif',
        description: 'Touch your chin with your fingertips, then move your hand forward'
      },
      {
        word: 'Please',
        gifUrl: '/src/assets/gifs/basic-greetings/please.gif',
        description: 'Rub your palm in a circular motion on your chest'
      }
    ]
  },
  {
    id: '2',
    title: 'Numbers 1-10',
    category: 'numbers',
    difficulty: 'beginner' as const,
    duration: 20,
    completed: false,
    demonstrations: [
      {
        word: 'One',
        gifUrl: '/src/assets/gifs/numbers/one.gif',
        description: 'Hold up your index finger'
      },
      {
        word: 'Five',
        gifUrl: '/src/assets/gifs/numbers/five.gif',
        description: 'Show all five fingers spread apart'
      },
      {
        word: 'Ten',
        gifUrl: '/src/assets/gifs/numbers/ten.gif',
        description: 'Show both hands with all fingers spread'
      }
    ]
  },
  {
    id: '3',
    title: 'Common Phrases',
    category: 'common-phrases',
    difficulty: 'beginner' as const,
    duration: 25,
    completed: false,
    demonstrations: [
      {
        word: 'Good Morning',
        gifUrl: '/src/assets/gifs/common-phrases/good-morning.gif',
        description: 'Sign "good" then "morning"'
      },
      {
        word: 'How are you',
        gifUrl: '/src/assets/gifs/common-phrases/how-are-you.gif',
        description: 'Point to the person, then make the "how" sign'
      },
      {
        word: 'Nice to meet you',
        gifUrl: '/src/assets/gifs/common-phrases/nice-to-meet-you.gif',
        description: 'Sign "nice" followed by "meet" and point to the person'
      }
    ]
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const user = storage.getUser() as User;
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<typeof mockLessons[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLessonOverview, setShowLessonOverview] = useState(false);
  const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);

  useEffect(() => {
    // Check if this is the user's first time logging in
    const hasCompletedFirstTimeLogin = localStorage.getItem(`first_time_login_${user.id}`);
    if (!hasCompletedFirstTimeLogin) {
      setShowFirstTimePopup(true);
    }
  }, [user.id]);

  const handleLogout = () => {
    storage.clearAll();
    window.location.href = '/login';
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const startLesson = (lesson: typeof mockLessons[0]) => {
    setActiveLesson(lesson);
    setShowLessonOverview(true);
  };

  const handleQuizComplete = (score: number) => {
    if (activeLesson) {
      const updatedUser = {
        ...user,
        progress: {
          ...user.progress,
          completedLessons: user.progress.completedLessons + 1,
          lastPracticeDate: new Date().toISOString(),
        },
      };
      storage.setUser(updatedUser);
      
      // Update the lesson status
      const lessonIndex = mockLessons.findIndex(l => l.id === activeLesson.id);
      if (lessonIndex !== -1) {
        mockLessons[lessonIndex].completed = true;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <HandMetal className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">SignLearn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 text-gray-600" /> 
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Daily Streak</p>
                <p className="text-2xl font-semibold">{user.progress.streak} days</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Lessons Completed</p>
                <p className="text-2xl font-semibold">{user.progress.completedLessons}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Daily Goal</p>
                <p className="text-2xl font-semibold">{user.preferences.dailyGoal} min</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="text-2xl font-semibold">Beginner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Today's Lessons</h2>
          <div className="grid grid-cols-1 gap-6">
            {mockLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{lesson.title}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>Category: {lesson.category}</p>
                      <p>Duration: {lesson.duration} minutes</p>
                    </div>
                  </div>
                  {lesson.completed && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Completed
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${lesson.completed ? 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{lesson.completed ? 'Completed' : 'Not started'}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => startLesson(lesson)}
                    className={`py-2 px-4 rounded ${lesson.completed ? 'bg-gray-100 text-gray-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
                  </button>
                </div>

                {/* Sign Language Demonstrations */}
                {expandedLesson === lesson.id && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lesson.demonstrations.map((demo, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">{demo.word}</h4>
                        <div className="relative pb-[100%]">
                          <img
                            src={demo.gifUrl}
                            alt={`Sign for ${demo.word}`}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{demo.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lesson Overview */}
      {activeLesson && showLessonOverview && !showQuiz && (
        <LessonOverview
          lesson={activeLesson}
          onStartLesson={() => {
            setShowLessonOverview(false);
          }}
          onBack={() => {
            setShowLessonOverview(false);
            setActiveLesson(null);
          }}
          onStartQuiz={() => setShowQuiz(true)}
          onPlayTopic={(topicIndex) => {
            setCurrentStep(topicIndex);
            setShowLessonOverview(false);
          }}
        />
      )}

      {/* Lesson Page */}
      {activeLesson && !showLessonOverview && !showQuiz && (
        <LessonPage
          lesson={activeLesson}
          onComplete={() => setShowLessonOverview(true)}
          onStartQuiz={() => setShowQuiz(true)}
        />
      )}

      {/* First Time Popup */}
      {showFirstTimePopup && (
        <FirstTimePopup
          onClose={() => setShowFirstTimePopup(false)}
          userId={user.id}
        />
      )}

      {/* Quiz Modal */}
      {activeLesson && showQuiz && (
        <LessonQuiz
          lesson={activeLesson}
          onComplete={(score) => {
            handleQuizComplete(score);
            setShowQuiz(false);
            setActiveLesson(null);
          }}
          onClose={() => {
            setShowQuiz(false);
            setActiveLesson(null);
          }}
        />
      )}
    </div>
  );
}