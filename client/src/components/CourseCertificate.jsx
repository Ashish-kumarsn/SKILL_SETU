import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import certificatePreview from "../assets/certificate-preview.png";

const CourseCertificate = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-md p-6 md:p-10 shadow-xl"
    >
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* 📄 Certificate Image */}
        <div className="w-full lg:w-[45%]">
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg transition-transform hover:scale-[1.015]">
            <img
              src={certificatePreview}
              alt="Certificate Preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* 📋 Description */}
        <div className="w-full lg:w-[55%] space-y-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            🎓 Get Certified on Completion
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Finish this course and unlock a verifiable certificate of
            achievement. Showcase your expertise on LinkedIn, portfolio, or with potential employers.
          </p>

          <div className="space-y-2 pt-2 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <BadgeCheck size={18} className="text-green-400" />
              Downloadable & Print-Ready PDF
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck size={18} className="text-green-400" />
              Verified on LinkedIn, Email & Resume
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck size={18} className="text-green-400" />
              Signed by Instructor
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCertificate;
