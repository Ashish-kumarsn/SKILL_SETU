import { motion } from "framer-motion";
import { CheckCircle, Star, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyCourseButton from "@/components/BuyCourseButton";

const CourseFinalCTA = ({ courseId, purchased, handleContinueCourse }) => {
  return (
    <div className="relative mt-16 py-12 px-6 sm:px-8">
      {/* Main Container matching your theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-slate-800/50 via-slate-900/70 to-indigo-950/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden"
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent" />
        
        {/* Floating accent */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-2xl"
        />

        <div className="relative z-10 py-8 px-6 sm:px-8">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-amber-200 text-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium">Premium Learning Experience</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Main Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Master Your Skills?
            </h2>
            
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Join thousands of learners and get lifetime access with certification upon completion.
            </p>

            {/* Compact Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex justify-center items-center gap-6 mb-8 flex-wrap text-sm"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Certificate Included</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Expert Support</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              {purchased ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleContinueCourse}
                    className="px-8 py-3 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-l font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500/20"
                  >
                    Continue Learning
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur opacity-75" />
                  <div className="relative">
                    <BuyCourseButton courseId={courseId} />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Trust indicators - compact */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-6 flex items-center justify-center gap-4 text-slate-400 text-xs"
            >
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                30-Day Guarantee
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                10K+ Students
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                Industry Recognized
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseFinalCTA;