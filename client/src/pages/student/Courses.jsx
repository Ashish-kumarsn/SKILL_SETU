import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import Course from './Course';
import { useGetPublishedCourseQuery } from '@/features/api/courseApi';
import { motion } from 'framer-motion';


const Courses = () => {
  const { data, isLoading, isError, isSuccess } = useGetPublishedCourseQuery();

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400">We couldn't fetch the courses. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 "></div>
<div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 animate-pulse rounded-full blur-3xl"></div>
<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 animate-[ping_5s_linear_infinite] rounded-full blur-3xl"></div>


      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className="text-center mb-16">
          {/* <div className="relative z-20 flex items-center justify-center py-10">
            <div className="w-full max-w-[320px] border-t border-white/10 relative">
              <span className="absolute left-1/2 -top-4 -translate-x-1/2 bg-[#0e0f2e] px-5 py-1 text-sm sm:text-base text-purple-300 font-medium tracking-wide rounded-full border border-purple-500/30 shadow-lg backdrop-blur-md">
                Collections
              </span>
            </div>
          </div> */}

          <h2 className="font-outfit font-black text-5xl lg:text-6xl text-center mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            Our Courses
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Unlock your potential with expertly crafted courses designed to accelerate your learning journey
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-4 shadow-lg shadow-blue-500/50"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))}

          {isSuccess && data?.courses?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-400/20 flex items-center justify-center border border-gray-500/30">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Courses Available Yet</h3>
              <p className="text-gray-400 text-lg">Check back soon for amazing new courses!</p>
            </div>
          )}

          {isSuccess &&
            data?.courses?.map((course, index) => (
              <PremiumCourseCard key={course._id} course={course} index={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

const PremiumCourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate(`/course-detail/${course._id}`);
  };

  return (
    <div
      className="group relative   backdrop-blur-xl border border-gray-700/50 shadow-2xl  transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-2 hover:border-blue-500/50 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleCourseClick}
    >
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>

      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-full backdrop-blur-sm">
          <span className="text-yellow-300 text-xs font-bold">PREMIUM</span>
        </div>
      </div>

      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Floating Elements */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-white text-xs font-medium">{course.courseLevel || 'All Levels'}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 relative z-10">
        {/* Course Title */}
        <h3 className="font-bold text-xl text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
          {course.courseTitle}
        </h3>

        {/* Instructor Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={course.creator?.photoUrl || '/default-avatar.png'}
              alt={course.creator?.name}
              className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition-colors duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <p className="text-gray-300 text-sm font-medium">{course.creator?.name || 'Ankush'}</p>
            <p className="text-gray-500 text-xs">Course Instructor</p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{course?.averageRating || 4.8}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span>2.1k+</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>12h</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ₹{course.coursePrice}
            </span>
            <span className="text-sm text-gray-500 line-through">₹{Math.floor(course.coursePrice * 1.5)}</span>
          </div>

<button
  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110"

            onClick={(e) => {
              e.stopPropagation();
              handleCourseClick();
            }}
          >
            Enroll Now
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Course Progress</span>
            <span>0%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-0 group-hover:w-[10%] transition-all duration-1000"><motion.div
  initial={{ width: 0 }}
  whileHover={{ width: '10%' }}
  transition={{ duration: 1 }}
  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
/>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-700/30 shadow-xl rounded-3xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-700/50 to-gray-600/50"></div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4 bg-gray-700/50 rounded-lg" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 bg-gray-700/50 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-gray-700/50 rounded" />
            <Skeleton className="h-3 w-16 bg-gray-700/50 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12 bg-gray-700/50 rounded" />
          <Skeleton className="h-4 w-12 bg-gray-700/50 rounded" />
          <Skeleton className="h-4 w-12 bg-gray-700/50 rounded" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16 bg-gray-700/50 rounded" />
          <Skeleton className="h-8 w-24 bg-gray-700/50 rounded-xl" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20 bg-gray-700/50 rounded" />
            <Skeleton className="h-3 w-8 bg-gray-700/50 rounded" />
          </div>
          <Skeleton className="h-2 w-full bg-gray-700/50 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Courses;