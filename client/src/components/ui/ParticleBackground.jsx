import React, { useEffect, useRef } from 'react';

const ParticlesBackground = ({ id = 'particles-js', config = '/particles-config.json' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Remove if already exists
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = id;
    div.style.position = 'fixed'; // ✅ covers full screen regardless of scroll
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.zIndex = '0'; // ✅ behind all content
    div.style.pointerEvents = 'auto'; // ✅ this allows mouse events to reach canvas
    // ✅ Fix: allow interaction

    containerRef.current?.appendChild(div);

    if (window.particlesJS) {
      window.particlesJS.load(id, config, () => {
        console.log(`✅ Particles loaded in ${id}`);
      });
    }
  }, [id, config]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }} // ✅ Allow canvas to sit at back
    />
  );
};

export default ParticlesBackground;
