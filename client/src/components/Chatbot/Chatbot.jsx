import React, { useState, useRef, useEffect } from "react";
import {
  useAskGeminiMutation,
  useGetChatHistoryQuery,
  useClearChatHistoryMutation
} from "../../features/api/geminiApi";

import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import {
  FiSend, FiMoon, FiSun, FiCopy, FiCheck, FiChevronDown,
  FiChevronUp, FiUser, FiMaximize2, FiMinimize2
} from "react-icons/fi";
import { MdSmartToy } from "react-icons/md";
import { SiGooglegemini } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import TypeMode from "./TypeMode";
import QuickPrompts from "./QuickPrompts";


const Chatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [askGemini, { isLoading }] = useAskGeminiMutation();
  const { data: historyData, refetch: refetchHistory } = useGetChatHistoryQuery();
  const [clearHistory] = useClearChatHistoryMutation();

  const responseRef = useRef(null);

  const isDark = document.documentElement.classList.contains("dark");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [collapsedBlocks, setCollapsedBlocks] = useState(new Set());
  const [isListening, setIsListening] = useState(false);
  const [lastInputViaMic, setLastInputViaMic] = useState(false);

  const runQuickPrompt = (text) => {
    const finalText = text === "✨ Surprise Me"
      ? getRandomPrompt()
      : text;

    setPrompt(finalText);
    setTimeout(() => {
      handleAsk();
    }, 50);
  };

  const getRandomPrompt = () => {
    const surpriseOptions = [
      "Tell me a fun fact",
      "Give me a productivity hack",
      "What's a Netflix thriller?",
      "Write a birthday wish for a friend",
      "Give me a book recommendation"
    ];
    return surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
  };



  const recognitionRef = useRef(null);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setPrompt(transcript); // Live display
      setLastInputViaMic(true); // Mic was used
    };

    recognitionRef.current = recognition;
  }, []);

  // Load chat history
  useEffect(() => {
    if (historyData && historyData.length > 0) {
      setConversation(historyData);
    }
  }, [historyData]);



  // Auto-scroll and syntax highlighting
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
    Prism.highlightAll();
  }, [conversation]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };


  // contact prompt setup 
  const checkForPredefinedResponse = (input) => {
    const lowerInput = input.toLowerCase();

    const contactKeywords = [
      "contact admin",
      "admin contact",
      "how to contact",
      "email admin",
      "whatsapp admin",
      "reach admin",
      "talk to admin",
      "support contact"
    ];

    return contactKeywords.some(keyword => lowerInput.includes(keyword));
  };



  const handleAsk = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    // Add the current user prompt to conversation first
    const newUserMsg = { type: "user", text: cleanPrompt };
    const updatedConversation = [...conversation, newUserMsg];
    setConversation(updatedConversation);
    setLastInputViaMic(false); // Reset for manual typing

    setPrompt("");
    // Check for predefined keywords like 'contact admin'
    if (checkForPredefinedResponse(cleanPrompt)) {
      const contactReply = `📞 You can contact the admin in the contact section at the bottom of the landing page. 

You can also WhatsApp at **+91 6200859744** or email at **kaumatchobey@gmail.com**.`;

      setConversation(prev => [
        ...prev,
        { type: "bot", text: contactReply, timestamp: new Date() }
      ]);
      return;
    }


    try {
      // Build the entire conversation as context including the new prompt
      const fullConversation = updatedConversation
        .map(msg => `${msg.type === "user" ? "User" : "Bot"}: ${msg.text}`)
        .join("\n");

      // Persona injection
      const personaPrompt = `
You are a friendly and supportive AI friend named Genie  😄. Your responses should be short, casual, and feel natural — like a human buddy texting. Use light and appropriate emojis (don't overdo), avoid overly long responses, and sound fun and engaging.Take user name only when neccessary.

Below is the conversation so far:
${fullConversation}

User: ${cleanPrompt}
Genie:
`.trim();


      // Send the full conversation + persona prompt as finalPrompt
      const res = await askGemini({ prompt: personaPrompt }).unwrap();
      refetchHistory();
      const finalResponse = typeof res.response === "string"
        ? res.response
        : JSON.stringify(res.response, null, 2);

      // Add bot response to conversation
      setConversation(prev => [
        ...prev,
        { type: "bot", text: finalResponse, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error("Gemini error:", error);
      setConversation(prev => [...prev, { type: "bot", text: "❌ Genie failed to respond." }]);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleCodeBlock = (index) => {
    const newCollapsed = new Set(collapsedBlocks);
    newCollapsed.has(index) ? newCollapsed.delete(index) : newCollapsed.add(index);
    setCollapsedBlocks(newCollapsed);
  };

  const renderMessage = (msg, msgIdx) => {
    const parts = msg.text.split(/(```[\s\S]*?```)/);

    return parts.map((part, idx) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          const language = match[1] || "text";
          const code = match[2];
          const blockId = `${msgIdx}-${idx}`;
          const isCollapsed = collapsedBlocks.has(blockId);

          return (
            <div
              key={idx}
              className={`mt-6 rounded-3xl border-2 overflow-hidden shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark
                ? 'border-purple-500/30 bg-gradient-to-br from-gray-800/80 to-gray-900/60'
                : 'border-orange-300/40 bg-gradient-to-br from-white/95 to-orange-50/30'
                }`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between px-5 py-3 border-b backdrop-blur-md ${isDark
                  ? 'bg-gradient-to-r from-purple-600/30 to-orange-500/20 border-purple-500/20'
                  : 'bg-gradient-to-r from-purple-100/60 to-orange-100/50 border-orange-300/40'
                  }`}
              >
                <span
                  className={`text-sm font-semibold tracking-wider uppercase ${isDark ? 'text-purple-300' : 'text-orange-600'
                    }`}
                >
                  {language.toUpperCase()}
                </span>

                <div className="flex items-center gap-2">
                  {/* Collapse/Expand */}
                  <button
                    onClick={() => toggleCodeBlock(blockId)}
                    className={`p-2 rounded-xl transition-all duration-200 backdrop-blur-sm ${isDark
                      ? 'hover:bg-purple-500/10 text-purple-300 hover:text-white'
                      : 'hover:bg-orange-100 text-orange-600 hover:text-orange-700'
                      }`}
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {isCollapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
                  </button>

                  {/* Copy */}
                  <button
                    onClick={() => copyToClipboard(code, blockId)}
                    className={`p-2 rounded-xl transition-all duration-200 backdrop-blur-sm ${isDark
                      ? 'hover:bg-purple-500/10 text-purple-300 hover:text-white'
                      : 'hover:bg-orange-100 text-orange-600 hover:text-orange-700'
                      }`}
                    title="Copy to Clipboard"
                  >
                    {copiedIndex === blockId ? (
                      <FiCheck size={16} className="text-green-400" />
                    ) : (
                      <FiCopy size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <pre
                      className={`whitespace-pre-wrap break-words text-sm p-5 overflow-x-auto font-mono max-w-full text-left ${isDark ? 'text-purple-100' : 'text-gray-800'}`}
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      <code className={`language-${language}`}>{code}</code>
                    </pre>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          );
        }
      }

      return part.trim() ? <ReactMarkdown key={idx}>{part}</ReactMarkdown> : null;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const themeClasses = {
    // Background Container
    container: isDark
      ? 'bg-gray-900'
      : 'bg-gray-50',

    // Card Wrapper
    card: isDark
      ? 'bg-gray-800 border border-gray-700 shadow-lg'
      : 'bg-white border border-gray-200 shadow-lg',

    // Header Bar
    header: isDark
      ? 'border-gray-700 bg-gray-800'
      : 'border-gray-200 bg-white',

    // Main Text Color
    text: isDark ? 'text-white' : 'text-gray-900',

    // Muted Subtitle Text
    mutedText: isDark ? 'text-gray-400' : 'text-gray-600',

    // User Message Bubble
    userMessage: isDark
      ? 'bg-orange-600 text-white'
      : 'bg-orange-500 text-white',

    // Bot Message Bubble
    botMessage: isDark
      ? 'bg-gray-700 text-gray-100'
      : 'bg-gray-100 text-gray-900',

    // Input Area (Textarea)
    input: isDark
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500',

    // Buttons (Mic / Send)
    button: isDark
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-600',

    // Send Button (Orange theme)
    sendButton: 'bg-orange-500 hover:bg-orange-600 text-white'
  };


  return (
    <div className={`min-h-screen pt-24 transition-all duration-500 ${themeClasses.container} p-4 relative overflow-hidden`}>


      <div className={`mx-auto transition-all duration-500 px-2 ${isExpanded ? 'max-w-4xl' : 'max-w-2xl'} w-full relative z-10`}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl overflow-hidden ${themeClasses.card}`}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'
                    }`}>
                    <SiGooglegemini className={`text-xl ${isDark ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Genie Chatbot
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Powered by SkillSetu</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-2 rounded-lg transition-colors ${isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                    }`}
                  title={isExpanded ? 'Minimize' : 'Expand'}
                >
                  {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                </motion.button>



                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    try {
                      await clearHistory();
                      setConversation([]);
                    } catch (error) {
                      console.error("Failed to clear history:", error);
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors ${isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                    }`}
                  title="Clear Chat"
                >
                  🗑️
                </motion.button>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col h-[70vh]">
            <div ref={responseRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversation.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'
                    }`}>
                    <SiGooglegemini className={`text-2xl ${isDark ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                  </div>
                  <h2 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    Start your conversation with Genie ✨                  </h2>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ask anything - from coding help to creative ideas
                  </p>
                  {/* Suggested Prompts */}
                  <QuickPrompts runQuickPrompt={runQuickPrompt} />


                </motion.div>
              ) : (
                conversation.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.type === "bot" && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-orange-500' : 'bg-orange-500'
                        }`}>
                        <MdSmartToy className="text-white text-sm" />
                      </div>
                    )}

                    <div className={`max-w-[75%] rounded-lg px-4 py-3 ${msg.type === "user"
                      ? (isDark ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white')
                      : (isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900')
                      }`}>
                      {msg.type === "bot" ? (
                        <div>
                          {renderMessage(msg, idx)}
                          {msg.timestamp && (
                            <p className={`text-xs mt-2 opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>

                    {msg.type === "user" && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-600' : 'bg-gray-400'
                        }`}>
                        <FiUser className="text-white text-sm" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-orange-500' : 'bg-orange-500'
                    }`}>
                    <MdSmartToy className="text-white text-sm" />
                  </div>
                  <div className={`rounded-lg px-4 py-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-orange-400' : 'bg-orange-500'
                        }`}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-orange-400' : 'bg-orange-500'
                        }`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-orange-400' : 'bg-orange-500'
                        }`} style={{ animationDelay: '0.2s' }}></div>
                      <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Genie is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key="type-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TypeMode
                    prompt={prompt}
                    setPrompt={setPrompt}
                    handleAsk={handleAsk}
                    handleMicClick={handleMicClick}
                    isListening={isListening}
                    isLoading={isLoading}
                    isDark={isDark}
                    handleKeyPress={handleKeyPress}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;