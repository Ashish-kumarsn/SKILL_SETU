import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CourseTab from './CourseTab';
import SeeFeedback from '@/components/Feedback/seeFeedback';
import FeedbackIcon from '@/assets/feedback-icon.png'; // ✅ Import PNG properly

const EditCourse = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // ❗ Default = false
  const { courseId } = useParams();

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 py-10 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Course Information</h1>
          <p className="text-gray-400 text-sm mt-1">
            Fill out the course structure, content and other details.
          </p>
        </div>

        {/* Button Group: Feedback Icon + Add Content */}
        <div className="flex items-center gap-3">
          {/* Feedback Icon Button */}
          {/* Feedback Icon Button with Premium Glow */}
          {/* Feedback Icon Button with Tight Hover Glow */}
<button
  onClick={() => setShowFeedbackModal(true)}
  title="See Feedback"
  className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow transition group overflow-hidden"
>
  {/* Inner glow on hover */}
  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 z-0" />

  {/* Feedback Icon */}
  <img
    src={FeedbackIcon}
    alt="Feedback"
    className="w-6 h-6 relative z-10"
  />
</button>



          {/* Add Content Button */}
          <Link to="lecture">
            <Button
              variant="outline"
              className="border-white/20 hover:border-blue-600 text-blue-500 transition"
            >
              Add content
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Tabs Section */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-md p-6">
        <CourseTab />
      </div>
      
      {/* Feedback Modal Component */}
      <SeeFeedback
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)} // ✅ fix here
        courseId={courseId}
      />
    </div>
  );
};

export default EditCourse;
