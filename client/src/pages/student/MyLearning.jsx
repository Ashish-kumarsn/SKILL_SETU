import React from 'react';
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';
import { Link } from 'react-router-dom';

const MyLearning = () => {
  const { data, isLoading, isError } = useGetPurchasedCoursesQuery();

  const courses = data?.purchasedCourses || [];

  return (
    <div className="max-w-6xl mx-auto my-24 px-4 md:px-0 text-white">
      <h1 className="font-bold text-2xl mb-6">MY LEARNING</h1>

      {isLoading ? (
        <MyLearningSkeleton />
      ) : isError ? (
        <p className="text-red-500">Failed to load courses. Please try again.</p>
      ) : courses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((item, index) => (
            <Link
              to={`/course-progress/${item?.courseId?._id}`}
              key={item._id || index}
              className="bg-white text-black rounded-lg shadow-md hover:shadow-xl transition p-4"
            >
              <img
                src={item?.courseId?.courseThumbnail || "/fallback.jpg"}
                alt="Course Thumbnail"
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold text-lg mt-3">{item?.courseId?.courseTitle}</h2>
              <p className="text-sm text-black">{item?.courseId?.subTitle}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg h-52 animate-pulse"
      ></div>
    ))}
  </div>
);
