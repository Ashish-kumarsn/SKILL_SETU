import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuizByIdQuery } from '../../../../../features/api/courseApi';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import QuizResultModal from '../../../../../components/QuizResultModal';
import { ChevronDown, ChevronUp, Clock, ChevronLeft, ChevronRight, BookOpen, CheckCircle2, XCircle, Circle, Timer, Award, Menu, X, BarChart3 } from 'lucide-react';

const QuizView = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetQuizByIdQuery({ courseId, quizId });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUpModal, setTimeUpModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (data?.quiz?.timeLimit) {
      setTimeLeft(data.quiz.timeLimit * 60);
    }
  }, [data]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeUpModal(true);
    }
    if (!timeLeft || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (timeLeft > 0) {
        e.preventDefault();
        e.returnValue = 'You have an ongoing quiz. If you refresh, it may be submitted or lost!';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timeLeft]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error loading quiz</p>;

  const { quiz } = data;
  const totalQuestions = quiz.questions.length;

  const handleOptionSelect = (qIndex, optionIndex) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const isCorrect = (qIndex) => {
    const question = quiz.questions[qIndex];
    return answers[qIndex] === question.correctAnswer;
  };

  const getStatusColor = (index) => {
    if (answers[index] === undefined) return 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-200';
    return isCorrect(index) 
      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
      : 'bg-red-500 text-white border-red-500 shadow-sm';
  };

  const countStatus = () => {
    let correct = 0,
      incorrect = 0,
      unanswered = 0;
    quiz.questions.forEach((_, i) => {
      if (answers[i] === undefined) unanswered++;
      else if (isCorrect(i)) correct++;
      else incorrect++;
    });
    return { correct, incorrect, unanswered };
  };

  const { correct, incorrect, unanswered } = countStatus();

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getTimeColor = () => {
    const totalTime = (data?.quiz?.timeLimit || 30) * 60;
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 50) return 'text-emerald-600';
    if (percentage > 20) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleFinalSubmit = () => {
    setShowModal(false);
    setShowResultModal(true);
  };

  const handleAutoSubmit = () => {
    setTimeUpModal(false);
    setShowResultModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                  <p className="text-gray-500">Question {currentQuestion + 1} of {totalQuestions}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className={`flex items-center space-x-3 px-5 py-3 rounded-xl border-2 ${
                timeLeft > 300 ? 'border-emerald-200 bg-emerald-50' : 
                timeLeft > 60 ? 'border-amber-200 bg-amber-50' : 
                'border-red-200 bg-red-50'
              }`}>
                <Timer className={`w-5 h-5 ${getTimeColor()}`} />
                <span className={`font-mono text-lg font-bold ${getTimeColor()}`}>
                  {formatTime(timeLeft || 0)}
                </span>
              </div>
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${isSidebarOpen ? 'w-96' : 'w-0 overflow-hidden'} lg:w-96 transition-all duration-300 flex-shrink-0`}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-28">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <h2 className="text-lg font-bold text-gray-900">Progress Overview</h2>
                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>

                {/* Question Grid */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Questions</h3>
                  <div className="grid grid-cols-6 gap-3">
                    {quiz.questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestion(idx)}
                        className={`
                          w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 border-2
                          ${currentQuestion === idx 
                            ? 'ring-2 ring-blue-500 ring-offset-2 scale-110' 
                            : ''
                          }
                          ${getStatusColor(idx)}
                          hover:scale-105 hover:shadow-lg transform
                        `}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Statistics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-emerald-700">Correct</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">{correct}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-red-700">Incorrect</span>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{incorrect}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Circle className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-semibold text-gray-700">Unanswered</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-600">{unanswered}</span>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span className="font-medium">Overall Progress</span>
                      <span className="font-bold">{Math.round(((correct + incorrect) / totalQuestions) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
                        style={{ width: `${((correct + incorrect) / totalQuestions) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-10">
                <div className="mb-10">
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-blue-600">Q{currentQuestion + 1}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                        {quiz.questions[currentQuestion].question}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {quiz.questions[currentQuestion].options.map((option, idx) => {
                    const selected = answers[currentQuestion] !== undefined;
                    const isSelected = answers[currentQuestion] === idx;
                    const isAnswerCorrect = quiz.questions[currentQuestion].correctAnswer === idx;
                    const isWrongSelected = isSelected && !isAnswerCorrect;
                    const isRightSelected = isSelected && isAnswerCorrect;

                    return (
                      <label
                        key={idx}
                        className={`
                          group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform
                          ${selected 
                            ? isRightSelected 
                              ? 'border-emerald-200 bg-emerald-50 shadow-lg scale-[1.02]' 
                              : isWrongSelected 
                                ? 'border-red-200 bg-red-50 shadow-lg scale-[1.02]' 
                                : isAnswerCorrect
                                  ? 'border-emerald-200 bg-emerald-50 opacity-80'
                                  : 'opacity-40 border-gray-200 bg-gray-50'
                            : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02]'
                          }
                          ${!selected && 'hover:shadow-lg'}
                        `}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          className="hidden"
                          checked={isSelected}
                          onChange={() => handleOptionSelect(currentQuestion, idx)}
                          disabled={selected}
                        />
                        
                        <div className="flex items-center space-x-5">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                            ${selected 
                              ? isRightSelected || (isAnswerCorrect && !isSelected)
                                ? 'border-emerald-500 bg-emerald-500' 
                                : 'border-red-500 bg-red-500'
                              : 'border-gray-300 group-hover:border-blue-400'
                            }
                          `}>
                            {(isSelected || (selected && isAnswerCorrect)) && (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          
                          <span className={`
                            text-lg leading-relaxed font-medium
                            ${selected 
                              ? isRightSelected || (isAnswerCorrect && !isSelected)
                                ? 'text-emerald-700' 
                                : isWrongSelected
                                  ? 'text-red-700'
                                  : 'text-gray-500'
                              : 'text-gray-700 group-hover:text-gray-900'
                            }
                          `}>
                            {option}
                          </span>
                        </div>

                        {/* Feedback Icons */}
                        {selected && (
                          <div className="absolute top-6 right-6">
                            {isRightSelected || (isAnswerCorrect && !isSelected) ? (
                              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              </div>
                            ) : isWrongSelected ? (
                              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600" />
                              </div>
                            ) : null}
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-3 px-8 py-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-semibold text-lg">Previous</span>
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-500 mb-3 font-medium">Question Progress</div>
                <div className="flex space-x-2">
                  {[...Array(totalQuestions)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        idx === currentQuestion 
                          ? 'bg-blue-500 w-8' 
                          : idx < currentQuestion 
                            ? 'bg-blue-300 w-3' 
                            : 'bg-gray-200 w-3'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, totalQuestions - 1))}
                disabled={currentQuestion === totalQuestions - 1}
                className="flex items-center space-x-3 px-8 py-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg shadow-sm"
              >
                <span className="font-semibold text-lg">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center space-x-3 px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Award className="w-6 h-6" />
                <span>Submit Quiz</span>
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 w-full max-w-md transform transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto mb-8 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Submit Quiz?</h3>
              <p className="mb-10 text-gray-600 leading-relaxed text-lg">
                Are you sure you want to submit your answers? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Yes, Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-200 border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Up Modal */}
      {timeUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 w-full max-w-md text-center transform transition-all duration-300">
            <div className="mx-auto mb-8 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Time's Up!</h2>
            <p className="text-gray-600 mb-10 leading-relaxed text-lg">
              You gave it your best! Always try to complete in time. We're submitting your answers now.
            </p>
            <button
              onClick={handleAutoSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}

      <QuizResultModal
        isOpen={showResultModal}
        score={correct}
        total={totalQuestions}
        onReattempt={() => navigate(0)}
        courseId={courseId}
        quizId={quizId}
        onGoToCourse={() => navigate(`/course-progress/${courseId}`)}
      />
    </div>
  );
};

export default QuizView;