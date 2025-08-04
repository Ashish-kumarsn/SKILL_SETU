import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle } from 'rc-progress';
import { Star } from 'lucide-react';

const getBadge = (percent) => {
    if (percent === 100) return { label: 'Ace Achiever', quote: 'You nailed it! Perfect performance!' };
    if (percent >= 90) return { label: 'Brainiac', quote: 'Your intelligence shines through!' };
    if (percent >= 75) return { label: 'Bright Spark', quote: 'Great job! Almost there!' };
    if (percent >= 50) return { label: 'Rising Star', quote: 'Keep going! You are halfway there!' };
    return { label: 'Beginner', quote: 'Don’t give up. Every expert was once a beginner!' };
};

const QuizResultModal = ({
    isOpen,
    score,
    total,
    courseId,
    quizId,
    onGoToCourse,
}) => {
    const [percent, setPercent] = useState(0);
    const [selectedStars, setSelectedStars] = useState(0);
    const stars = Math.round((score / total) * 5);

    useEffect(() => {
        if (isOpen) {
            setPercent(Math.round((score / total) * 100));
        }
    }, [isOpen, score, total]);

    const { label, quote } = getBadge(percent);

    const handleReattempt = () => {
        window.location.href = `/course/${courseId}/quiz/${quizId}`;
    };

    const handleStarClick = (index) => {
        setSelectedStars(index + 1);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-3xl p-10 w-full max-w-lg text-center shadow-2xl border border-gray-200"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">🎉 Quiz Completed!</h2>

                        {/* Stars for Rating */}
                        <div className="flex justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => handleStarClick(i)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        fill={i < selectedStars ? '#facc15' : 'none'}
                                        color={i < selectedStars ? '#facc15' : '#d1d5db'}
                                        className="w-10 h-10 mx-1 transition-colors duration-200"
                                    />
                                </motion.button>
                            ))}
                        </div>
                        {selectedStars > 0 && (
                            <p className="text-sm text-green-600 mb-4 font-medium transition-all">
                                {[
                                    'We’re sorry to hear that! We’ll improve.',
                                    'Thanks! We’ll try to do better.',
                                    'Appreciate your feedback!',
                                    'Awesome! Glad you liked it!',
                                    'Thank you! You’re amazing!',
                                ][selectedStars - 1]}
                            </p>
                        )}

                        {/* Score and Radial Dial */}
                        <div className="flex items-center justify-around my-6">
                            <div className="text-left">
                                <p className="text-lg text-gray-600">Your Score</p>
                                <p className="text-2xl font-extrabold text-indigo-700">{score} / {total}</p>
                                <p className="mt-2 text-sm text-gray-500">Badge</p>
                                <p className="font-semibold text-base text-indigo-600">{label}</p>
                            </div>
                            <div className="relative w-28 h-28">
                                <Circle
                                    percent={percent}
                                    strokeWidth={8}
                                    strokeColor="#10b981"
                                    trailWidth={8}
                                    trailColor="#e5e7eb"
                                />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-gray-800">
                                    {percent}%
                                </div>
                            </div>
                        </div>

                        {/* Motivational Quote */}
                        <p className="italic text-gray-600 mb-6 px-4">“{quote}”</p>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleReattempt}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg shadow-sm"
                            >
                                🔁 Reattempt
                            </button>
                            <button
                                onClick={onGoToCourse}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm"
                            >
                                📘 Course Progress
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuizResultModal;