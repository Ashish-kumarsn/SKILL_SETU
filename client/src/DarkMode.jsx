import React, { useEffect, useState } from "react";
import "./dark-toggle.css";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div>
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        checked={isDark}
        onChange={toggleTheme}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <FaMoon className="fas fa-moon" />
        <FaSun className="fas fa-sun" />
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default DarkMode;
