import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router-dom';
import './App.css';
import { MessageCircle } from "lucide-react";
import Lottie from "lottie-react";
import botAnimation from "./assets/lottie/animation.json"; // adjust path if needed
import { motion } from 'framer-motion';

import Login from './pages/Login';

import HeroSection from './pages/student/HeroSection';
import Courses from './pages/student/Courses';
import MyLearning from './pages/student/MyLearning';
import Profile from './pages/student/Profile';
import Sidebar from './pages/admin/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/course/CourseTable';
import AddCourse from './pages/admin/course/AddCourse';
import EditCourse from './pages/admin/course/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import EditLecture from './pages/admin/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/courseProgress';
import SearchPage from './pages/student/SearchPage';

import CourseCategories from './components/CourseCategories';
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes';
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';
import MainLayout from './layout/MainLayout';

// ✅ NEW IMPORT
import QuizDetail from './pages/admin/course/[courseId]/quiz/[quizId]';
// ✅ Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';

import CertificateShowcase from './components/CertificateShowcase';
import Chatbot from './components/Chatbot/Chatbot';
import Testimonial from './components/testimonialHero';

import ContactUs from './components/ContactUs';
import AdminSidebar from './components/Sidebar';

// ✅ NEW: Wrapper component that includes GlobalChatbot
function AppWithChatbot() {
  return (
    <>
      <Outlet />
      <GlobalChatbot />
    </>
  );
}

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppWithChatbot />, // ✅ This wrapper includes chatbot
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: (
              <>
                <AdminSidebar />
                <div id="home"><HeroSection /></div>
                <div id="categories"><CourseCategories /></div>
                <div id="certificates"><CertificateShowcase /></div>
                <div id="testimonials"><Testimonial /></div>
                <div id="courses"><Courses /></div>

                <div id="contact">
                  <div className="relative z-20 flex items-center justify-center py-10">
                    <div className="w-full max-w-[320px] border-t border-white/10 relative">
                      <span className="absolute left-1/2 -top-4 -translate-x-1/2 bg-[#0e0f2e] px-5 py-1 text-sm sm:text-base text-purple-300 font-medium tracking-wide rounded-full border border-purple-500/30 shadow-lg backdrop-blur-md">
                        Contact Us
                      </span>
                    </div>
                  </div>
                  <ContactUs />
                </div>
              </>
            ),
          },
          {
            path: 'login',
            element: (
              <AuthenticatedUser>
                <Login />
              </AuthenticatedUser>
            ),
          },
          {
            path: 'my-learning',
            element: (
              <ProtectedRoute>
                <MyLearning />
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: 'course/search',
            element: (
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'course-detail/:courseId',
            element: (
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: 'course-progress/:courseId',
            element: (
              <ProtectedRoute>
                <PurchaseCourseProtectedRoute>
                  <CourseProgress />
                </PurchaseCourseProtectedRoute>
              </ProtectedRoute>
            ),
          },

          // ✅ NEW ROUTE: Quiz View Page
          {
            path: 'course/:courseId/quiz/:quizId',
            element: (
              <ProtectedRoute>
                <QuizDetail />
              </ProtectedRoute>
            ),
          },

          // 🛠️ Admin Routes
          {
            path: 'admin',
            element: (
              <AdminRoute>
                <Sidebar />
              </AdminRoute>
            ),
            children: [
              {
                path: 'dashboard',
                element: <Dashboard />,
              },
              {
                path: 'course',
                element: <CourseTable />,
              },
              {
                path: 'course/create',
                element: <AddCourse />,
              },
              {
                path: 'course/:courseId',
                element: <EditCourse />,
              },
              {
                path: 'course/:courseId/lecture',
                element: <CreateLecture />,
              },
              {
                path: 'course/:courseId/lecture/:lectureId',
                element: <EditLecture />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

// ✅ NEW: Global Chatbot Component with Route Detection
function GlobalChatbot() {
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  // ✅ Define routes where chatbot should be hidden
  const hiddenRoutes = [
    '/login',
    '/admin/dashboard',  // Only hide on dashboard, not all admin routes
    // '/'
    // Add more specific routes if needed
  ];

  // ✅ Check if current route should hide chatbot
  const shouldHideChatbot = () => {
    const currentPath = location.pathname;
    
    // Debug - console log to check current path
    console.log('Current path:', currentPath);
    
    // Hide on exact matches from hiddenRoutes array
    if (hiddenRoutes.includes(currentPath)) {
      return true;
    }
    
    // Also check if path ends with these routes (in case of trailing slashes)
    if (currentPath === '/login' || currentPath === '/login/') {
      return true;
    }
    
    if (currentPath === '/admin/dashboard' || currentPath === '/admin/dashboard/') {
      return true;
    }
    
    // Add more conditions here as needed in the future
    // Example: if (currentPath.startsWith('/some-private-page')) return true;
    
    return false;
  };

  // ✅ Auto-close chatbot when navigating to hidden routes
  useEffect(() => {
    if (shouldHideChatbot()) {
      setShowChat(false);
    }
  }, [location.pathname]);

  // ✅ Don't render chatbot on hidden routes
  if (shouldHideChatbot()) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {showChat && <Chatbot />}

      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="rounded-full shadow-lg transition"
        aria-label="Toggle Chatbot"
      >
        <div className="w-12 h-12">
          <Lottie animationData={botAnimation} loop={true} />
        </div>
      </button>
    </div>
  );
}

function App() {
  // ✅ Initialize AOS here
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
        {/* ✅ Chatbot ab router ke andar hai via AppWithChatbot component */}
      </ThemeProvider>
    </main>
  );
}

export default App;