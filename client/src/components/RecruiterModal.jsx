import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoggedIn } from "@/features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X, Loader2 } from "lucide-react";

const RECRUITER_EMAIL = "Ankush@gmail.com";
const RECRUITER_PASSWORD = "Ankush123";

const RecruiterModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleRecruiterLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: RECRUITER_EMAIL,
            password: RECRUITER_PASSWORD,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      dispatch(userLoggedIn({ user: data.user }));
      onClose();
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleNo = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
        style={{
          backgroundColor: "rgba(10, 14, 39, 0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="relative w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0d1128 0%, #111827 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.1)",
          }}
        >
          {/* Top gradient line matching site theme */}
          <div
            className="h-[2px] w-full"
            style={{
              background: "linear-gradient(90deg, #a855f7, #ec4899, #3b82f6)",
            }}
          />

          {/* Close */}
          <button
            onClick={handleNo}
            className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="px-8 py-9 flex flex-col items-center text-center">
            {/* Icon */}
            <div
              className="mb-5 w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
            >
              <Briefcase size={24} className="text-purple-400" />
            </div>

            {/* Heading */}
            <h2
              className="text-xl font-bold text-white mb-2 tracking-wide"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Are you a Recruiter?
            </h2>

            <p className="text-sm text-white/40 mb-7 leading-relaxed max-w-[240px]">
              Explore SkillSetu instantly — no signup required.
            </p>

            {error && (
              <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg w-full">
                {error}
              </p>
            )}

            {/* Yes Button */}
            <button
              onClick={handleRecruiterLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white mb-3 flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "linear-gradient(90deg, #a855f7, #ec4899)",
                boxShadow: "0 4px 20px rgba(168,85,247,0.3)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Logging you in...
                </>
              ) : (
                "Yes, I'm a Recruiter →"
              )}
            </button>

            {/* No Button */}
            <button
              onClick={handleNo}
              className="w-full py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              No, continue as visitor
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecruiterModal;