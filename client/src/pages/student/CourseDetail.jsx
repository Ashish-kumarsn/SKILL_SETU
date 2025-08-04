import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCourseDetailWithStatusQuery, useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi';
import BuyCourseButton from '@/components/BuyCourseButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, ChevronRight, ChevronDown, PlayCircle, Lock } from 'lucide-react';
import CourseHighlightsSection from '@/components/CourseHighlightsSection';
import { motion, AnimatePresence } from "framer-motion";
import TestimonialSlider from '../../components/TestimonialSlider';
import Lottie from "lottie-react";
import animationData from "../../../public/Programming Computer.json";
import CourseCertificate from '../../components/CourseCertificate';
import FinalCTASection from "@/components/FinalCTASection";





import {
  VideoIcon,
  FileText,
  ClipboardList,
  FlaskConical,
  Users,
  Star,
} from 'lucide-react';
import ReactPlayer from 'react-player';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // ✅ Renamed isError to isCourseError to avoid conflict
  const { data, isLoading, isError: isCourseError } = useGetCourseDetailWithStatusQuery(courseId);

  const [createCheckoutSession, { data: checkoutData, isLoading: isBuying, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();

  const [clickedBuyNow, setClickedBuyNow] = useState(false);
  const [openChapters, setOpenChapters] = useState({});
  const isAnyChapterOpen = Object.values(openChapters).some((v) => v === true);



  // ✅ Only one clean handleBuyNow
  const handleBuyNow = async () => {
    setClickedBuyNow(true);
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (clickedBuyNow) {
      if (isSuccess && checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else if (isError) {
        toast.error(error?.data?.message || "Failed to create checkout");
      }
    }
  }, [isSuccess, isError, checkoutData, error, clickedBuyNow]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isCourseError) return <h1>Failed to load course details</h1>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) navigate(`/course-progress/${courseId}`);
  };

  const groupLecturesByChapter = (lectures) => {
    const grouped = {};

    lectures.forEach((lecture) => {
      const chapter = lecture.chapter || "Other Lectures";
      if (!grouped[chapter]) {
        grouped[chapter] = [];
      }
      grouped[chapter].push(lecture);
    });

    return grouped;
  };

  const groupedLectures = groupLecturesByChapter(course.lectures);



  return (

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col items-center justify-center">
        {/* Main Card */}
<Card className="w-full bg-white dark:bg-[#0a0f1a] shadow-2xl p-6 rounded-3xl border border-gray-200 dark:border-white/10 transition-all duration-300">
<h1 className="text-3xl md:text-4xl font-extrabold leading-snug text-gray-900 dark:text-white mb-6">
  {course?.courseTitle}
</h1>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left */}
            <div className="flex-1">
<div className="rounded-2xl overflow-hidden border-2 border-purple-500 dark:border-indigo-400 bg-purple-100 dark:bg-white/5 aspect-video flex items-center justify-center">
                <VideoIcon className="w-12 h-12 text-purple-700" />
              </div>

              <div className="mt-5 flex items-center justify-between text-black">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                    👤
                  </div>
                  <div>
<p className="text-xl font-semibold text-gray-800 dark:text-white">{course?.creator.name}</p>
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                </div>

                {/* Social Icons */}
                <ul className="wrapper ">
                  {/* Facebook */}
                  <li className="icon facebook">
                    <span className="tooltip">Facebook</span>
                    <svg viewBox="0 0 320 512" height="1.2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M279.14 288l14.22-92.66h-88.91V117.6c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </li>

                  {/* Twitter */}
                  <li className="icon twitter">
                    <span className="tooltip">Twitter</span>
                    <svg height="1.2em" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M459.4 151.7c.3 4.5.3 9.1.3 13.6 0 138.72-105.58 298.56-298.56 298.56-59.45 0-114.68-17.22-161.14-47.106 8.447.974 16.568 1.372 25.34 1.372 49.055 0 94.213-16.568 130.274-44.832-46.132-.974-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.3c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                    </svg>
                  </li>

                  {/* Instagram */}
                  <li className="icon instagram">
                    <span className="tooltip">Instagram</span>
                    <svg height="1.2em" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 189.6c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.7-9.9-67.3-36.3-93.6C382.4 7.7 350.7-.5 315.1 1.1c-35.6 1.7-143.2 1.7-178.8 0-35.7-1.7-67.3 9.9-93.6 36.3S-1.7 97.3 0 132.9c1.7 35.6 1.7 143.2 0 178.8-1.7 35.7 9.9 67.3 36.3 93.6 26.4 26.4 58 38 93.6 36.3 35.6-1.7 143.2-1.7 178.8 0 35.7 1.7 67.3-9.9 93.6-36.3 26.4-26.4 38-58 36.3-93.6 1.7-35.6 1.7-143.2 0-178.8zM398.8 388c-7.8 19.5-22.9 34.6-42.4 42.4-29.4 11.7-99.2 9-132.4 9s-103 .6-132.4-9c-19.5-7.8-34.6-22.9-42.4-42.4-11.7-29.4-9-99.2-9-132.4s-.6-103 9-132.4c7.8-19.5 22.9-34.6 42.4-42.4 29.4-11.7 99.2-9 132.4-9s103-.6 132.4 9c19.5 7.8 34.6 22.9 42.4 42.4 11.7 29.4 9 99.2 9 132.4s.6 103-9 132.4z" />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right */}
            <div className="w-full md:w-[340px] space-y-8">
              {/* Purchase Card */}
