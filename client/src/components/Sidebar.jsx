import {
    Home,
    Layers,
    BadgeCheck,
    BookOpen,
    MessageCircle,
    Send,
    ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const links = [
    { id: "home", icon: <Home />, label: "Home" },
    { id: "categories", icon: <Layers />, label: "Categories" },
    { id: "certificates", icon: <BadgeCheck />, label: "Certificates" },
    { id: "testimonials", icon: <MessageCircle />, label: "Testimonials" },
    { id: "courses", icon: <BookOpen />, label: "Courses" },
    { id: "contact", icon: <Send />, label: "Contact" },
];

const inactivityTimeout = 5000;

const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
};

const Sidebar2 = () => {
    const [activeId, setActiveId] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isManualScroll, setIsManualScroll] = useState(false);
    const hideTimer = useRef(null);

    const scrollTo = (id) => {
        setActiveId(id);
        setIsManualScroll(true);

        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });

        // Disable auto detection during smooth scroll
        setTimeout(() => {
            setIsManualScroll(false);
        }, 1000);
    };

    const resetInactivityTimer = () => {
        setIsVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            setIsVisible(false);
        }, inactivityTimeout);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isManualScroll) return;

            const sectionThreshold = window.innerHeight / 2;

            const offsets = links.map((link) => {
                const el = document.getElementById(link.id);
                if (!el) return { id: link.id, distance: Infinity };

                const rect = el.getBoundingClientRect();
                return {
                    id: link.id,
                    distance: Math.abs(rect.top - sectionThreshold),
                    visible: rect.top <= sectionThreshold && rect.bottom >= 0,
                };
            });

            const visibleSections = offsets
                .filter((s) => s.visible)
                .sort((a, b) => a.distance - b.distance);

            if (visibleSections.length > 0) {
                setActiveId(visibleSections[0].id);
            }
        };

        const throttledScroll = throttle(handleScroll, 100);
        window.addEventListener("scroll", throttledScroll);
        return () => window.removeEventListener("scroll", throttledScroll);
    }, [isManualScroll]);

    useEffect(() => {
        resetInactivityTimer();

        const activityEvents = ["mousemove", "scroll", "touchstart"];
        activityEvents.forEach((event) =>
            window.addEventListener(event, resetInactivityTimer)
        );

        return () => {
            activityEvents.forEach((event) =>
                window.removeEventListener(event, resetInactivityTimer)
            );
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, []);

    return (
        <>
            {/* Sidebar */}
            <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:flex fixed top-[30%] left-4 -translate-y-1/2 z-50 flex-col gap-4 px-3 py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-visible"
            >
                {links.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => scrollTo(link.id)}
                        aria-label={link.label}
                        className={`group relative flex items-center justify-center w-10 h-10 cursor-pointer transition hover:scale-110 rounded-xl focus:outline-none ${
                            activeId === link.id
                                ? "bg-white/20 ring-2 ring-blue-300"
                                : ""
                        }`}
                    >
                        <div className="text-white group-hover:text-blue-300 transition">
                            {link.icon}
                        </div>
                        <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap bg-neutral-900 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-50">
                            {link.label}
                        </span>
                    </button>
                ))}
            </motion.div>

           
        </>
    );
};

export default Sidebar2;
