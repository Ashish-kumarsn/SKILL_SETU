import React, { useEffect, useState } from 'react';

const LiveNowButton = ({ liveClasses }) => {
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    const checkLiveStatus = () => {
      const now = new Date();
      const active = liveClasses?.find((liveClass) => {
        return new Date(liveClass.startTime) <= now;
      });

      if (active) {
        setActiveLink(active.meetingLink);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 10000);
    return () => clearInterval(interval);
  }, [liveClasses]);

  if (!activeLink) return null;

  return (
    
<div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
<p>we will imeplement our own live class feature till now i am using the api </p>
      <a
        href={activeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="relative">
          {/* Multi-layer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur-md opacity-40"></div>

          {/* Main Button Container */}
          <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 rounded-2xl p-0.5 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">

            {/* Inner Button */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl px-6 py-4 flex items-center space-x-3 backdrop-blur-sm">
              
              {/* Animated Live Indicator */}
              <div className="relative flex items-center">
                <div className="w-3.5 h-3.5 bg-white rounded-full animate-ping absolute"></div>
                <div className="w-3.5 h-3.5 bg-white rounded-full relative animate-pulse"></div>
              </div>

              {/* Button Text */}
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-wider">LIVE NOW</span>
                <span className="text-red-100 text-xs font-medium -mt-1">Join Now</span>
              </div>

              {/* Arrow Icon */}
              <div className="relative overflow-hidden">
                <svg 
                  className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-all duration-300 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 -right-3 w-1 h-1 bg-pink-300 rounded-full animate-ping opacity-70"></div>
        </div>
      </a>
    </div>
  );
};

export default LiveNowButton;
