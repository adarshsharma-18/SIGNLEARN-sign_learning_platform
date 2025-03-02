import React, { useState } from 'react';
import { Lesson } from '../../types';

interface LessonQuizProps {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export function LessonQuiz({ lesson, onComplete, onClose }: LessonQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = React.useMemo(() => {
    return lesson.demonstrations.map((demo, index) => {
      // Use index to determine question type to ensure consistency
      const questionType = index % 3;
      const baseQuestion = {
        word: demo.word,
        gifUrl: `/src/assets/gifs/${lesson.category.toLowerCase()}/${demo.word.toLowerCase().replace(/\s+/g, '-')}.gif`,
        options: [
          demo.word,
          ...lesson.demonstrations
            .filter((d) => d.word !== demo.word)
            .map((d) => d.word)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3),
        ].sort(() => Math.random() - 0.5),
      };

      if (questionType === 0) {
        return {
          ...baseQuestion,
          type: 'fill-in-blank',
          prompt: `Type the sign word shown in the GIF: _ _ _ _ _`,
        };
      } else if (questionType === 1) {
        return {
          ...baseQuestion,
          type: 'gif-to-word',
        };
      } else {
        return {
          ...baseQuestion,
          type: 'word-to-gif',
        };
      }
    });
  }, [lesson]); // Only regenerate when lesson changes

  const [feedback, setFeedback] = useState({
    emoji: '',
    comment: '',
  });

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].word;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      onComplete(score);
    }
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quiz Complete!</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <p className="text-lg mb-4">
              Your score: {score} out of {questions.length}
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">How was your experience?</h3>
              <div className="flex justify-center space-x-4 mb-4">
                {['😞', '😐', '🙂', '😊', '🤩'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setFeedback({ ...feedback, emoji })}
                    className={`text-2xl p-2 rounded-full ${feedback.emoji === emoji ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Any additional feedback? (optional)"
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Quiz</h2>
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <span className="text-gray-500">
                Score: {score}/{questions.length}
              </span>
            </div>

            {currentQ.type === 'fill-in-blank' ? (
              <>
                <p className="mb-4">{currentQ.prompt}</p>
                <div className="relative pb-[60%] mb-6">
                  <img
                    src={currentQ.gifUrl}
                    alt="Sign to identify"
                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Type your answer"
                  className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedAnswer || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              </>
            ) : currentQ.type === 'gif-to-word' ? (
              <>
                <p className="mb-4">What sign is being shown in this GIF?</p>
                <div className="relative pb-[60%] mb-6">
                  <img
                    src={currentQ.gifUrl}
                    alt="Sign to identify"
                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="mb-4">Choose the correct GIF for: "{currentQ.word}"</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentQ.options.map((option) => (
                    <div
                      key={option}
                      className={`relative pb-[100%] cursor-pointer rounded-lg overflow-hidden border-2 ${
                        selectedAnswer === option
                          ? 'border-indigo-600'
                          : 'border-transparent'
                      }`}
                      onClick={() => handleAnswer(option)}
                    >
                      <img
                        src={`/src/assets/gifs/${lesson.category.toLowerCase()}/${option
                          .toLowerCase()
                          .replace(/\s+/g, '-')}.gif`}
                        alt={`Sign for ${option}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </>

            )}

            <div className="space-y-3">
              {currentQ.type === 'gif-to-word' &&
                currentQ.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-3 text-left rounded-lg ${
                      selectedAnswer === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Quit
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`px-4 py-2 rounded ${
                selectedAnswer
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}