import {motion} from "framer-motion"
const QuickPrompts = ({ runQuickPrompt }) => {
  const prompts = [
    { icon: "⚡", text: "How to Contact to admin" },
    { icon: "💻", text: "Tell me about My Enrolled Courses" },
    { icon: "📘", text: "Explain quantum physics simply" },
    { icon: "🌟", text: "Write a short poem about stars" },
    { icon: "🎲", text: " Surprise Me" },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
      {prompts.map(({ icon, text }, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => runQuickPrompt(text)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 shadow-sm
            bg-white/70 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:shadow-md"
        >
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium">{text}</span>
        </motion.button>
      ))}
    </div>
  );
};
export default QuickPrompts;