<Card
  className="relative overflow-hidden rounded-2xl border transition-colors duration-300 
    bg-white dark:bg-white/5 
    border-gray-200 dark:border-white/10 
    shadow-[0_4px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_0_40px_rgba(165,113,255,0.15)] 
    backdrop-blur-md"
>
  {/* 🌈 Gradient for dark only */}
  <div className="hidden dark:block absolute inset-0 rounded-2xl pointer-events-none opacity-10 bg-gradient-to-br from-pink-500 via-indigo-500 to-purple-500 blur-2xl z-0" />

  <CardContent className="relative z-10 p-6 space-y-4">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Full Course</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
        ₹{course?.price}
        <span className="ml-2 text-sm text-gray-400 line-through">₹1999</span>
        <span className="ml-2 text-green-600 text-base font-semibold">50% off</span>
      </p>
    </div>

    <ul className="text-sm text-gray-800 dark:text-white/90 space-y-3 mt-4">
      <li className="flex items-center gap-2">
        <VideoIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
        {course?.lectures.length} video lectures
      </li>
      <li className="flex items-center gap-2">
        <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
        Lecture notes
      </li>
      <li className="flex items-center gap-2">
        <ClipboardList size={18} className="text-indigo-600 dark:text-indigo-400" />
        Assignments
      </li>
      <li className="flex items-center gap-2">
        <FlaskConical size={18} className="text-indigo-600 dark:text-indigo-400" />
        Tests
      </li>
      <li className="flex items-center gap-2">
        <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
        Live classes
      </li>
    </ul>

    {/* Buttons */}
    <div className="space-y-2 mt-6">
  <div className="flex items-center gap-10">
    <Button className="bg-transparent cart-button border-2 font-weight: 600 border-[#7a2aac] text-[#7a2aac] font-bold rounded-xl px-20 py-5 hover:bg-[#7a2aac] hover:text-white transition" variant="outline">
      Cart
    </Button>

    <label htmlFor="checkboxInput" className="bookmark ml-2">
      <input type="checkbox" id="checkboxInput" />
      <svg
        width="15"
        viewBox="0 0 50 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svgIcon"
      >
        <path
          d="M46 62.0085L46 3.88139L3.99609 3.88139L3.99609 62.0085L24.5 45.5L46 62.0085Z"
          stroke="currentColor"
          strokeWidth="7"
        ></path>
      </svg>
    </label>
  </div>

  {/* ✅ Conditional Button */}
  {purchased ? (
    <Button
      onClick={handleContinueCourse}
      className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:brightness-110 transition-all duration-300"
    >
      Continue Course
    </Button>
  ) : (
    <button
      type="button"
      className="buy-now-button w-full"
      onClick={handleBuyNow}
      disabled={isBuying}
    >
      <span className="fold"></span>
      <div className="points_wrapper">
        {Array.from({ length: 10 }).map((_, i) => (
          <i key={i} className="point" />
        ))}
      </div>
      <span className="inner">
        {isBuying ? (
          <>
            <Loader2 className="icon animate-spin mr-1" />
            Processing...
          </>
        ) : (
          <>
            <svg
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37" />
            </svg>
            BUY NOW
          </>
        )}
      </span>
    </button>
  )}
</div>

  </CardContent>
