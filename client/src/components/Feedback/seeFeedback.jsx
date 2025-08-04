import React, { useState } from "react";
import { Trash, Star, Users, TrendingUp,StarHalf, StarOff  } from "lucide-react";
// import {  } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDeleteReviewMutation } from "@/features/api/courseApi";
import { toast } from "sonner";
import { useGetCourseReviewsQuery } from "@/features/api/courseApi";

const FeedbackModal = ({ open, onClose, courseId }) => {
    const [filter, setFilter] = useState("all");

    const { data, isLoading, refetch } = useGetCourseReviewsQuery(courseId);
    const [deleteReview] = useDeleteReviewMutation();

    const reviews = data?.reviews || [];

    const filterReviews = (r) => {
        if (filter === "all") return true;
        return r.rating === parseInt(filter);
    };

    const total = reviews?.length || 0;

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews?.filter((r) => r.rating === star).length || 0,
    }));

    const averageRating =
        total === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

    const handleDelete = async (reviewId) => {
        try {
            const res = await deleteReview({ courseId, reviewId });
            if (res?.data?.message) {
                await refetch(); // 🔁 refetch reviews after delete
                toast.success(res.data.message);
            } else {
                toast.error("Failed to delete review");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const getRatingColor = (rating) => {
        switch(rating) {
            case 5: return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400";
            case 4: return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
            case 3: return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
            case 2: return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
            case 1: return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
            default: return "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
        }
    };

const getStarIcon = (rating) => {
  switch (rating) {
    case 5:
      return <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
    case 4:
      return <Star className="w-4 h-4 text-green-400 fill-green-400" />;
    case 3:
      return <Star className="w-4 h-4 text-blue-400 fill-blue-400" />;
    case 2:
      return <Star className="w-4 h-4 text-orange-400 fill-orange-400" />;
    case 1:
      return <Star className="w-4 h-4 text-red-400 fill-red-400" />;
    default:
      return <StarOff className="w-4 h-4 text-gray-400" />;
  }
};

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white border-0 shadow-2xl overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <div className="text-center space-y-2">
                        
                        <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Course Feedback Overview
                        </DialogTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                            Insights from your students
                        </p>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading reviews...</p>
                        </div>
                    ) : (
                        <>
                            {/* Enhanced Summary Block */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 sm:p-6 mb-4 border border-blue-100 dark:border-blue-800 flex-shrink-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Overall Rating</span>
                                        </div>
                                        <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                                            {averageRating.toFixed(1)}
                                        </div>
                                        <div className="flex justify-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</span>
                                        </div>
                                        <div className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {total}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Student responses
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Rating Distribution</div>
                                        {ratingCounts.map(({ star, count }) => (
                                            <div key={star} className="flex items-center gap-2 sm:gap-3">
                                                <span className="text-xs sm:text-sm font-medium w-6 sm:w-8">{star}★</span>
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                                                    />
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-6 sm:w-8">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Enhanced Filter Buttons */}
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <Button
                                        size="sm"
                                        variant={filter === "all" ? "default" : "outline"}
                                        onClick={() => setFilter("all")}
                                        className="transition-all duration-200 text-xs sm:text-sm"
                                    >
                                        <span className="mr-1 sm:mr-2">📊</span>
                                        All Reviews
                                    </Button>
                                    {[5, 4, 3, 2, 1].map((s) => (
                                        <Button
                                            key={s}
                                            size="sm"
                                            variant={filter == s ? "default" : "outline"}
                                            onClick={() => setFilter(s)}
                                            className="transition-all duration-200 text-xs sm:text-sm"
                                        >
                                            <span className="mr-1">{getStarIcon(s)}</span>
                                            {s} Star
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Reviews Section */}
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="space-y-3 sm:space-y-4 pr-2 pb-4">
                                        {reviews.filter(filterReviews).map((r) => (
                                            <div
                                                key={r._id}
                                                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:transform hover:-translate-y-1"
                                            >
                                                <div className="flex justify-between items-start gap-3 sm:gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                            <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getRatingColor(r.rating)}`}>
                                                                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                                                                {r.rating}.0
                                                            </div>
                                                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                                            <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                                                {r.user?.name || "Anonymous"}
                                                            </span>
                                                        </div>
                                                        <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                                                            "{r.comment}"
                                                        </blockquote>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDelete(r._id)}
                                                        title="Delete review"
                                                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-gray-400 flex-shrink-0"
                                                    >
                                                        <Trash size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {reviews.filter(filterReviews).length === 0 && (
                                            <div className="text-center py-8 sm:py-12">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                                                    No reviews found for selected filter
                                                </p>
                                                <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1">
                                                    Try selecting a different rating filter
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                        <Button 
                            onClick={onClose}
                            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-sm sm:text-base"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackModal;