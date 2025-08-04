import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import HeroSlider from '@/components/HeroSlider';
import { Search } from 'lucide-react';

const HeroSection = () => {

  const suggestionList = [
    "Web Development",
    "Data Structures",
    "React",
    "Python",
    "AI Tools",
    "Aptitude",
    "Machine Learning",
    "Frontend",
    "Backend",
    "HTML",
    "JavaScript",
    "DSA",
  ];

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(-1); // for keyboard navigation


  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery('');
  };

  const controls = useAnimation();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });

  const setRefs = (node) => {
    inViewRef(node);
  };

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(`/course/search?query=${suggestion}`);
  };
  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <div className="relative min-h-screen overflow-hidden font-poppins ">
      <HeroSlider />

      <section ref={setRefs} className="relative min-h-screen flex flex-col justify-center items-center text-white px-4">

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.5 }}
            animate={controls}
            variants={{
              visible: {
                opacity: 0.7,
                scaleY: 1,
                transition: { duration: 2 + i * 0.3, ease: 'easeOut' }
              }
            }}
            className="absolute top-0 left-1/2 w-0.5 bg-gradient-to-b from-purple-500/50 via-purple-400/20 to-transparent h-[400px] rounded-full blur-2xl"
            style={{
              transform: `translateX(${(i - 1) * 30}px)`,
              transformOrigin: 'top center',
              filter: 'blur(20px)',
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 0.4,
              scale: 1,
              transition: { duration: 2, ease: 'easeOut', delay: 1 }
            }
          }}
          className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 opacity-30 rounded-full blur-3xl pointer-events-none"
        />

        {/* The top-left partial glowing circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={controls}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-[-50px] left-[-50px] w-[400px] h-[400px] bg-[#7F56D9] blur-3xl rounded-[120%] pointer-events-none z-0"
        />


        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="flex space-x-1 mb-6 mt-[-50px]"
        >
          {['S', 'k', 'i', 'l', 'l', ' ', 'S', 'e', 't', 'u'].map((letter, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: {
                  opacity: 0,
                  x: i < 5 ? -50 : i === 5 ? 0 : 50,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
              }}
              className="font-extrabold text-7xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-text-shine"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-white text-xl md:text-2xl font-medium text-center mb-6 max-w-2xl"
        >
          Bridging You to Brilliance ✨
        </motion.p>

        <div ref={inputRef} className="relative w-full md:max-w-xl mb-6">

          <form
            onSubmit={searchHandler}
            className="w-[90%] md:max-w-xl mb-6 bg-white/10 backdrop-blur-xl rounded-xl flex items-center overflow-hidden shadow-xl relative z-10 border border-white/20"
          >
            <div className="pl-4">
              <Search className="text-white opacity-70" />
            </div>
            <input
              type="text"
              value={searchQuery}
              ref={inputRef}
              onChange={(e) => {
                const input = e.target.value;
                setSearchQuery(input);

                if (input.trim() === '') {
                  setFilteredSuggestions([]);
                  setShowSuggestions(false);
                  return;
                }

                const filtered = suggestionList.filter((item) =>
                  item.toLowerCase().includes(input.toLowerCase())
                );
                setFilteredSuggestions(filtered);
                setShowSuggestions(true);
                setActiveIndex(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  setActiveIndex((prevIndex) =>
                    prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
                  );
                } else if (e.key === 'ArrowUp') {
                  setActiveIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
                  );
                } else if (e.key === 'Enter') {
                  if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
                    handleSuggestionClick(filteredSuggestions[activeIndex]);
                  } else {
                    searchHandler(e); // normal search
                  }
                }
              }}

              onFocus={() => {
                if (filteredSuggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="What do you need?"
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none text-lg"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3.5 text-white font-semibold hover:opacity-90 transition"
            >
              Search course
            </button>
          </form>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="w-[90%] md:max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl mt-[-16px] z-20 relative shadow-lg">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 text-white cursor-pointer transition ${index === activeIndex ? 'bg-white/30' : 'hover:bg-white/20'
                    }`}
                >
                  {suggestion}
                </li>
              ))}

            </ul>
          )}
        </div>


        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {['Web Dev', 'DSA', 'AI Tools', 'Aptitude'].map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/course/search?query=${cat}`)}
              className="px-4 py-1.5 bg-white/10 text-white text-sm rounded-full border border-white/20 hover:bg-white/20 transition backdrop-blur-sm"
            >
              {cat}
            </button>
          ))}
        </div>

        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="mt-6 px-6 py-2 bg-white bg-opacity-10 backdrop-blur-md text-white border border-white/20 hover:bg-opacity-20 transition rounded-s"
        >
          Explore Courses
        </Button>
      </section>
    </div>
  );
};

export default HeroSection;
