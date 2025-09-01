import React from 'react';
import './common.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="container">
      <div className="nav-brand">
        <a href="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CinemaHub</span>
        </a>
      </div>
      <button className="nav-toggle" aria-label="Toggle navigation">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      <div className="nav-links">
        <a href="/" className="nav-link active">Home</a>
        <a href="/discover" className="nav-link">Discover Movies</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </div>
    </div>
  </nav>
);

export default Navbar;
