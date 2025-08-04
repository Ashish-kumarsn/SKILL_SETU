import {
    Video,
    FileText,
    ClipboardList,
    FlaskConical,
    Users,
    Bell,
    Award,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    Crown
} from "lucide-react";
import { useState } from "react";

export default function PremiumCourseSidebar({
    activeTab = "lectures",
    setActiveTab = () => { },
    courseProgress = 75,
    course = {}
}) {
    // Helper function to check if a live class is currently active
    const isLiveNow = (liveClasses) => {
        if (!liveClasses || !Array.isArray(liveClasses)) return false;

        const now = new Date();
        return liveClasses.some(liveClass => {
            const startTime = new Date(liveClass.startTime);
            // Assuming each class lasts 2 hours (you can adjust this based on your needs)
            const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
            return now >= startTime && now <= endTime;
        });
    };

    // Helper function to check for upcoming classes (within next 30 minutes)
    const hasUpcomingClass = (liveClasses) => {
        if (!liveClasses || !Array.isArray(liveClasses)) return false;

        const now = new Date();
        const thirtyMinutesFromNow = new Date(now.getTime() + (30 * 60 * 1000));

        return liveClasses.some(liveClass => {
            const startTime = new Date(liveClass.startTime);
            return startTime > now && startTime <= thirtyMinutesFromNow;
        });
    };

    const tabs = [
        {
            id: "lectures",
            label: "Lectures",
            icon: <Video className="w-5 h-5" />,
            count: course?.lectures?.length || 0,
        },
        {
            id: "assignments",
            label: "Assignments & Notes",
            icon: <FileText className="w-5 h-5" />,
            count: course?.pdfs?.length || 0,
        },
        {
            id: "test",
            label: "Test",
            icon: <FlaskConical className="w-5 h-5" />,
            count: course?.quizzes?.length || 0,
        },
        {
            id: "live",
            label: "Live Classes",
            icon: <Users className="w-5 h-5" />,
            isLive: isLiveNow(course?.liveClasses),
            hasUpcoming: hasUpcomingClass(course?.liveClasses),
            count: course?.liveClasses?.length || 0,
        },
        {
            id: "notice",
            label: "Noticeboard",
            icon: <Bell className="w-5 h-5" />,
            hasNotification: course?.notices?.some(n => n.pinned) || false,
            count: course?.notices?.length || 0,
        },
        {
            id: "certificate",
            label: "Generate Certificate",
            icon: <Award className="w-5 h-5" />,
            isPremium: true,
            // Only show if course progress is 100%
            isAvailable: courseProgress >= 100
        }
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Side Edge Toggle - Show on mobile AND tablet */}
            <div className={`lg:hidden fixed left-0 top-1/2 -translate-y-1/2 ${isOpen ? 'z-[100000]' : 'z-[99999]'}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-8 h-16 bg-gradient-to-b from-purple-600 to-blue-600 rounded-r-xl shadow-xl text-white flex items-center justify-center transition-all duration-300 hover:w-10"
                >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
            </div>

            {/* Mobile Overlay - Show on mobile AND tablet */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Premium Sidebar - Highest Z-index when open */}
            <aside
                className={`
          fixed top-0 left-0 h-full transition-all duration-500 ease-out
          ${isOpen ? 'translate-x-0 z-[99999]' : '-translate-x-full lg:translate-x-0 z-[99997]'}
          lg:relative lg:translate-x-0 lg:z-auto
          w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          border-r border-white/10 backdrop-blur-xl
          shadow-2xl shadow-purple-500/10
          overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800
        `}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
                </div>

                <div className="relative h-full flex flex-col p-6 min-h-0">
                    {/* Header */}
                    <div className="mb-8 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">SkillSetu</h2>
                                <p className="text-white/60 text-xs">Unlock Your Potential</p>
                            </div>
                        </div>

                        {/* Enhanced Progress Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-white/80 text-sm font-medium">Course Progress</span>
                                <span className="text-purple-400 text-sm font-bold">{courseProgress}%</span>
                            </div>

                            <div className="relative">
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                                        style={{ width: `${courseProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                </div>

                                {courseProgress >= 100 && (
                                    <div className="absolute -top-1 -right-1">
                                        <Crown className="w-4 h-4 text-yellow-400 animate-bounce" />
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-white/50 text-center">
                                {courseProgress < 50 ? "Keep going! You're doing great" :
                                    courseProgress < 100 ? "Almost there! Stay focused" :
                                        "Congratulations! Course completed! 🎉"}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs - Scrollable */}
                    <nav className="flex-1 space-y-2 overflow-y-auto pr-2 min-h-0">
                        <div className="space-y-2">
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsOpen(false);
                                    }}
                                    disabled={tab.id === 'certificate' && !tab.isAvailable}
                                    className={`
                  group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl
                  transition-all duration-300 ease-out
                  ${tab.id === 'certificate' && !tab.isAvailable
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                        }
                  ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white hover:shadow-md'
                                        }
                `}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Active indicator */}
                                    {activeTab === tab.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-500 rounded-r-full" />
                                    )}

                                    {/* Icon with enhanced styling */}
                                    <div className={`
                  relative p-2 rounded-xl transition-all duration-300
                  ${activeTab === tab.id
                                            ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30'
                                            : 'group-hover:bg-white/10'
                                        }
                `}>
                                        {tab.icon}

                                        {/* Status indicators */}
                                        {tab.isLive && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-slate-900" />
                                        )}
                                        {tab.hasUpcoming && !tab.isLive && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse border-2 border-slate-900" />
                                        )}
                                        {tab.hasNotification && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse border-2 border-slate-900" />
                                        )}
                                        {tab.isPremium && (
                                            <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                                        )}
                                    </div>

                                    {/* Label and metadata */}
                                    <div className="flex-1 text-left">
                                        <span className="block text-sm font-medium">{tab.label}</span>
                                        {tab.count !== undefined && (
                                            <span className="text-xs text-white/50">{tab.count} items</span>
                                        )}
                                        {tab.isLive && (
                                            <span className="text-xs text-red-400 font-medium">● Live Now</span>
                                        )}
                                        {tab.hasUpcoming && !tab.isLive && (
                                            <span className="text-xs text-yellow-400 font-medium">● Starting Soon</span>
                                        )}
                                        {tab.id === 'certificate' && !tab.isAvailable && (
                                            <span className="text-xs text-white/40">Complete course first</span>
                                        )}
                                    </div>

                                    {/* Arrow indicator */}
                                    <ChevronRight className={`
                  w-4 h-4 transition-all duration-300
                  ${activeTab === tab.id ? 'text-purple-400 translate-x-1' : 'text-white/30 group-hover:text-white/60'}
                `} />

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300" />
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Premium Footer - Always visible */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex-shrink-0">
                        <div className="text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-purple-400">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {course?.creator.name || "Instructor"}
                                </span>
                            </div>

                            <div className="text-xs text-white/40">
                                SkillSetu LMS © 2025
                            </div>

                            <div className="text-xs text-white/30">
                                Bridging You to Brilliance ✨
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-r-3xl border border-white/5 pointer-events-none" />
            </aside>
        </>
    );
}