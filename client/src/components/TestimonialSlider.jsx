import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Alper Tornaci',
    title: 'CEO Pixel Fox | Horizon',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
  },
  {
    name: 'Melten Karahan',
    title: 'Dev Pixel Fox | Horizon',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
  },
  {
    name: 'Chris Arnold',
    title: 'CTO Pixel Fox | Horizon',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    quote:
      'This service transformed how we build and ship software. Absolutely recommend it!',
  },
];

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const next = () => {
    setIndex((prev) => (prev + 2 >= testimonials.length ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 2 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="w-full px-6 py-20 bg-gradient-to-br from-gray-950 to-gray-900 text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12"
      >
        {/* Left Section */}
        <div className="lg:w-1/2 space-y-5">
          <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider">
            Testimonial
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Don’t Just Take Our Word for It
          </h2>
          <p className="text-gray-400 text-base max-w-md">
            See what our satisfied clients have to say about our services and how we’ve made a difference.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button
              aria-label="Previous testimonial"
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-gray-800 transition"
            >
              <FaArrowLeft />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={next}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 hover:bg-pink-700 transition"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.slice(index, index + 2).map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="relative bg-gray-800 rounded-2xl p-6 pt-14 shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <img
                  src={item.image}
                  alt={`Photo of ${item.name}`}
                  className="w-16 h-16 rounded-full border-4 border-gray-900 object-cover shadow-lg"
                />
              </div>
              <div className="text-center mt-4">
                <div className="text-3xl text-pink-500 font-serif mb-3">“</div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.quote}
                </p>
                <h4 className="mt-4 font-bold text-white">{item.name}</h4>
                <p className="text-sm text-gray-400">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialSlider;