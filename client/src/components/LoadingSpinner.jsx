import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/lottie/loading.json'; // adjust path if needed

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="w-52 h-52">
        <Lottie animationData={loadingAnimation} loop autoplay />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingSpinner;
