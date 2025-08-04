import { useState } from "react";
import { useRateCourseMutation } from "@/features/api/courseApi";
import ReactStars from "react-rating-stars-component";
import { toast } from "sonner";

const FeedbackModal = ({ courseId, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [rateCourse] = useRateCourseMutation();

    const handleSubmit = async () => {
        try {
            if (!rating) {
                toast.warning("Please provide a star rating.");
                return;
            }

            await rateCourse({ courseId, rating, comment }).unwrap();

            toast.success(" Feedback submitted successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            toast.error("❌ Failed to submit feedback. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded-t-2xl sm:rounded-lg shadow-lg animate-slide-up">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Give Feedback</h2>

                <ReactStars
                    count={5}
                    size={30}
                    value={rating}
                    onChange={(newRating) => setRating(newRating)}
                    activeColor="#ffd700"
                />

                <textarea
                    rows="4"
                    className="mt-4 w-full border border-gray-300 rounded p-2 text-sm text-black"
                    placeholder="Write your review here (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex justify-end mt-4 gap-2">
                    <button
                        onClick={onClose}
                        className="text-gray-600 text-sm hover:underline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
