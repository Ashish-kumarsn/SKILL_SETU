import React, { useState, useEffect } from 'react';
import './CourseHighlightsSection.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSpring, animated } from '@react-spring/web';

const CourseHighlightsSection = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const stripHTML = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const shortDescription =
    description?.length > 180
      ? `${stripHTML(description).substring(0, 180)}...`
      : stripHTML(description);

  // Animated percentage spring
  const props = useSpring({
    from: { val: 0 },
    to: { val: 95 },
    delay: 1500,
    config: { duration: 2500 },
  });

  return (
    <div className="w-full py-12 px-4 md:px-10 lg:px-20 flex flex-col lg:flex-row gap-12 items-start justify-between bg-gradient-to-br from-gray-300/40 to-gray-400/20">
      {/* Left Section */}
      <div className="flex-1" data-aos="fade-right">
        <h2 className="text-2xl font-bold mb-4">About this course</h2>

        {showFullText ? (
          <div
            className="text-gray-800 font-serifDisplay leading-relaxed transition-all duration-500 ease-in-out"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className="text-gray-800 leading-relaxed line-clamp-5">
            {shortDescription}
          </p>
        )}

        {description?.length > 220 && (
          <span
  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#6A0DAD] relative cursor-pointer transition-all duration-300 group"
  onClick={() => setShowFullText((prev) => !prev)}
>
  {showFullText ? 'See Less' : 'See More'}
  <svg
    className={`w-4 h-4 transform transition-transform duration-300 ${
      showFullText ? '-rotate-90' : 'rotate-90'
    } group-hover:translate-x-0.5`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>

  {/* Glowing underline */}
  <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#6A0DAD] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full blur-[1px]" />
</span>


        )}
      </div>

      {/* Right Section - Testimonial Card */}
      <div
        className="relative bg-white/30 backdrop-blur-md text-black rounded-xl p-8 w-full md:w-[300px] text-center shadow-md border border-white/20 ring-1 ring-black/5 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-br after:from-purple-400/20 after:to-indigo-400/10 after:blur-2xl after:z-[-1]"
        data-aos="fade-left"
      >
        <animated.h1
          className="text-6xl font-extrabold mb-4"
        >
          {props.val.to((val) => `${Math.floor(val)}%`)}
        </animated.h1>

        <p className="text-lg text-gray-800 mb-6">
          Of our customers would recommend us
        </p>

        <button className="bg-black text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-black transition duration-300 shadow hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" />
          </svg>
          Talk To Us
        </button>
      </div>
    </div>
  );
};

export default CourseHighlightsSection;
