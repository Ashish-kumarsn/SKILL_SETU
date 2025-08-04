import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop'; // ✅ Import ScrollToTop
import ParticlesBackground from '@/components/ui/ParticleBackground'; // ✅ Import Particles

const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0A0E27] text-black overflow-hidden z-10">
      {/* ✅ Global background */}
      <ParticlesBackground id="particles-js" />

      {/* ✅ Router-aware scroll fix */}
      <ScrollToTop />

      {/* ✅ Page content */}
      <div className="relative z-10">
        <Navbar />
        <div className="mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
