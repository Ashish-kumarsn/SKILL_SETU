import React from "react";
import { FiSend, FiMic } from "react-icons/fi";
import { motion } from "framer-motion";

const TypeMode = ({
  prompt,
  setPrompt,
  handleAsk,
  handleMicClick,
  isListening,
  isLoading,
  isDark = true, // Adding isDark prop for theme consistency
  handleKeyPress
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-end">
      {/* Input Area */}
      <div className="flex-1 relative">
        <textarea
          className={`w-full px-4 py-3 rounded-lg border resize-none transition-all duration-300 focus:outline-none focus:ring-2 ${
            isListening 
              ? "ring-orange-400/50 border-orange-400" 
              : "focus:ring-orange-500/20 focus:border-orange-500"
          } ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
          }`}
          rows="2"
          placeholder={isListening ? "Listening..." : "Type your message or use voice..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        
        {/* Voice indicator */}
        {isListening && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Recording
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Mic Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMicClick}
          disabled={isLoading}
          title={isListening ? "Stop Listening" : "Start Voice Input"}
          className={`px-4 py-3 rounded-lg transition-all duration-200 ${
            isListening 
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
              : isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <FiMic size={18} />
        </motion.button>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAsk}
          disabled={isLoading || !prompt.trim()}
          title="Send Message"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiSend size={18} />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default TypeMode;