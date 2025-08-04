import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import FeedbackModal from "./FeedbackModal";

const FeedbackButton = ({ courseId }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="group fixed bottom-8 right-8 z-50">
                {/* Tooltip */}
                <div className="absolute right-16 bottom-3 hidden group-hover:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg animate-fade-in-up">
                    Feedback
                    <svg
                        className="absolute -right-1.5 bottom-2 text-white dark:text-gray-900"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="currentColor"
                    >
                        <rect width="10" height="10" transform="rotate(45 5 5)" />
                    </svg>
                </div>

                {/* Floating Feedback Button */}
                <button
                    onClick={() => setShowModal(true)}
                    title="Give Feedback"
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl border-2 border-white dark:border-gray-800 transition-all duration-300"
                >
                    <FaCommentDots size={22} />
                </button>
            </div>



            {showModal && (
                <FeedbackModal
                    courseId={courseId}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default FeedbackButton;
