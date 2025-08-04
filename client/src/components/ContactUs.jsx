import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Typewriter } from 'react-simple-typewriter';
import emailjs from '@emailjs/browser';
import { useRef } from 'react';
const ContactUs = () => {
  const formRef = useRef(); 
  
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
const [uploadedFileUrl, setUploadedFileUrl] = useState('');



  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectDetails: "",
    budget: "",
    service: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
  setFormData({ ...formData, file: selectedFile });
};

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, service });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  let fileUrl = "";

  // 1. Upload to Cloudinary (if a file is selected)
  if (file) {
    const uploadData = new FormData();
    uploadData.append("file", file);
uploadData.append("upload_preset", "lms_contact");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dqfakzwyb/auto/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      fileUrl = data.secure_url;
      setUploadedFileUrl(fileUrl); // if you're using this in your UI
    } catch (error) {
      console.error("❌ Cloudinary upload failed:", error);
      alert("❌ File upload failed.");
      setSubmitting(false);
      return;
    }
  }

  // 2. Send Email via EmailJS
  try {
    await emailjs.send(
      "service_geh1r1r",
      "template_wns8tek",
      {
        from_name: formData.fullName,
        reply_to: formData.email,
        message: formData.projectDetails,
        service: formData.service,
        budget: formData.budget || "Not specified",
        file_link: fileUrl || "No file uploaded",
      },
      "gsdq_W45Ftt8pIkQ5"
    );

    alert("✅ Your message was sent successfully!");
    setFormData({
      fullName: "",
      email: "",
      projectDetails: "",
      service: "",
      budget: "",
    });
    setFile(null);
    setUploadedFileUrl("");
  } catch (err) {
    console.error("❌ EmailJS Error:", err);
    alert("❌ Failed to send the message.");
  }

  setSubmitting(false);
};



  return (
    


    <StyledWrapper >
      <div className="contact-container">
        {/* Background Stars Animations */}
        <div className="stars-layer-1" ></div>
        <div className="stars-layer-2" ></div>
        <div className="stars-layer-3" ></div>
        <div className="purple-glow-corner"></div>

        {/* Shooting Stars */}
        <div className="shooting-star-1"></div>
        <div className="shooting-star-2"></div>
        <div className="shooting-star-3"></div>

        {/* Left Section - Robot + Social Icons */}
        <div className="left-section">
          {/* Floating Robot */}

          <motion.div
            className="robot-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            
          >
            <motion.img
              src="https://uiverse.io/astronaut.png"
              alt="Astronaut"
              className="floating-robot"
              drag
              dragConstraints={{
                top: -window.innerHeight / 2,
                left: -window.innerWidth / 2,
                right: window.innerWidth / 2,
                bottom: window.innerHeight / 2
              }}
              dragMomentum={false}
              dragElastic={0.2}
              whileDrag={{
                scale: 0.9,
                zIndex: 1000,
                filter: "drop-shadow(0 0 30px rgba(155, 64, 252, 0.8))"
              }}
            />
          </motion.div>

          <motion.div
            className="skillsetu-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.4 }}
          >
            <h2 className="skillsetu-title">
              <Typewriter
                words={['Connect', 'Learn', 'Grow']}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={40}
                deleteSpeed={40}
                delaySpeed={1800}
              />
            </h2>
            <p className="skillsetu-subtitle">The Skillsetu Way</p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="social-icons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <a href="https://www.instagram.com/uiverse.io/" className="social-icon instagram" target="_blank"
              rel="noopener noreferrer">
              <svg width={24} height={25} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.0459 7.5H17.0559M3.0459 12.5C3.0459 9.986 3.0459 8.73 3.3999 7.72C3.71249 6.82657 4.22237 6.01507 4.89167 5.34577C5.56096 4.67647 6.37247 4.16659 7.2659 3.854C8.2759 3.5 9.5329 3.5 12.0459 3.5C14.5599 3.5 15.8159 3.5 16.8269 3.854C17.7202 4.16648 18.5317 4.67621 19.201 5.34533C19.8702 6.01445 20.3802 6.82576 20.6929 7.719C21.0459 8.729 21.0459 9.986 21.0459 12.5C21.0459 15.014 21.0459 16.27 20.6929 17.28C20.3803 18.1734 19.8704 18.9849 19.2011 19.6542C18.5318 20.3235 17.7203 20.8334 16.8269 21.146C15.8169 21.5 14.5599 21.5 12.0469 21.5C9.5329 21.5 8.2759 21.5 7.2659 21.146C6.37268 20.8336 5.56131 20.324 4.89202 19.6551C4.22274 18.9862 3.71274 18.1751 3.3999 17.282C3.0459 16.272 3.0459 15.015 3.0459 12.501V12.5ZM15.8239 11.94C15.9033 12.4387 15.8829 12.9481 15.7641 13.4389C15.6453 13.9296 15.4304 14.392 15.1317 14.7991C14.833 15.2063 14.4566 15.5501 14.0242 15.8108C13.5917 16.0715 13.1119 16.2439 12.6124 16.318C12.1129 16.392 11.6037 16.3663 11.1142 16.2422C10.6248 16.1182 10.1648 15.8983 9.76082 15.5953C9.35688 15.2923 9.01703 14.9123 8.76095 14.4771C8.50486 14.0419 8.33762 13.5602 8.2689 13.06C8.13201 12.0635 8.39375 11.0533 8.99727 10.2487C9.6008 9.44407 10.4974 8.91002 11.4923 8.76252C12.4873 8.61503 13.5002 8.86599 14.3112 9.46091C15.1222 10.0558 15.6658 10.9467 15.8239 11.94Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="https://twitter.com/uiverse_io" className="social-icon x" target="_blank"
              rel="noopener noreferrer">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8003 3L13.5823 10.105L19.9583 19.106C20.3923 19.719 20.6083 20.025 20.5983 20.28C20.594 20.3896 20.5657 20.4969 20.5154 20.5943C20.4651 20.6917 20.3941 20.777 20.3073 20.844C20.1043 21 19.7293 21 18.9793 21H17.2903C16.8353 21 16.6083 21 16.4003 20.939C16.2168 20.8847 16.0454 20.7957 15.8953 20.677C15.7253 20.544 15.5943 20.358 15.3313 19.987L10.6813 13.421L4.64033 4.894C4.20733 4.281 3.99033 3.975 4.00033 3.72C4.00478 3.61035 4.03323 3.50302 4.08368 3.40557C4.13414 3.30812 4.20536 3.22292 4.29233 3.156C4.49433 3 4.87033 3 5.62033 3H7.30833C7.76333 3 7.99033 3 8.19733 3.061C8.38119 3.1152 8.55295 3.20414 8.70333 3.323C8.87333 3.457 9.00433 3.642 9.26733 4.013L13.5833 10.105M4.05033 21L10.6823 13.421" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="https://wa.me/916200859744" className="social-icon whatsapp" target="_blank"
              rel="noopener noreferrer">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382C17.124 14.208 15.424 13.378 15.118 13.266C14.812 13.154 14.592 13.098 14.372 13.446C14.152 13.794 13.532 14.54 13.346 14.76C13.16 14.98 12.974 15.008 12.626 14.834C12.278 14.66 11.122 14.276 9.756 13.052C8.694 12.098 7.984 10.912 7.798 10.564C7.612 10.216 7.772 10.048 7.946 9.874C8.102 9.718 8.294 9.468 8.468 9.282C8.642 9.096 8.698 8.966 8.81 8.746C8.922 8.526 8.866 8.34 8.778 8.166C8.69 7.992 7.984 6.292 7.706 5.596C7.436 4.916 7.162 5.004 6.958 4.994C6.766 4.984 6.546 4.984 6.326 4.984C6.106 4.984 5.744 5.072 5.438 5.42C5.132 5.768 4.246 6.598 4.246 8.298C4.246 9.998 5.48 11.642 5.654 11.862C5.828 12.082 7.98 15.292 11.292 16.788C12.046 17.128 12.636 17.322 13.096 17.458C13.85 17.698 14.538 17.664 15.082 17.572C15.686 17.47 16.972 16.816 17.25 16.098C17.528 15.38 17.528 14.774 17.44 14.634C17.352 14.494 17.132 14.406 16.784 14.232L17.472 14.382ZM12.016 21.788C10.024 21.788 8.072 21.262 6.376 20.284L6 20.068L2.716 20.956L3.616 17.758L3.376 17.368C2.314 15.616 1.746 13.596 1.746 11.498C1.748 5.934 6.184 1.498 11.748 1.498C14.42 1.498 16.906 2.568 18.758 4.424C20.614 6.28 21.684 8.764 21.682 11.436C21.68 17.002 17.244 21.438 11.68 21.438L12.016 21.788Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a href="mailto:kaumatchobey@gmail.com" className="social-icon email" target="_blank"
              rel="noopener noreferrer">
              <svg width={25} height={25} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM20 8L12 13L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

          </motion.div>
        </div>




        {/* Right Section - Contact Form with Purple Glow */}
        <motion.div
          className="right-section "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <form ref={formRef} onSubmit={handleSubmit}></form>
          <form onSubmit={handleSubmit} className="contact-form">

            <h2 className="form-title">
              Let's Work Together 💼
            </h2>

            {/* Services */}
            <div className="form-group">
              <label className="form-label">Service</label>
              <div className="service-buttons">
                {["Project", "Doubt", "Development", "Consulting"].map((svc) => (
                  <button
                    type="button"
                    key={svc}
                    className={`service-btn ${formData.service === svc ? 'active' : ''}`}
                    onClick={() => handleServiceSelect(svc)}
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name & Email */}
            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Full name*"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="form-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Project Details */}
            <textarea
              name="projectDetails"
              placeholder="Project details*"
              value={formData.projectDetails}
              onChange={handleChange}
              required
              rows={4}
              className="form-textarea"
            />

            {/* File Upload */}
            <div className="form-group">
              <label className="form-label">Attach a file (optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
               disabled={submitting}
              type="submit"
              className="submit-btn"
            >
              {submitting ? "Sending..." : "Submit Inquiry"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
.contact-container {
  position: relative;
  width: 100%;
  min-height: 100vh;

  /* ✅ Premium dark glass background */
  background: rgba(10, 10, 25, 0.6); /* Slightly darker */
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);

  /* ✅ Subtle glowing glass border and deep shadow */
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.03),
    0 0 0 0.5px rgba(255, 255, 255, 0.03);

  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 2rem;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;

  /* Optional: smooth fade-in */
  animation: fadeIn 1s ease-out;
}

/* Fade-in animation for premium feel */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}




  /* Background Stars Animations - Spread across full page */
  .stars-layer-1::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
      opacity: 0.8;
  filter: blur(0.5px);
    box-shadow: 220px 118px #fff, 280px 176px #fff, 40px 50px #fff,
      60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff,
      520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff,
      800px 100px #fff, 950px 200px #fff, 1100px 150px #fff, 1200px 300px #fff,
      1300px 50px #fff, 1400px 250px #fff, 900px 400px #fff;
    z-index: 1;
    animation: 1s glowing-stars linear alternate infinite;
    animation-delay: 0s;
  }

  .stars-layer-2::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow: 140px 20px #fff, 425px 20px #fff, 70px 120px #fff, 20px 130px #fff,
      110px 80px #fff, 280px 80px #fff, 250px 350px #fff, 280px 230px #fff,
      220px 190px #fff, 450px 100px #fff, 380px 80px #fff, 520px 50px #fff,
      750px 300px #fff, 850px 150px #fff, 1000px 250px #fff, 1150px 100px #fff;
    z-index: 1;
    animation: 1s glowing-stars linear alternate infinite;
    animation-delay: 0.4s;
  }

  .stars-layer-3::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow: 490px 330px #fff, 420px 300px #fff, 320px 280px #fff,
      380px 350px #fff, 546px 170px #fff, 420px 180px #fff, 370px 150px #fff,
      200px 250px #fff, 80px 20px #fff, 190px 50px #fff, 270px 20px #fff,
      120px 230px #fff, 350px -1px #fff, 150px 369px #fff, 650px 200px #fff,
      750px 350px #fff, 950px 50px #fff, 1050px 300px #fff;
    z-index: 1;
    animation: 1s glowing-stars linear alternate infinite;
    animation-delay: 0.8s;
  }

  /* Shooting Stars */
  .shooting-star-1::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 20%;
    rotate: -45deg;
    width: 5em;
    height: 1px;
    background: linear-gradient(90deg, #ffffff, transparent);
    animation: 4s shootingStar ease-in-out infinite;
    animation-delay: 1s;
    z-index: 1;
  }

  .shooting-star-2::before {
    content: "";
    position: absolute;
    top: 30%;
    right: 30%;
    rotate: -45deg;
    width: 5em;
    height: 1px;
    background: linear-gradient(90deg, #ffffff, transparent);
    animation: 4s shootingStar ease-in-out infinite;
    animation-delay: 3s;
    z-index: 1;
  }

  .shooting-star-3::before {
    content: "";
    position: absolute;
    top: 60%;
    left: 10%;
    rotate: -45deg;
    width: 5em;
    height: 1px;
    background: linear-gradient(90deg, #ffffff, transparent);
    animation: 4s shootingStar ease-in-out infinite;
    animation-delay: 5s;
    z-index: 1;
  }

  /* Left Section */
  .left-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: relative;
    z-index: 2;
  }

.robot-container {
  margin-bottom: 4rem;
  position: relative;
  z-index: 10; /* High z-index for dragging */
}

.floating-robot {
  width: 16em;
  height: auto;
  animation: floating 8s ease-in-out infinite;
  cursor: grab;
  z-index: 5;
  filter: drop-shadow(0 0 20px rgba(155, 64, 252, 0.3));
  user-select: none; /* Prevent text selection */
  -webkit-user-drag: none; /* Prevent default image drag */
}

  .floating-robot:hover {
    cursor: grab;
  }

.floating-robot:active {
  cursor: grabbing;
  // animation-play-state: paused; /* Pause animation while dragging */
}

  /* Social Icons */
 /* SkillSetu Section Styles - FIXED */
.skillsetu-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 3rem;
  z-index: 3;
}

.skillsetu-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #9333ea, #7e22ce, #eb4ec7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
  min-height: 60px; /* Prevent layout shift during typewriter */
  display: flex;
  align-items: center;
  justify-content: center;
}

.skillsetu-subtitle {
  font-size: 1.1rem;
  color: #e2e2e2;
  font-weight: 400;
  opacity: 0.9;
  letter-spacing: 0.3px;
}

  /* Social Icons */
  .social-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    z-index: 3;
  }

  .social-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    transition: 0.4s ease-in-out;
  }

  .social-icon::after {
    content: "";
    position: absolute;
    width: 0.8em;
    height: 0.8em;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0px 0px 10px rgba(233, 233, 233, 0.5),
      0px 0px 10px rgba(192, 192, 192, 0.5);
    border-radius: 50%;
    z-index: -1;
    transition: 0.3s ease-in-out;
  }

  .social-icon svg {
    width: 24px;
    height: 24px;
    transition: 0.3s ease-in-out;
    z-index: 2;
      fill: none;
  stroke: currentColor;
  stroke-width: 2;
  }

  .social-icon svg path {
    stroke: #808080;
    transition: stroke 0.3s ease, filter 0.3s ease;

  }

  .social-icon.instagram:hover svg path {
    stroke: #cc39a4;
  }

  .social-icon.x:hover svg path {
    stroke: black;
  }

  .social-icon.whatsapp:hover svg path {
    stroke: #25D366;
    shadow-[0_0_15px_#25D366]
  }

  .social-icon.email:hover svg path {
    stroke: #EA4335;
    shadow-[0_0_15px_#EA4335]
  }

  .social-icon:hover svg {
    scale: 1.4;
  }

  .social-icon:hover::after {
    scale: 3;
  }

  /* Right Section */
  .right-section {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding-left: 2rem;
    z-index: 2;
    position: relative;
  }

.contact-form {
  position: relative;
  background: rgba(255, 255, 255, 0.06); /* glassy white tint */
  backdrop-filter: blur(15px); /* strong blur */
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08); /* semi-white border */
  border-radius: 16px; /* smooth corners */
  padding: 1.5rem; 
  width: 100%;
  max-width: 500px;
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.05),
    0 0 30px rgba(255, 0, 255, 0.1); /* Soft glow *//* soft glow */
  color: white; /* ensure text is visible */
  z-index: 20;
  animation: slideIn 2s ease forwards;
  transform: translateX(100px);
  opacity: 0;
}

