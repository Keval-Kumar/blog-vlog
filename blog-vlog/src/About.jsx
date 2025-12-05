import React, { useEffect } from "react";
import { NavLink } from "react-router";
import Button from "@mui/material/Button";
import AOS from "aos";
import "aos/dist/aos.css";
import "./About.css";
import myPhoto from "./myphoto.jpg";


export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      mirror: false,      // don't mirror animations when scrolling past
      anchorPlacement: "top-bottom"
    });
    AOS.refresh();
  }, []);

  const founder = {
    name: "Keval Kumar M A",
    title: "Founder & Creative Director",
    location: "India",
    photo: myPhoto, // place in public/ or change to imported asset
    bio:
      "Every vlog and blog here is a small story — made to teach, inspire, and spark new ideas. I believe in learning by doing, and sharing what I learn along the way.",
  };

  const boxes = [
    {
      key: "founder",
      title: "About the Founder",
      body: founder.bio,
      action: null,
    },
    // {

  ];

  return (
    <div className="about-page-root">
      {/* HERO — full viewport */}
      <header className="about-hero" role="banner" aria-label="About hero">
        <div className="about-hero-inner" data-aos="zoom-out" data-aos-delay="80">
          <h1 className="about-hero-title" data-aos="fade-up" data-aos-delay="180">
            A Creative Space for Curious Souls
            From Thoughts to Things — Let’s Create!
          </h1>
          <p className="about-hero-sub" data-aos="fade-up" data-aos-delay="320">
            This platform began as a small idea — to document what I learn, create, and explore
          </p>
          <p className="about-hero-sub" data-aos="fade-up" data-aos-delay="320">
            share real stories, honest lessons, and helpful guides — because knowledge feels best when shared.
          </p>
          <div className="about-hero-ctas" data-aos="fade-up" data-aos-delay="440">
            <button
              className="cta-primary"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              Explore
            </button>
            <NavLink to="/vlog" style={{ textDecoration: "none" }}>
              <button className="cta-secondary">Latest Vlog</button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* BOXES — animated with staggered delays */}
      <main className="about-boxes" role="main">
        <div className="boxes-grid">
          {boxes.map((b, i) => (
            <article
              key={b.key}
              className={`box-card ${b.key === "founder" ? "tilt-enabled" : ""}`}
              data-aos={b.key === "founder" ? "fade-up" : "fade-up"}
              data-aos-delay={180 + i * 120} /* stagger */
              data-aos-duration={b.key === "founder" ? 920 : 700}
              data-aos-easing="ease-out-cubic"
              /* add an extra custom class for the CSS animation */
              data-aos-once="true"
              /* and add our CSS animation class for the pop in */
              data-aos-class="aos-pop3d" /* note: AOS doesn't automatically apply this — see below */
              tabIndex={0}
            >
              {b.key === "founder" ? (
                <div className="founder-card">
                  <div className="founder-photo-wrap">
                    <img
                      src={founder.photo}
                      alt={`${founder.name}`}
                      className="founder-photo"
                      onError={(e) => {
                        e.currentTarget.src =
                          myPhoto;
                      }}
                    />
                  </div>
                  <div className="founder-meta">
                    <h3 className="box-title">{founder.name}</h3>
                    <p className="box-sub">{founder.title} • {founder.location}</p>
                    <p className="box-body">{b.body}</p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="box-title">{b.title}</h3>
                  <p className="box-body">{b.body}</p>
                  {b.action && (
                    <NavLink to={b.action.to} style={{ textDecoration: "none" }}>
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          px: 3,
                          py: 0.9,
                          borderRadius: "10px",
                          background: "#bf5ba1",
                          "&:hover": { background: "#df8080" },
                        }}
                      >
                        {b.action.label}
                      </Button>
                    </NavLink>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      </main>
      <footer className="site-footer" role="contentinfo" aria-label="Site footer">
        {/* decorative SVG wave (top) */}
        <div className="footer-wave" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave-svg">
            <path d="M0,0 C300,120 900,0 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="footer-inner">
          <div className="footer-grid">
            {/* BRAND */}
            <div
              className="footer-col brand"
              data-aos="fade-up"
              data-aos-delay="80"
              data-aos-duration="900"
            >
              <h3 className="footer-logo">Keval<span className="logo-accent">.</span></h3>
              <p className="footer-tag">
                Where ideas turn into stories, and stories turn into inspiration.
                Exploring creativity through stories, visuals, and hands-on learning.
              </p>
              <p className="footer-small">Made in India • © {new Date().getFullYear()}</p>
            </div>

            {/* QUICK LINKS */}
            <nav
              className="footer-col links"
              aria-label="Quick links"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="900"
            >
              <h3>Quick links</h3>
              <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/blog">Blog</NavLink></li>
                <li><NavLink to="/vlog">Vlog</NavLink></li>
                <NavLink
                  to="/about"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  About
                </NavLink>

              </ul>
            </nav>

            {/* EXPLORE */}
            <div
              className="footer-col explore"
              data-aos="fade-up"
              data-aos-delay="240"
              data-aos-duration="900"
            >
            </div>

            {/* NEWSLETTER + SOCIAL */}
            <div
              className="footer-col newsletter"
              data-aos="fade-up"
              data-aos-delay="320"
              data-aos-duration="900"
            >
              <h4>Stay in the loop</h4>
              <p className="newsletter-text">Monthly shortlists — no spam. Practical tips & new vlogs.</p>

              <form
                className="newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  // replace with your subscribe handler
                  alert("Thanks — subscribe handler not wired in this demo.");
                }}
                aria-label="Newsletter signup"
              >
              </form>
            </div>
          </div>
        </div>

        {/* floating decorative blobs */}
        <div className="footer-blobs" aria-hidden="true">
          <span className="blob b1"></span>
          <span className="blob b2"></span>
          <span className="blob b3"></span>
        </div>
      </footer>

    </div>




  );
}
