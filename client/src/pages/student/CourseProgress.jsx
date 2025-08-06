import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from '@/features/api/courseProgressApi';
import { useGetCourseByIdQuery } from '@/features/api/courseApi';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronDown, BookOpen, Clock, User, Star, Heart, Bookmark, FileText, MessageCircle, ExternalLink, Download } from 'lucide-react';

import FeedbackButton from '@/components/Feedback/FeedbackButton';
import LiveNowButton from '@/components/LiveClass/LiveNowButton';
import PremiumCourseSidebar from './CourseSideBar';
import LectureNotes from '@/components/LectureNotes';

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('lectures');
  const [currentLecture, setCurrentLecture] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [activeVideoTab, setActiveVideoTab] = useState('overview');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // ✅ ALL HOOKS MUST BE DECLARED FIRST
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const { data: courseData, isLoading: isCourseLoading } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
  });

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: completeData, isSuccess: completeSuccess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: inCompleteData, isSuccess: inCompleteSuccess }] = useInCompleteCourseMutation();

  // ✅ ALL useEffect HOOKS
  useEffect(() => {
    if (completeSuccess) {
      refetch();
      toast.success(completeData?.message);
    }
    if (inCompleteSuccess) {
      refetch();
      toast.success(inCompleteData?.message);
    }
  }, [completeSuccess, inCompleteSuccess, refetch, completeData?.message, inCompleteData?.message]);

  useEffect(() => {
    if (data?.data?.courseDetails?.lectures && !selectedLecture && data.data.courseDetails.lectures.length > 0) {
      setSelectedLecture(data.data.courseDetails.lectures[0]);
      setCurrentLecture(data.data.courseDetails.lectures[0]);
    }
  }, [data?.data?.courseDetails?.lectures, selectedLecture]);

  useEffect(() => {
    if (selectedLecture?.chapter) {
      setExpandedChapters((prev) => ({
        ...prev,
        [selectedLecture.chapter]: true,
      }));
    }
  }, [selectedLecture]);

  // ✅ CONDITIONAL RETURNS AFTER ALL HOOKS
  if (isLoading || isCourseLoading || isError || !data?.data) {
    return <p>Loading or failed to load course details</p>;
  }

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, lectures = [], quizzes = [] } = courseDetails;
  const course = courseData?.course;
  const pdfs = course?.pdfs || [];


  const toggleChapter = (chapterTitle) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterTitle]: !prev[chapterTitle],
    }));
  };

  const completedLectures = progress?.filter((p) => p.viewed)?.length || 0;
  const totalLectures = lectures.length;
  const courseProgressPercent = totalLectures === 0 ? 0 : Math.min(100, Math.round((completedLectures / totalLectures) * 100));

  const isLectureCompleted = (lectureId) => progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    setSelectedLecture(lecture); // ✅ Update selectedLecture too
    handleLectureProgress(lecture._id);
  };

  const handleCourseToggle = async () => {
    completed ? await inCompleteCourse(courseId) : await completeCourse(courseId);
  };

  const handleGenerateCertificate = async () => {
    try {
      // Optional: Add loading state
      // setIsGenerating(true);

      // ✅ Replace with environment variable
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/certificate/generate/${courseId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const contentType = response.headers.get('Content-Type');

      if (!response.ok || !contentType?.includes('application/pdf')) {
        try {
          const error = await response.json();
          // Using toast instead of alert for better UX (optional)
          toast.error(error.message || 'Unable to generate certificate');
          // alert(error.message || 'Unable to generate certificate');
        } catch {
          toast.error('Something went wrong while generating the certificate.');
          // alert('Something went wrong while generating the certificate.');
        }
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Optional: Better filename with course title
      a.download = `${courseTitle?.replace(/[^a-z0-9]/gi, '_') || 'course'}_certificate.pdf`;
      // a.download = 'certificate.pdf';  // Your original version works fine too

      document.body.appendChild(a); // Some browsers need this
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Optional: Success message
      toast.success('Certificate downloaded successfully!');

    } catch (err) {
      console.error('Certificate generation failed', err);
      toast.error('Failed to generate certificate.');
      // alert('Failed to generate certificate.');
    } finally {
      // Optional: Remove loading state
      // setIsGenerating(false);
    }
  };


  return (
    <div className="flex min-h-screen  text-white">
      <PremiumCourseSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        courseProgress={courseProgressPercent}
        course={course} // ✅ Add this line
      />
      <div className="lg:ml-62 flex-1 px-6 py-8 space-y-10 max-w-[1440px] mx-auto">


        {/* === LECTURES TAB === */}
        {activeTab === 'lectures' && (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Panel - Video Content */}
            <div className="flex-1 lg:w-[64%]">
              {selectedLecture ? (
                <div className="space-y-6">
                  {/* Video Player */}
                  <div className="relative">
                    <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-900 group">
                      <div className="aspect-video relative">
                        <video
                          src={selectedLecture.videoUrl}
                          controls
                          className="w-full h-full"
                          onEnded={() => handleLectureProgress(selectedLecture._id)}
                          // ✅ Replace with environment variable
                          poster={selectedLecture.thumbnail || `${import.meta.env.VITE_BASE_API_URL}/placeholder/800/450`}
                        />

                        {/* Custom overlay controls */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0  transition-opacity duration-300 pointer-events-none">
                          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                            <div className="flex items-center justify-between text-white text-sm">

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Title & Actions */}
                    <div className="mt-4">
                      <div className="flex items-start justify-between bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg shadow-md">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-black dark:text-white leading-tight">
                            Lecture {lectures.findIndex((lec) => lec._id === selectedLecture._id) + 1}: {selectedLecture.lectureTitle}
                          </h3>

                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setLiked(!liked)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 transition-all duration-200 group"
                          >
                            <Heart
                              size={20}
                              className={`transition-all duration-200 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                            />
                          </button>

                          <button
                            onClick={() => setBookmarked(!bookmarked)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Bookmark
                              size={20}
                              className={`transition-all duration-200 ${bookmarked ? 'text-blue-600 fill-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                            />
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs Section */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {[
                          { id: 'overview', label: 'Overview', icon: BookOpen },
                          { id: 'resources', label: 'Resources', icon: FileText },
                          { id: 'discussion', label: 'Discussion', icon: MessageCircle },
                          { id: 'notes', label: 'Notes', icon: FileText }
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveVideoTab(tab.id)}
                              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeVideoTab === tab.id
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                              <Icon size={18} className="mr-2" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 lg:p-5">
                      {activeVideoTab === 'overview' && (
                        <div className="space-y-6">
                          {/* Description */}
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                              About this lecture
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              Learn the fundamentals of Docker and containerization technology. This comprehensive introduction covers the basics of what Docker is, why it's important, and how it revolutionizes software development and deployment processes.
                            </p>
                          </div>

                          {/* Key Topics */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Key topics covered
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {['What is Docker?', 'Benefits of Containerization', 'Docker vs Virtual Machines', 'Basic Architecture'].map((topic, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <CheckCircle2 size={16} className="text-green-500 mr-3 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeVideoTab === 'resources' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Available Resources
                          </h4>
                          <div className="space-y-3">
                            {['Docker Installation Guide.pdf', 'Command Reference Sheet.pdf', 'Practice Exercises.zip'].map((resource, index) => (
                              <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <FileText size={20} className="text-blue-500 mr-3" />
                                <span className="text-gray-700 dark:text-gray-300">{resource}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeVideoTab === 'discussion' && (
                        <div className="text-center py-12">
                          <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Join the Discussion
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Ask questions and interact with fellow students
                          </p>
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Start Discussion
                          </button>
                        </div>
                      )}

                      {activeVideoTab === 'notes' && selectedLecture && (
                        <div className="py-6">
                          <LectureNotes
                            courseId={courseId}
                            lectureId={selectedLecture._id}
                          />
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No lectures available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Course Structure */}
            <div className="lg:w-[36%] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course content</h2>

                <div className="space-y-1">
                  {(() => {
                    // Group lectures by chapter dynamically
                    const grouped = lectures.reduce((acc, lec) => {
                      const chapter = lec.chapter || "Uncategorized";
                      if (!acc[chapter]) acc[chapter] = [];
                      acc[chapter].push(lec);
                      return acc;
                    }, {});

                    return Object.entries(grouped).map(([chapterTitle, chapterLectures], index) => {
                      const duration = chapterLectures.reduce((acc, lec) => acc + (lec.duration || 0), 0);
                      const isExpanded = expandedChapters[chapterTitle] ?? true;

                      return (
                        <div key={chapterTitle} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                          {/* Chapter Header */}
                          <div
                            className="flex items-center justify-between py-3 px-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && toggleChapter(chapterTitle)}
                            onClick={() => toggleChapter(chapterTitle)}
                            aria-expanded={isExpanded}
                            aria-controls={`chapter-${index}`}
                          >
                            <div className="flex items-center">
                              <ChevronDown
                                size={16}
                                className={`text-gray-400 mr-2 transform transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'
                                  }`}
                              />
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}: {chapterTitle}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.floor(duration / 60)} min
                            </span>
                          </div>

                          {/* Collapsible Section Content */}
                          <motion.div
                            id={`chapter-${index}`}
                            initial={false}
                            animate={{ height: isExpanded ? 'auto' : 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-2">
                              {chapterLectures.map((lecture) => (
                                <div
                                  key={lecture._id}
                                  className={`flex items-center justify-between py-2 px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition ${lecture._id === selectedLecture?._id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                                    : ''
                                    }`}
                                  onClick={() => handleSelectLecture(lecture)}
                                >
                                  <div className="flex items-center flex-1 min-w-0">
                                    <div className="flex items-center mr-3">
                                      {isLectureCompleted(lecture._id) ? (
                                        <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0">
                                          <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                        {lecture.lectureTitle}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center ml-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                      {lecture.duration
                                        ? new Date(lecture.duration * 1000).toISOString().substr(14, 5)
                                        : '05:00'}
                                    </span>
                                    {isLectureCompleted(lecture._id) && (
                                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5">
                                        Completed
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === ASSIGNMENTS TAB === */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 p-6">
            {/* Header Section */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
                  Assignments & Notes
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {pdfs && pdfs.length > 0
                    ? `${pdfs.length} document${pdfs.length !== 1 ? 's' : ''} available`
                    : 'Your teacher will share assignments and study materials here'
                  }
                </p>
              </div>
            </div>

            {/* Content Section */}
            {pdfs && pdfs.length > 0 ? (
              <div className="grid gap-4">
                {pdfs.map((pdf, index) => (
                  <div
                    key={pdf._id || index}
                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    {/* PDF Card Content */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* File Icon */}
                        <div className="flex-shrink-0 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>

                        {/* File Info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {typeof pdf.title === "string" ? pdf.title : "Untitled PDF"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            PDF Document
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <a
                        href={pdf.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0"
                      >
                        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group/btn">
                          <span>View</span>
                          <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                        </button>
                      </a>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-800/50 pointer-events-none transition-colors duration-200"></div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No assignments available yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Your teacher hasn't shared any assignments or study materials yet. Check back later for updates.
                </p>
              </div>
            )}
          </div>
        )}


        {/* === TEST TAB === */}
        {activeTab === 'test' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Test / Quiz</h2>
                <p className="text-gray-400 mt-1">Challenge yourself with these assessments</p>
              </div>
              <div className="text-sm text-gray-400">
                {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} available
              </div>
            </div>

            {quizzes.length > 0 ? (
              <div className="grid gap-4">
                {quizzes.map((quiz, index) => {
                  const progress = 100; // ⚠️ Replace this with real value later

                  return (
                    <div
                      key={quiz._id}
                      className="group relative bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      {/* Quiz Number Badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Quiz Title */}
                          <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {quiz.title || quiz.quizTitle}
                          </h3>

                          {/* Quiz Details */}
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{quiz.timeLimit || quiz.quizTimer} minutes</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Quiz Assessment</span>
                            </div>
                          </div>

                          {/* Progress Section */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white font-medium">{progress}%</span>
                            </div>

                            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="ml-6 flex flex-col items-end gap-3">
                          <button
                            onClick={() => navigate(`/course/${courseId}/quiz/${quiz._id}`)}
                            className="group/btn relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {progress > 0 ? 'Continue Quiz' : 'Start Quiz'}
                              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                          </button>

                          {progress > 0 && (
                            <div className="text-xs font-medium">
                              {progress === 100 ? (
                                <span className="text-emerald-400">✓ Completed</span>
                              ) : (
                                <span className="text-green-400">✓ In Progress</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No quizzes available</h3>
                  <p className="text-gray-500 text-sm max-w-md">
                    No assessments have been added to this course yet. Check back later for new quizzes and tests.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === NOTICEBOARD TAB === */}
        {activeTab === 'notice' && (
          <div className="space-y-8 p-6">
            {/* Header Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Noticeboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Stay updated with course announcements</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notices Section */}
            {courseDetails?.notices?.length > 0 ? (
              <div className="space-y-6">
                {[...courseDetails.notices]
                  .sort((a, b) => {
                    if (a.pinned === b.pinned) {
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return b.pinned - a.pinned;
                  })
                  .map((notice, index) => (
                    <div
                      key={notice._id}
                      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${notice.pinned
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800/50 shadow-lg shadow-amber-500/20'
                        : 'bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl backdrop-blur-sm'
                        }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Decorative gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Pinned notice special background */}
                      {notice.pinned && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
                      )}

                      <div className="relative p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Title and Pin Badge */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-1">
                                <h3 className={`text-lg font-bold leading-tight ${notice.pinned
                                  ? 'text-amber-900 dark:text-amber-100'
                                  : 'text-gray-900 dark:text-gray-100'
                                  }`}>
                                  {notice.title}
                                </h3>
                              </div>

                              {notice.pinned && (
                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                    <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                  PINNED
                                </div>
                              )}
                            </div>

                            {/* Message */}
                            <p className={`text-sm leading-relaxed ${notice.pinned
                              ? 'text-amber-800 dark:text-amber-200'
                              : 'text-gray-600 dark:text-gray-300'
                              }`}>
                              {notice.message}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${notice.pinned
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                              {new Date(notice.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-30 ${notice.pinned
                          ? 'from-amber-400 to-orange-500'
                          : 'from-blue-400 to-purple-500'
                          }`}></div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-full blur-2xl w-32 h-32 mx-auto"></div>
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-2">No Notices Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Course announcements and important updates will appear here. Check back later for new notices.
                </p>
              </div>
            )}
          </div>
        )}


        {/* === CERTIFICATE TAB === */}
        {activeTab === 'certificate' && (
          <div className="min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 p-8">
              {/* Hero Section */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                  Course Completion Certificate
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                  Congratulations on completing this course! Generate your official certificate to showcase your achievement.
                </p>
              </div>

              {/* Course Progress Indicator */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Course Progress</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{courseProgressPercent}%</span>
                </div>

                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-inner"
                      style={{ width: `${courseProgressPercent}%` }}
                    ></div>
                  </div>

                  {courseProgressPercent === 100 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {completedLectures} of {totalLectures} lectures completed
                </div>
              </div>

              {/* Certificate Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified Achievement</p>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Professional Format</p>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Instant Download</p>
                </div>
              </div>

              {/* Generate Certificate Button */}
              <button
                onClick={handleGenerateCertificate}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-xl transition-all duration-300 hover:scale-105  active:scale-95 focus:outline-none  "
              >
                <div className="absolute inset-0  opacity-0 group-hover:opacity-100 rounded-2xl blur-sm transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Generate Certificate</span>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>


              {/* Footer Note */}
              <div className="pt-8 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                  Your certificate will be generated as a PDF file with official verification details and can be shared on professional networks.
                </p>
              </div>
              <FeedbackButton courseId={courseId} />

            </div>
          </div>
        )}

        {/* ===LIVE CLASS=== */}
        {activeTab === 'live' && (

          <LiveNowButton liveClasses={course?.liveClasses || []} />
        )}

      </div>
    </div>
  );
};

export default CourseProgress;