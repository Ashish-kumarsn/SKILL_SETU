import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaLinkedin, FaDownload } from "react-icons/fa";
import verifiedIcon from '@/assets/verified.png';


const CertificateShowcase = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 py-20 px-6 lg:px-20 rounded-3xl shadow-2xl border border-purple-500/10"
        >
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
                {/* Left Content */}
                <div className="text-center lg:text-left max-w-xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 bg-gradient-to-r from-white via-purple-300 to-pink-300 text-transparent bg-clip-text"
                    >
                        Proudly showcase your earned certificates
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-300 mb-8"
                    >
                        Skill Setu has awarded over <strong className="text-purple-300">1200+ certificates</strong> to dedicated learners like you.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex justify-center lg:justify-start gap-4"
                    >
                        <button className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700  text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300   hover:-translate-y-0.5">
                            <FaDownload className="group-hover:scale-110 transition-transform" />
                            Download
                        </button>
                        <button className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-purple-400/30 text-purple-300 hover:bg-white/20 hover:border-purple-400/50 font-medium px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                            <FaLinkedin className="group-hover:scale-110 transition-transform" />
                            Share on LinkedIn
                        </button>
                    </motion.div>
                </div>

                {/* Right Visuals - Enhanced Certificate Stack */}
                <div className="relative w-80 h-52 lg:w-[400px] lg:h-[260px] group">
                    {/* Background Certificate - Third Layer */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="absolute top-6 left-6 w-full h-full rounded-2xl bg-slate-700/30 backdrop-blur-sm shadow-xl z-0 border border-purple-500/10"
                    />

                    {/* Middle Certificate - Second Layer */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="absolute top-3 left-3 w-full h-full rounded-2xl bg-slate-600/50 backdrop-blur-md shadow-2xl z-10 border border-purple-400/20"
                    />

                    {/* Main Certificate - Front Layer */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.3
                        }}
                        className="relative z-20 w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white p-6 shadow-2xl shadow-purple-500/30 flex flex-col justify-between border border-purple-400/20 overflow-hidden"
                    >
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-1">UI Design Certificate</h3>
                            <p className="text-sm text-white/80">Awarded on July 2025</p>
                        </div>

                        <div className="relative z-10 flex justify-between items-end mt-6">
                            <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-2">
                                <img
                                    src={verifiedIcon}
                                    alt="Verified Icon"
                                    className="w-5 h-5 object-contain"
                                />
                                Verified
                            </div>
                            <div className="text-3xl">🎓</div>
                        </div>

                        {/* Animated floating element */}
                        <motion.div
                            className="absolute top-4 right-4 bg-white/20 rounded-full p-2 backdrop-blur-sm border border-white/20"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                        >
                            📜
                        </motion.div>

                        {/* Subtle corner decoration */}
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-white/20 rounded-bl-2xl"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-white/20 rounded-tr-2xl"></div>
                    </motion.div>

                    {/* Ambient glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 blur-xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                </div>
            </div>
        </section>
    );
};

export default CertificateShowcase;