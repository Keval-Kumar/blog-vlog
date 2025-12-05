import React from "react";
import { NavLink} from "react-router"; // v6
import {useEffect,useState} from "react";
import "./Home.css";
import AOS from "aos";
import "aos/dist/aos.css";

import {
 Button
} from "@mui/material";

export default function Home() {
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
AOS.init({ duration: 1000, once: true });
}, []);

  return (
    <div className="page-root">
      {/* HERO */}
      <section className="hero-box" role="region" aria-label="Hero">
        {/* NAVBAR (overlay inside hero) */}
        <nav className="navbar" aria-label="Main navigation">
          <NavLink end to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          <NavLink to="/blog" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Blog
          </NavLink>

          <NavLink to="/vlog" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Vlog
          </NavLink>
          <NavLink to="/About" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            About
          </NavLink>
        </nav>

        {/* dark overlay for readability */}
        <div className="hero-overlay" />

        {/* Centered hero text + CTA */}
        <div className="hero-content">
          <h1 className="hero-title">Explore. Express. Evolve.</h1>
          <p className="hero-sub">
            Welcome to The Place where blog meets vlog.
          </p>

          {/* CTA: if you want to smooth-scroll, you can add JS or link to an anchor below */}
          <a className="cta-btn" href="#below">Explore Now</a>
        </div>
      </section>

      {/* content below hero — navbar will scroll away (not fixed) */}
      <section id="below" className="content-section">
<div className="aos-box" data-aos="zoom-in-up">
<h2>📝 My Blog</h2>
<p>
Explore creative ideas, lifestyle insights, and tech trends that inspire growth and imagination.
</p>
<NavLink to="/blog" style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontWeight: "bold",
          px: 3,
          py: 1.2,
          borderRadius: "10px",
          background: "#bf5ba1",
          "&:hover": {
            background: "#df8080",
            transform: "scale(1.05)",
          },
        }}
      >
         Blog
      </Button>
    </NavLink>
</div>



<div className="aos-box" data-aos="zoom-in-up" data-aos-delay="300">
<h2>🎥 My Vlog</h2>
<p>
Dive into visual stories, adventures, and experiences captured through the lens of passion and creativity.
</p>
<NavLink to="/vlog" style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontWeight: "bold",
          px: 3,
          py: 1.2,
          borderRadius: "10px",
          background: "#bf5ba1",
          "&:hover": {
            background: "#df8080",
            transform: "scale(1.05)",
          },
        }}
      >
         Vlog
      </Button>
    </NavLink>
</div>

<div className="aos-box" data-aos="zoom-in-up" data-aos-delay="300">
<h2>👤 About</h2>
<p>
Welcome to our Blog–Vlog space — a creative corner where ideas find a voice and moments find meaning.
</p>
<NavLink to="/About" style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontWeight: "bold",
          px: 3,
          py: 1.2,
          borderRadius: "10px",
          background: "#bf5ba1",
          "&:hover": {
            background: "#df8080",
            transform: "scale(1.05)",
          },
        }}
      >
         About
      </Button>
    </NavLink>
</div>

</section>

<section className="text-highlight" data-aos="fade-up" data-aos-delay="200">
  <div className="text-container">
    <h2>Every story deserves to be felt ✨</h2>
    <p>
      Through words and visuals, we share emotions that connect hearts and minds.
      Each blog and vlog you explore here reflects a journey of thought,
      creativity, and discovery.
    </p>
  </div>
</section>

<footer className="footer" data-aos="fade-up" data-aos-delay="200">
  <div className="footer-content">
    <div className="footer-nav">
      <NavLink to="/about" className="footer-link">About</NavLink>
      <NavLink to="/Blog" className="footer-link">Blog</NavLink>
      <NavLink to="/Vlog" className="footer-link">Vlog</NavLink>
      <NavLink to="/contact" className="footer-link">Contact</NavLink>
    </div>

    <div className="footer-social">
      <button
            className="footer-icon-btn"
            onClick={() => setShowEmail(!showEmail)}
          >
            <i className="fas fa-globe"></i>
          </button>
      <a href="https://linkedin.com/in/keval-kumar-m-a-keval-9a1b72361/" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin"></i>
      </a>
      <a href="https://github.com/Keval-Kumar" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github"></i>
      </a>
      <a href="https://www.instagram.com/keval_kumar_m_a/?igsh=MXdmMDVwMGJ5MHB" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-instagram"></i>
      </a>
    </div>

    {showEmail && (
          <p className="footer-email" data-aos="fade-down">
            📧 kevalkumarm.a321@gmail.com
          </p>
        )}

    <p className="footer-note">
      © {new Date().getFullYear()} KevalVerse — Crafted with ❤️ and creativity.
    </p>
  </div>
</footer>

    </div>
  );
}
