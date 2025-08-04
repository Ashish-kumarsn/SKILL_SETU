import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import blobAnimation from "../assets/lottie/Blob.json";
import "./Dice.css";

const testimonials = [
  {
    id: 1,
    name: "Ankush Singh",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "SkillSetu helped me land my dream job. Their courses are comprehensive with real-world projects that prepared me for industry challenges.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Web Developer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "The instructors are highly experienced and supportive. The learning journey was smooth and engaging throughout.",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Data Analyst",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "The quizzes and live classes boosted my confidence for interviews. I gained practical skills that matter in the real world.",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    role: "AI Enthusiast",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review:
      "I loved the AI tools section, gave me exposure to cutting-edge technologies and industry-level practices.",
  },
];

const Testimonial = () => {
  const [selected, setSelected] = useState(testimonials[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      rollDice();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const rollDice = () => {
    const randX = (Math.floor(Math.random() * 4) + 1) * 90;
    const randY = (Math.floor(Math.random() * 4) + 1) * 90;

    setDiceRotation((prev) => ({
      x: prev.x + randX,
      y: prev.y + randY,
    }));

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      const newIndex = (currentIndex + 1) % testimonials.length;
      setSelected(testimonials[newIndex]);
      setCurrentIndex(newIndex);
    }, 600);
  };

  const handleTestimonialClick = (testimonial, index) => {
    setSelected(testimonial);
    setCurrentIndex(index);
  };

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
      <div className="absolute top-32 left-20 w-8 h-4 bg-green-300 rounded-full opacity-40"></div>
      <div className="absolute top-20 left-32 w-6 h-6 bg-green-200 rounded-full opacity-30"></div>
      <div className="absolute top-40 right-40 w-4 h-4 bg-purple-300 rounded-full opacity-50"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            <span className="text-purple-600 dark:text-purple-400">
              Success Stories
            </span>{" "}
            That Inspire ✨
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl order-2 lg:order-1">
  {testimonials.map((testimonial, index) => (
    <div
      key={testimonial.id}
      role="button"
      tabIndex={0}
      onClick={() => handleTestimonialClick(testimonial, index)}
      onKeyDown={(e) =>
        e.key === "Enter" && handleTestimonialClick(testimonial, index)
      }
      className={`
        cursor-pointer rounded-2xl p-6 backdrop-blur-md border transition-transform duration-300 ease-out
        transform-gpu will-change-transform
        ${selected.id === testimonial.id
          ? "scale-105 border-purple-300 bg-white/20 dark:bg-white/10 shadow-lg animate-pulse-selected"
          : "hover:scale-105 hover:shadow-xl opacity-80 hover:opacity-100 bg-white/10 dark:bg-white/5 border-white/20 hover:border-purple-200 dark:hover:border-purple-400"
        }`}
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((x - centerX) / centerX) * -5;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
      }}
    >
      <div className="flex items-start gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 dark:border-purple-400"
        />
        <div>
          <h3 className="text-lg font-bold text-white">
            {testimonial.name}
          </h3>
          <p className="text-sm text-purple-300 mb-3">
            {testimonial.role}
          </p>
          <p className="text-white/80 text-sm leading-relaxed">
            "{testimonial.review.slice(0, 100)}..."
          </p>
        </div>
      </div>
    </div>
  ))}
</div>



          {/* Featured Testimonial */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-[500px] h-[500px]">
              {/* Blob */}
              <div className="absolute inset-0 opacity-40 rounded-full overflow-hidden z-0">
                <Lottie
                  animationData={blobAnimation}
                  loop
                  className="w-full h-full"
                />
              </div>

              {/* Testimonial Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-10">
  <img
    src={selected.image}
    alt={selected.name}
    className="w-20 h-20 rounded-full mb-6 border-4 border-white/80 shadow-lg"
  />
  <p className="text-white/90 text-lg leading-relaxed mb-6 italic max-w-sm">
    "{selected.review}"
  </p>
  <h3 className="text-2xl font-bold text-white/95">
    {selected.name}
  </h3>
  <p className="text-white/80 font-medium">
    {selected.role}
  </p>
</div>


              {/* Dice */}
              <button
                className="dice-circle-container"
                onClick={rollDice}
                aria-label="Roll Dice"
              >
                <div className="dice-circle-boundary">
                  <div
                    className="dice-container"
                    style={{
                      transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg)`,
                    }}
                  >
                    <div className="face one">
                      <span className="pip"></span>
                    </div>
                    <div className="face two">
                      <span className="pip"></span>
                      <span className="pip"></span>
                    </div>
                    <div className="face three">
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                    </div>
                    <div className="face four">
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                    </div>
                    <div className="face five">
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                    </div>
                    <div className="face six">
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                      <span className="pip"></span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Dice Sound */}
              <audio
                ref={audioRef}
                src="/sounds/dice-roll.mp3"
                preload="auto"
              ></audio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
