import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
// Note: useNavigate and useSwipeable removed for Claude artifact compatibility
// In your actual implementation, restore these imports
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


const categories = [
  {
    title: "Web Development",
    subtitle: "Frontend & Backend",
    bgGradient: "from-purple-300 via-pink-200 to-purple-100",
    icon: "🌐"
  },
  {
    title: "Data Science",
    subtitle: "Insight & Analysis",
    bgGradient: "from-blue-300 via-indigo-200 to-blue-100",
    icon: "📊"
  },
  {
    title: "Machine Learning",
    subtitle: "Predictive Models",
    bgGradient: "from-[#D8B4FE] via-[#A78BFA] to-[#7C3AED]",
    icon: "🤖"
  },
  {
    title: "AI",
    subtitle: "Smart Intelligence",
    bgGradient: "from-pink-300 via-purple-200 to-indigo-100",
    icon: "🧠"
  },
  {
    title: "Mobile Development",
    subtitle: "iOS & Android",
    bgGradient: "from-green-300 via-emerald-200 to-teal-100",
    icon: "📱"
  },
  {
    title: "Cloud Computing",
    subtitle: "Scalable Solutions",
    bgGradient: "from-cyan-300 via-sky-200 to-blue-100",
    icon: "☁️"
  },
  {
    title: "Cybersecurity",
    subtitle: "Secure Your Systems",
    bgGradient: "from-red-300 via-rose-200 to-pink-100",
    icon: "🛡️"
  },
  {
    title: "DevOps & CI/CD",
    subtitle: "Automation & Integration",
    bgGradient: "from-amber-300 via-yellow-200 to-lime-100",
    icon: "⚙️"
  }


];

const CategoryCard = ({ title, subtitle, bgGradient, icon, onClick }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-[32px] p-8 cursor-pointer transition-all duration-300 hover:scale-[1.03] shadow-2xl group`}
    style={{
      background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
      backdropFilter: `blur(24px)`,
      WebkitBackdropFilter: `blur(24px)`,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1)
      `,
      transition: 'all 0.3s ease-in-out'
    }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-90`}></div>
    <div className="absolute inset-0">
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl" />
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl" />
    </div>

    <div className="relative z-10 flex justify-between items-start h-full">
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
          {title}
        </h3>
        <p className="text-white/70 text-sm font-medium mb-6 group-hover:text-white/80 transition-colors">
          {subtitle}
        </p>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
          <ArrowRight className="w-5 h-5 text-gray-700 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white/40 backdrop-blur-sm animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm animate-pulse delay-300"></div>
      </div>
    </div>
    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white/30 animate-pulse delay-700"></div>
    <div className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full bg-white/25 animate-pulse delay-1000"></div>
  </motion.div>
);

const CourseCategories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  // const navigate = useNavigate(); // Restore this in your actual implementation
  const itemsPerPage = 4;
  const totalSlides = Math.ceil(categories.length / itemsPerPage);

  const handleClick = (category) => {
    navigate(`/course/search?query=${encodeURIComponent(category)}`);
  };


  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => {
      const nextIndex = prev + itemsPerPage;
      // If we've reached or exceeded the end, loop back to the beginning
      return nextIndex >= categories.length ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerPage;
      if (newIndex < 0) {
        const remainder = categories.length % itemsPerPage;
        return remainder === 0
          ? categories.length - itemsPerPage
          : categories.length - remainder;
      }
      return newIndex;
    });
  };


  const visibleCategories = (() => {
    const sliced = categories.slice(currentIndex, currentIndex + itemsPerPage);
    const deficit = itemsPerPage - sliced.length;
    if (deficit > 0) {
      return [...sliced, ...Array(deficit).fill(null)];
    }
    return sliced;
  })();


  // const swipeHandlers = useSwipeable({
  //   onSwipedLeft: nextSlide,
  //   onSwipedRight: prevSlide,
  //   trackTouch: true,
  //   trackMouse: true
  // });

  // Premium animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 10 : -10,
      filter: "blur(8px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -10 : 10,
      filter: "blur(8px)",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    })
  };

  const slideTransition = {
    type: "spring",
    stiffness: 200,
    damping: 28,
    mass: 0.8
  };


  return (
    <div className="min-h-screen py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-200/20 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-pink-200/20 blur-3xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 rounded-full bg-indigo-200/20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Build the skills that stand out
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated categories and discover new opportunities to grow your expertise
          </p>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="absolute left-[-48px] top-1/2  z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>

          <div className="max-w-4xl mx-auto perspective-1000">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {visibleCategories.map((category, index) =>
                  category ? (
                    <CategoryCard
                      key={`${category.title}-${currentIndex}-${index}`}
                      {...category}
                      onClick={() => handleClick(category.title)}
                    />
                  ) : (
                    <div
                      key={`placeholder-${currentIndex}-${index}`}
                      className="rounded-[32px] p-8 opacity-0 pointer-events-none"
                    />
                  )
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="absolute right-[-48px] top-1/2  z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300"
          >
            <ArrowRight className="w-6 h-6 text-gray-700" />
          </motion.button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${Math.floor(currentIndex / itemsPerPage) === index ? "bg-purple-500" : "bg-gray-300"
                }`}
              onClick={() => {
                setDirection(index > Math.floor(currentIndex / itemsPerPage) ? 1 : -1);
                setCurrentIndex(index * itemsPerPage);
              }}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Choose your path and start learning today
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCategories;