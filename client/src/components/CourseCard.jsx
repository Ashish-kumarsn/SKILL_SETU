import React from "react";

const CourseCard = ({
  image,        // background image
  logo,         // course logo (profile image)
  name,         // instructor or course creator
  title,        // course title (subtitle)
  tools,        // icons like 'Tools', etc.
  rating,
  duration,
  rate,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="w-[380px] bg-white rounded-[24px] overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Background Header */}
      <div className="relative h-[160px] w-full">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        
        {/* Bookmark Icon */}
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path 
                d="M17 3H7C6.44772 3 6 3.44772 6 4V20L12 17L18 20V4C18 3.44772 17.5523 3 17 3Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Profile Image - positioned to overlap */}
        <div className="absolute -bottom-8 left-6">
          <div className="w-16 h-16 rounded-full border-3 border-white bg-white p-0.5 shadow-lg">
            <img
              src={logo}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-12 px-6 pb-6">
        {/* Name and Title */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500 truncate">{title}</p>
        </div>

        {/* Tools Section */}
        <div className="flex items-center gap-2 mb-6">
          {tools && tools.length > 0 ? (
            <div className="flex items-center gap-2">
              {tools.map((tool, idx) => (
                <img
                  key={idx}
                  src={tool}
                  alt="tool"
                  className="h-5 w-5 bg-white rounded-full p-[2px] border"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-blue-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.71 8.71C22.1 8.32 22.1 7.69 21.71 7.3L16.71 2.3C16.32 1.91 15.69 1.91 15.3 2.3L13.71 3.89L20.11 10.29L21.71 8.71ZM3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="currentColor"/>
              </svg>
              <span className="text-sm font-medium">Tools</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium text-gray-900">{rating}</span>
            <span className="text-xs text-gray-400 ml-1">rating</span>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">{duration}</div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{rate}</div>
            <div className="text-xs text-gray-400">rate</div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-black text-white py-3 px-6 rounded-full text-sm font-medium transition-all duration-200 hover:bg-gray-800 hover:shadow-md">
          Get in touch
        </button>
      </div>
    </div>
  );
};

export default CourseCard; 