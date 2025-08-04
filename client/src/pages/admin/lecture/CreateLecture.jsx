import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useUploadCoursePDFMutation,
  useCreateQuizMutation,
  useGetCourseByIdQuery,
  useDeleteQuizMutation,
  useDeleteQuizQuestionMutation,
  useUpdateQuizMutation,
  useAddNoticeMutation,
  useDeleteNoticeMutation,
  useTogglePinNoticeMutation,
  useGetCourseNoticesQuery,
  useAddLiveClassMutation,
  useDeleteLiveClassMutation,
} from '@/features/api/courseApi';
import { toast } from 'sonner';
import { Loader2, UploadCloud, Trash2, Pencil, BookOpen, FileText, ClipboardList, Megaphone, Video } from 'lucide-react';
import Lecture from './Lecture';

const CreateLecture = () => {

  const [activeTab, setActiveTab] = useState('lecture');
  const [chapter, setChapter] = useState('');
  // just one click ctrl +z to get original working .



  // 📚 Lecture states
  const [lectureTitle, setLectureTitle] = useState('');
  const [CreateLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

  // 📄 PDF states
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadPDF, { isLoading: uploading }] = useUploadCoursePDFMutation();

  // 🧠 Quiz states
  const [quizTitle, setQuizTitle] = useState('');
  const [quizTimer, setQuizTimer] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [createQuiz, { isLoading: creatingQuiz }] = useCreateQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [deleteQuizQuestion] = useDeleteQuizQuestionMutation();
  const [updateQuiz] = useUpdateQuizMutation();


  // 📢 Notice states
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [addNotice] = useAddNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [togglePinNotice] = useTogglePinNoticeMutation();

  // live class
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [liveStartTime, setLiveStartTime] = useState('');
  const [addLiveClass, { isLoading: addingLiveClass }] = useAddLiveClassMutation();
  const [deleteLiveClass] = useDeleteLiveClassMutation();



  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data: courseDetails, refetch: refetchCourse } = useGetCourseByIdQuery(courseId);

  const updateQuestion = (index, newQuestion) => {
    const updated = [...questions];
    updated[index] = newQuestion;
    setQuestions(updated);
  };

  const handleSubmitQuiz = async () => {
    if (!quizTitle || !quizTimer || questions.length === 0) {
      toast.error("Please fill in quiz title, timer and questions.");
      return;
    }
    try {
      const quizData = {
        quizTitle,
        quizTimer: Number(quizTimer),
        questions,
      };


      if (editingQuizId) {
        await updateQuiz({ quizId: editingQuizId, updatedData: quizData });
        toast.success("Quiz updated successfully!");
      } else {
        await createQuiz({ courseId, quizData }).unwrap();
        toast.success("Quiz created successfully!");
      }
      setQuizTitle('');
      setQuizTimer('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      setEditingQuizId(null);
      refetchCourse();
    } catch (err) {
      toast.error("Error saving quiz");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmDelete) return;

    try {
      await deleteQuiz({ courseId, quizId }).unwrap();
      toast.success("Quiz deleted!");
      refetchCourse();
    } catch (err) {
      toast.error("Failed to delete quiz");
      console.error(err);
    }
  };



  const handleEditQuiz = (quiz) => {
    console.log("Editing quiz object:", quiz);

    setQuizTitle(quiz.title || quiz.quizTitle || '');
    setQuizTimer(quiz?.timeLimit !== undefined ? quiz.timeLimit.toString() : '');

    setQuestions(Array.isArray(quiz.questions) ? quiz.questions : []);
    setEditingQuizId(quiz._id || '');
  };




  const handleDeleteQuestion = async (quizId, questionIndex) => {
    try {
      await deleteQuizQuestion({ quizId, questionIndex });
      toast.success("Question deleted!");
      refetchCourse();
    } catch {
      toast.error("Failed to delete question");
    }
  };



  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    if (!lectureTitle || !chapter) {
      toast.error("Please provide both Chapter and Lecture Title");
      return;
    }

    console.log("Sending data:", { lectureTitle, chapter, courseId }); // ✅ Log this

    await CreateLecture({ lectureTitle, chapter, courseId });
  };


  const handleAddNotice = async () => {
    if (!noticeTitle || !noticeMessage) {
      toast.error("Title and message are required.");
      return;
    }
    try {
      await addNotice({ courseId, noticeData: { title: noticeTitle, message: noticeMessage } });
      toast.success("Notice added.");
      setNoticeTitle('');
      setNoticeMessage('');
      refetchCourse();
    } catch {
      toast.error("Failed to add notice.");
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await deleteNotice({ courseId, noticeId });
      toast.success("Notice deleted.");
      refetchCourse();
    } catch {
      toast.error("Failed to delete notice.");
    }
  };
  const handleTogglePin = async (noticeId, pin) => {
    try {
      const response = await togglePinNotice({ courseId, noticeId, pin }).unwrap();
      toast.success(response.message || "Notice pin updated");

      await refetchCourse(); // ✅ refetch course details correctly

    } catch (error) {
      console.error("Failed to toggle pin:", error);
      toast.error("Failed to toggle pin");
    }
  };

  const handleCreateLiveClass = async () => {
    if (!liveTitle || !liveStartTime) {
      toast.error("Please provide title and start time.");
      return;
    }

    const jitsiLink = `https://meet.jit.si/${courseId}-${Date.now()}`;

    const payload = {
      title: liveTitle,
      meetingLink: jitsiLink,
      // ✅ Correct
      scheduledTime: liveStartTime,
      // ✅ correct field name
    };

    try {
      await addLiveClass({ courseId, liveClassData: payload }).unwrap();
      toast.success("Live class created!");
      setLiveTitle('');
      setLiveDescription('');
      setLiveStartTime('');
      refetchCourse();
    } catch (error) {
      toast.error("Failed to create live class.");
      console.error(error);
    }
  };


  const handleDeleteLiveClass = async (liveClassId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this live class?");
    if (!confirmDelete) return;

    try {
      await deleteLiveClass({ courseId, liveClassId }).unwrap();
      toast.success("Live class deleted!");
      refetchCourse(); // to get updated list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete live class.");
    }
  };







  const handlePdfUpload = async () => {
    if (!pdfTitle || !pdfFile) {
      toast.error('Please provide both a title and a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', pdfTitle); // ✅ matches backend

    formData.append('pdf', pdfFile);

    try {
      const res = await uploadPDF({ courseId, formData }).unwrap();
      toast.success(res.message || 'PDF uploaded successfully!');
      setPdfTitle('');
      setPdfFile(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to upload PDF.');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
      setLectureTitle('');
      setChapter('');
    }

    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  let groupedLectures = {};

  if (lectureData?.lectures) {
    groupedLectures = lectureData.lectures.reduce((acc, lecture) => {
      const chapterName = lecture.chapter || "Uncategorized"; // fallback if no chapter
      if (!acc[chapterName]) acc[chapterName] = [];
      acc[chapterName].push(lecture);
      return acc;
    }, {});
  }


  return (
    <div className="flex-1 mx-6 md:mx-10 mt-6 space-y-6 text-white">
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-3 border-b  border-white/10 pb-3 mt-4">
        <Button
          variant={activeTab === 'lecture' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('lecture')}
          className="flex items-center gap-2"
        >
          <BookOpen size={18} /> Add Lecture
        </Button>

        <Button
          variant={activeTab === 'pdf' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('pdf')}
          className="flex items-center gap-2"
        >
          <FileText size={18} /> Add PDF / Assignment
        </Button>

        <Button
          variant={activeTab === 'quiz' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('quiz')}
          className="flex items-center gap-2"
        >
          <ClipboardList size={18} /> Create Quiz Test
        </Button>

        <Button
          variant={activeTab === 'notice' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('notice')}
          className="flex items-center gap-2"
        >
          <Megaphone size={18} /> Add Notice
        </Button>

        <Button
          variant={activeTab === 'live' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('live')}
          className="flex items-center gap-2"
        >
          <Video size={18} /> Add Live Class
        </Button>
      </div>

      {/* === LECTURE TAB === */}
      {activeTab === 'lecture' && (
  <div className="mt-6 space-y-12">
    {/* === Add New Lecture Form === */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl p-8 w-full max-w-4xl mx-auto transition-all">
      <h2 className="text-3xl font-bold text-white mb-2">➕ Add New Lecture</h2>
      <p className="text-sm text-white/60 mb-6">
        Add a chapter and lecture title to create a new lecture in this course.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label className="text-white">📘 Chapter Name</Label>
          <Input
            type="text"
            className="bg-white/10 text-white border border-white/10 placeholder-white/40 focus:ring-purple-500"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="e.g. Introduction to React"
          />
        </div>

        <div>
          <Label className="text-white">🎥 Lecture Title</Label>
          <Input
            type="text"
            className="bg-white/10 text-white border border-white/10 placeholder-white/40 focus:ring-purple-500"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g. useEffect Hook"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => navigate(`/admin/course/${courseId}`)}
          className="flex items-center gap-2 rounded-l px-4 py-2 border border-gray-500 dark:border-white/20 text-gray-800 dark:text-white bg-white dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-white/10 transition duration-300 shadow-sm"
        >
          <span className="text-lg">🔙</span>
          Back to course
        </Button>

        <Button disabled={isLoading} onClick={createLectureHandler}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            'Create Lecture'
          )}
        </Button>
      </div>
    </div>

    {/* === Lecture List === */}
    <div className="w-full max-w-5xl mx-auto">
      {lectureLoading ? (
        <p className="text-sm text-gray-400 text-center">Loading lectures...</p>
      ) : lectureError ? (
        <p className="text-sm text-red-400 text-center">❌ Failed to load lectures.</p>
      ) : lectureData?.lectures?.length === 0 ? (
        <p className="text-center text-white/40 text-sm italic mt-6">
          ⚠️ No lectures added yet.
        </p>
      ) : (
        Object.entries(groupedLectures).map(([chapterName, chapterLectures]) => (
          <div key={chapterName} className="mb-10">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
              📚 {chapterName}
            </h3>

            <div className="space-y-4">
              {chapterLectures.map((lecture, index) => (
                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}



      {/* === PDF TAB === */}
      {activeTab === 'pdf' && (
        <div className="mt-6">
          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-xl p-8 w-full max-w-3xl mx-auto transition-all">

            {/* Heading */}
            <h2 className="text-3xl font-bold text-gradient-to-r from-pink-400 to-purple-500 mb-2">📄 Add PDF / Assignment</h2>
            <p className="text-sm text-white/60 mb-8">
              Upload study material, notes, or assignments for this course.
            </p>

            {/* Input Fields */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label className="text-white">📘 PDF Title</Label>
                <Input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="Enter PDF name"
                  className="mt-1 bg-white/10 text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-purple-400 backdrop-blur-md transition"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-white">📎 Select PDF File</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="mt-1 bg-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-500 file:text-white hover:file:bg-gray-400 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-2">
                {/* Back Button */}
                <Button
                  onClick={() => navigate(`/admin/course/${courseId}`)}
                  className="flex items-center gap-2 rounded-l px-4 py-2 border border-gray-500 dark:border-white/20 text-gray-800 dark:text-white bg-white dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-white/10 transition duration-300 shadow-sm"
                >
                  <span className="text-lg">🔙</span>
                  Back to course
                </Button>

                {/* Upload Button */}
                <Button
                  disabled={uploading}
                  onClick={handlePdfUpload}
                  className="flex items-center gap-2 rounded-l  transition shadow-lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      Upload PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* === QUIZ TAB === */}
      {activeTab === 'quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* === Left: Quiz Form === */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg space-y-8 transition-all">

            <h1 className="text-3xl font-bold text-white">
              {editingQuizId ? '✏️ Edit Quiz' : '📝 Create Quiz Test'}
            </h1>

            {/* Quiz Title + Timer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">📘 Quiz Name</Label>
                <Input
                  className="mt-1 bg-white/10 text-white placeholder-white/40 border border-white/10 focus:ring-purple-500"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Chapter 2 Quiz"
                />
              </div>
              <div>
                <Label className="text-white">⏱️ Timer (in minutes)</Label>
                <Input
                  className="mt-1 bg-white/10 text-white placeholder-white/40 border border-white/10 focus:ring-purple-500"
                  type="number"
                  value={quizTimer}
                  onChange={(e) => setQuizTimer(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            {/* All Questions */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white/5 border border-white/10 p-5 rounded-xl shadow-md space-y-4">
                <Label className="text-white text-lg font-semibold block">
                  Question {qIndex + 1}
                </Label>

                <Input
                  type="text"
                  className="bg-white/10 text-white placeholder-white/40 border border-white/10 focus:ring-purple-400"
                  placeholder="Enter your question"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, { ...q, question: e.target.value })}
                />

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((optIndex) => (
                    <div key={optIndex}>
                      <Label className="text-white">Option {optIndex + 1}</Label>
                      <Input
                        type="text"
                        className="mt-1 bg-white/10 text-white placeholder-white/40 border border-white/10"
                        value={q.options[optIndex]}
                        placeholder={`Option ${optIndex + 1}`}
                        onChange={(e) => {
                          const newOptions = [...q.options];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(qIndex, { ...q, options: newOptions });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <Label className="text-white">✅ Correct Answer (Index: 0-3)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    className="mt-1 bg-white/10 text-white placeholder-white/40 border border-white/10"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      updateQuestion(qIndex, {
                        ...q,
                        correctAnswer: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                {editingQuizId && (
                  <Button
                    variant="destructive"
                    className="mt-3"
                    onClick={() => handleDeleteQuestion(editingQuizId, qIndex)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Question
                  </Button>
                )}
              </div>
            ))}

            {/* Quiz Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setQuestions([
                    ...questions,
                    { question: '', options: ['', '', '', ''], correctAnswer: 0 },
                  ])
                }
              >
                ➕ Add Question
              </Button>
              <Button onClick={handleSubmitQuiz} disabled={creatingQuiz}>
                {creatingQuiz ? 'Saving...' : editingQuizId ? 'Update Quiz' : 'Save Quiz'}
              </Button>
            </div>
          </div>

          {/* === Right: Quiz List === */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">📚 Existing Quizzes</h2>

            {Array.isArray(courseDetails?.course?.quizzes) &&
              courseDetails.course.quizzes.length > 0 ? (
              courseDetails.course.quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="flex justify-between items-center bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg mb-3 shadow-sm"
                >
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {quiz.title || quiz.quizTitle || 'Untitled Quiz'}
                  </span>
                  <div className="flex gap-2">
                    <Button size="icon" onClick={() => handleEditQuiz(quiz)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDeleteQuiz(quiz._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60 text-center">No quizzes available.</p>
            )}
          </div>
        </div>
      )}


      {/* === NOTICE TAB === */}
      {activeTab === 'notice' && (
  <div className="space-y-10">
    {/* Heading */}
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-bold text-white">📢 Add Course Notice</h1>
    </div>

    {/* Inputs */}
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-white/70">🔖 Title</Label>
        <Input
          value={noticeTitle}
          onChange={(e) => setNoticeTitle(e.target.value)}
          placeholder="e.g. Maintenance Notice"
          className="bg-white/10 text-white placeholder-white/30 border border-white/10 focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white/70">💬 Message</Label>
        <Input
          value={noticeMessage}
          onChange={(e) => setNoticeMessage(e.target.value)}
          placeholder="e.g. Platform will be down from 10PM to 12AM"
          className="bg-white/10 text-white placeholder-white/30 border border-white/10 focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>

    {/* Add Notice Button */}
    <Button onClick={handleAddNotice} className="w-full md:w-fit px-8 py-2 text-base font-medium shadow-md">
      ➕ Add Notice
    </Button>

    {/* Notice List */}
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-white/80 mb-2">📃 Existing Notices</h2>

      {courseDetails?.course?.notices?.length > 0 ? (
        <div className="space-y-5">
          {[...courseDetails.course.notices]
            .sort((a, b) => b.pinned - a.pinned)
            .map((notice) => (
              <div
                key={notice._id}
                className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 rounded-2xl border shadow-lg transition-all
                ${notice.pinned ? 'bg-yellow-50/10 border-yellow-300' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-semibold text-white flex items-center gap-2">
                    📌 {notice.title}
                    {notice.pinned && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-300 text-yellow-900">
                        Pinned
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-white/60">{notice.message}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={notice.pinned ? 'outline' : 'secondary'}
                    onClick={() => handleTogglePin(notice._id, !notice.pinned)}
                    className="text-sm font-medium"
                  >
                    {notice.pinned ? 'Unpin' : '📌 Pin'}
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteNotice(notice._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-sm text-white/60">No notices added yet.</p>
      )}
    </div>
  </div>
)}


      {/* ===LIVE CLASS=== */}
      {activeTab === 'live' && (
  <div className="space-y-10">
    {/* Heading */}
    <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
      🎥 Schedule a Live Class
    </h1>

    {/* Live Class Form */}
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-white/80">📘 Title</Label>
        <Input
          value={liveTitle}
          onChange={(e) => setLiveTitle(e.target.value)}
          placeholder="e.g. Doubt Clearing Session"
          className="bg-white/10 text-white placeholder-white/30 border border-white/10 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white/80">📝 Description</Label>
        <Input
          value={liveDescription}
          onChange={(e) => setLiveDescription(e.target.value)}
          placeholder="Brief about this live session"
          className="bg-white/10 text-white placeholder-white/30 border border-white/10 focus:ring-primary"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label className="text-white/80">⏰ Start Time</Label>
        <Input
          type="datetime-local"
          value={liveStartTime}
          onChange={(e) => setLiveStartTime(e.target.value)}
          className="bg-white/10 text-white placeholder-white/30 border border-white/10 focus:ring-primary"
        />
      </div>
    </div>

    {/* Submit Button */}
    <Button
      onClick={handleCreateLiveClass}
      disabled={addingLiveClass}
      className="w-full md:w-fit text-base font-semibold px-8 py-2 shadow-lg"
    >
      {addingLiveClass ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        '➕ Create Live Class'
      )}
    </Button>

    {/* Live Class List */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white/80 mb-2">📅 Upcoming & Past Sessions</h2>

      {courseDetails?.course?.liveClasses?.length > 0 ? (
        <div className="space-y-4">
          {courseDetails.course.liveClasses
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .map((live) => {
              const isUpcoming = new Date(live.startTime) > new Date();
              return (
                <div
                  key={live._id}
                  className={`rounded-2xl p-5 shadow-md transition-all border
                    ${isUpcoming
                      ? 'border-blue-400 bg-blue-50/10 hover:shadow-lg'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1 text-white">
                      <p className="text-lg font-semibold flex items-center gap-1">
                        📘 {live.title}
                        {isUpcoming && (
                          <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-blue-300 text-blue-900 rounded-full">
                            Upcoming
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-white/60">{live.description}</p>
                      <p className="text-sm mt-1">
                        🕒 {new Date(live.startTime).toLocaleString()}
                      </p>
                      <a
                        href={live.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-400 underline font-medium hover:text-blue-300 transition"
                      >
                        🔗 Join Link
                      </a>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteLiveClass(live._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-sm text-white/50">No live classes created yet.</p>
      )}
    </div>
  </div>
)}








    </div>
  );
};

export default CreateLecture;