</Card>



              {/* Rating Card */}
              <Card className="rounded-3xl shadow-xl border border-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#fceabb] via-[#f8b500] to-[#fceabb] rounded-3xl blur-[10px] opacity-25 z-0"></div>
                <CardContent className="relative z-10 px-4 py-2 flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-3xl">
                  <img src="https://cdn.shopify.com/s/files/1/1061/1924/files/Heart_Eyes_Emoji.png?9898922749706957214" alt="Heart Eyes Emoji" className="w-10 h-10 sm:w-12 sm:h-12" />
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">Rating</p>
                    <div className="flex items-center gap-[2px] text-yellow-400 drop-shadow-sm">
                      {Array(4).fill(0).map((_, i) => <Star key={i} size={18} fill="currentColor" stroke="none" className="text-yellow-500" />)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-right leading-tight">
                    <span className="text-base font-bold text-gray-900">4.0</span>
                    <span className="text-sm text-gray-800">230 <span className="text-xs text-gray-500">review</span></span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* about section */}
      <div className='py-10 px-8'></div>
      <div className='py-8'></div>
      {course?.description && (
        <CourseHighlightsSection
          description={course.description}
          topics={["JavaScript", "Animate", "Ashish"]}
        />
      )}

      <div className='py-5'></div>


      <TestimonialSlider />



      {/* Bottom Preview Section */}
      <motion.div
  layout
  className="mt-12 flex flex-col lg:flex-row gap-8"
>
  <div className="flex-1 space-y-5">
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">
          Course Content ({course?.lectures.length} lectures)
        </h3>
        {Object.entries(groupedLectures).map(([chapter, lectures]) => (
          <div
            key={chapter}
            className="rounded border border-white/10 bg-black/20 p-4"
          >
            {/* Chapter Heading */}
            <div
              onClick={() =>
                setOpenChapters((prev) => ({
                  ...prev,
                  [chapter]: !prev[chapter],
                }))
              }
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="font-semibold text-base">{chapter}</div>
              {openChapters[chapter] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </div>

            {/* Lecture List */}
            <AnimatePresence initial={false}>
              {openChapters[chapter] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden mt-3"
                >
                  <div className="relative pl-5">
                    {/* ✅ Animated Vertical line */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute top-0 left-1.5 w-0.5 bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-500"
                    />

                    {/* Lectures */}
                    {lectures.map((lecture, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 mb-4 group"
                      >
                        {/* Dot */}
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-indigo-500 shadow-md mt-1 group-hover:scale-125 transition-transform duration-200" />

                        {/* Lecture Title */}
                        <div className="text-sm text-white/90">
                          {purchased ? (
                            <div className="flex items-center gap-2">
                              <PlayCircle size={16} /> {lecture.lectureTitle}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock size={16} /> {lecture.lectureTitle}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>

  <div className="w-full lg:w-1/3 space-y-6">
    {/* 🌟 Polished Lottie Animation Section */}
    <div className="px-4 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-center relative overflow-hidden">
      <h3 className="text-sm font-medium text-white/80 mb-2 tracking-wide">
        Getting Ready to Learn
      </h3>
      <Lottie
        animationData={animationData}
        loop
        className="w-full max-w-[250px] mx-auto"
      />
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-10 bg-gradient-to-br from-pink-500 via-indigo-500 to-purple-500 blur-2xl" />
    </div>

    {/* 📺 Course Preview Card */}
    <AnimatePresence>
      {isAnyChapterOpen && (
        <motion.div
          key="lecture-preview"
          layout
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-lg">
            {/* 🎥 Video Section */}
            <div className="aspect-video">
              <ReactPlayer
                width="100%"
                height="100%"
                url={course.lectures[0].videoUrl}
                controls
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
                      onContextMenu: (e) => e.preventDefault(),
                    },
                  },
                }}
              />
            </div>

            {/* 📋 Content Section */}
            <div className="p-5">
              <h2 className="text-white font-semibold text-lg tracking-tight mb-1">
                Lecture Preview
              </h2>

              {/* 🔥 Gradient line separator */}
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 rounded-full mb-3" />

              <p className="text-sm text-white/80">
                Start learning now with hands-on lectures designed for impact.
              </p>
            </div>

            {/* ✅ CTA */}
            <div className="px-5 pb-5">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:brightness-110 transition-all duration-300"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</motion.div>

<div className="mt-12">
  {/* Other sections above */}
  <CourseCertificate />
</div>

<FinalCTASection
  courseId={courseId}
  purchased={purchased}
  handleContinueCourse={handleContinueCourse}
/>


    </div>
  );
};

export default CourseDetail;
