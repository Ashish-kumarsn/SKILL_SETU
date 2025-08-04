import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import 'swiper/css';
import img1 from '@/assets/slide1.jpg';
import img2 from '@/assets/slide2.jpg';
import img3 from '@/assets/slide3.jpg';

const slides = [
  {
    id: 1,
    image: img1,
    title: 'The "Katamaran"',
    desc: 'Self-paced modules with lifetime access make your skills grow forever',
  },
  {
    id: 2,
    image: img2,
    title: 'The "Futuristic Book"',
    desc: 'Interactive skill-based courses with real-world projects and guided growth',
  },
  {
    id: 3,
    image: img3,
    title: 'The "AI GENIE"',
    desc: "Unlock your true potential with SkillSetu's built-in AI mentor",
  },
];

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const transX = useTransform(mouseX, [0, 1920], [5, -5]);
  const transY = useTransform(mouseY, [0, 1080], [5, -5]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 70); // ✅ 70ms x 100 steps = 7000ms total

    return () => clearInterval(intervalRef.current);
  }, [activeIndex]);


  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <div className="relative w-11/12 h-5/6 rounded-xl shadow-2xl overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          speed={1300}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id} className="relative overflow-hidden">
              {index === activeIndex ? (
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    x: transX,
                    y: transY,
                  }}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6.5, ease: [0.25, 0.1, 0.25, 1] }}
                />

              ) : (
                <div
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  className="w-full h-full"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Circular Timer - Top Right */}
        <div className="absolute top-6 right-6 z-30">
          <svg width="36" height="36" className="-rotate-90 drop-shadow-md">
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#ddd" />
              </linearGradient>
            </defs>

            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.1 }}
              strokeDasharray={circumference}
            />
          </svg>
        </div>

        {/* Text overlay bottom right */}
        <div className="absolute bottom-10 right-10 max-w-sm z-20">
          <motion.div
            key={`text-${activeIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/30 text-white"
          >
            <h2 className="text-3xl font-extrabold mb-2">{slides[activeIndex].title}</h2>
            <p className="text-sm">{slides[activeIndex].desc}</p>
            <button className="mt-4 px-4 py-2 rounded-lg border border-white text-white hover:bg-white/20 transition font-semibold">
              Discover More
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default HeroSlider;