/* Animation to match the motion effect */
@keyframes slideIn {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}


  /* Purple Glow Effect on Form */
.purple-glow-corner {
  position: absolute;
  top: -100px;  /* Half hidden above */
  left: -100px; /* Half hidden on left */
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #f9f9fb;
  opacity: 0.6;
  box-shadow: 0px 0px 150px rgba(193, 119, 241, 0.8),
    0px 0px 120px rgba(135, 42, 211, 0.8),
    inset #9b40fc 0px 0px 60px -15px;
  z-index: 1;
  animation: pulse-glow 4s ease-in-out infinite;
  filter: blur(1px);
  overflow: hidden;
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(to right, #9333ea, #7e22ce);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  text-align: left;
  letter-spacing: 0.5px;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-label {
  display: block;
  color: #e2e2e2;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.service-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.service-btn {
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: #e5e5e5;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  backdrop-filter: blur(6px);
}

.service-btn:hover {
  border-color: #8379ff;
  background: rgba(131, 121, 255, 0.05);
  box-shadow: 0 0 8px rgba(131, 121, 255, 0.3);
}

.service-btn.active {
  background: linear-gradient(135deg, #eb4ec7, #8379ff);
  color: #0f0f0f;
  border: none;
  box-shadow: 0 0 12px rgba(235, 78, 199, 0.5);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.form-row .form-input {
  width: 100%;
  box-sizing: border-box;
}

.form-input,
.form-textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.6rem;
  color: #f1f1f1;
  font-family: inherit;
  transition: all 0.3s ease;
  width: 100%;
  height: 38px;
  box-sizing: border-box;
  backdrop-filter: blur(4px);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border: 1px solid #eb4ec7;
  box-shadow: 0 0 10px rgba(235, 78, 199, 0.6);
  background: rgba(255, 255, 255, 0.04);
}

.form-textarea {
  height: auto;
  min-height: 90px;
  padding: 0.75rem;
  resize: vertical;
  margin-bottom: 0.75rem;
}

.file-input {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed #8379ff;
  color: #ddd;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.file-input:hover {
  border-color: #eb4ec7;
  background: rgba(235, 78, 199, 0.05);
}

.submit-btn {
  width: 100%;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(to right, #f81ce5, #7928ca);
  box-shadow: 0 0 16px rgba(248, 28, 229, 0.35);
  color: white;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  // transition: all 0.3s ease;
  margin-top: 0.3rem; 
}

.submit-btn:hover {
  // transform: scale(1.03);
  // box-shadow: 0 0 24px rgba(248, 28, 229, 0.6);
}


  /* Animations */
  


@keyframes floating {
  0% {
    transform: translateX(0em) translateY(0em) rotate(0deg) scale(1);
  }
  12.5% {
    transform: translateY(-1.5em) translateX(-1em) rotate(-3deg) scale(1.02);
  }
  25% {
    transform: translateY(-2.5em) translateX(-2em) rotate(-6deg) scale(1.05);
  }
  37.5% {
    transform: translateY(-1em) translateX(-2.5em) rotate(-2deg) scale(1.03);
  }
  50% {
    transform: translateY(1em) translateX(-1.5em) rotate(2deg) scale(1);
  }
  62.5% {
    transform: translateY(2em) translateX(0.5em) rotate(4deg) scale(0.98);
  }
  75% {
    transform: translateY(-1.5em) translateX(2em) rotate(7deg) scale(1.04);
  }
  87.5% {
    transform: translateY(-0.5em) translateX(1em) rotate(3deg) scale(1.01);
  }
  100% {
    transform: translateX(0em) translateY(0em) rotate(0deg) scale(1);
  }
}

  @keyframes glowing-stars {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes shootingStar {
    0% {
      transform: translateX(0) translateY(0);
      opacity: 1;
    }
    50% {
      transform: translateX(-55em) translateY(0);
      opacity: 1;
    }
    70% {
      transform: translateX(-70em) translateY(0);
      opacity: 0;
    }
    100% {
      transform: translateX(0) translateY(0);
      opacity: 0;
    }
  }

  @keyframes pulse-glow {
    0% {
      box-shadow: 0px 0px 100px rgba(193, 119, 241, 0.8),
        0px 0px 100px rgba(135, 42, 211, 0.8),
        inset #9b40fc 0px 0px 40px -12px;
    }
    50% {
      box-shadow: 0px 0px 150px rgba(193, 119, 241, 1),
        0px 0px 150px rgba(135, 42, 211, 1),
        inset #9b40fc 0px 0px 50px -8px;
    }
    100% {
      box-shadow: 0px 0px 100px rgba(193, 119, 241, 0.8),
        0px 0px 100px rgba(135, 42, 211, 0.8),
        inset #9b40fc 0px 0px 40px -12px;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .contact-container {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 1rem;
    }

    .left-section {
      height: auto;
      padding: 2rem 0;
    }

    .floating-robot {
      width: 15em;
    }

    .robot-container {
      margin-bottom: 2rem;
    }

    .right-section {
      height: auto;
      padding-left: 0;
    }

    .contact-form {
      padding: 2rem;
      max-width: 100%;
    }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .service-buttons {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .service-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

    .form-title {
      font-size: 1.5rem;
      text-align: center;
    }

    .social-icons {
      gap: 1.5rem;
    }

    .social-icon {
      width: 40px;
      height: 40px;
    }

    .service-buttons {
      justify-content: center;
    }

    /* Adjust stars for mobile */
    .stars-layer-1::before,
    .stars-layer-2::before,
    .stars-layer-3::before {
      box-shadow: 220px 118px #fff, 280px 176px #fff, 40px 50px #fff,
        60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff,
        50px 350px #fff, 10px 230px #fff;
    }
        
  }
`;

export default ContactUs;