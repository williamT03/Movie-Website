import React from 'react';
import './common.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Movies</h4>
          <ul>
            <li><a className="footer-link" href="/discover">Discover</a></li>
            <li><a className="footer-link" href="/top-rated">Top Rated</a></li>
            <li><a className="footer-link" href="/new-releases">New Releases</a></li>
            <li><a className="footer-link" href="/genres">Genres</a></li>
            <li><a className="footer-link" href="/trailers">Trailers</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li><a className="footer-link" href="/reviews">Reviews</a></li>
            <li><a className="footer-link" href="/forums">Forums</a></li>
            <li><a className="footer-link" href="/blog">Blog</a></li>
            <li><a className="footer-link" href="/events">Events</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a className="footer-link" href="/contact">Contact Us</a></li>
            <li><a className="footer-link" href="/faq">FAQ</a></li>
            <li><a className="footer-link" href="/privacy">Privacy Policy</a></li>
            <li><a className="footer-link" href="/terms">Terms of Service</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a className="footer-social-icon" href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
            <a className="footer-social-icon" href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
            <a className="footer-social-icon" href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
            <a className="footer-social-icon" href="https://youtube.com" target="_blank" rel="noopener noreferrer">▶️</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 CinemaHub. All rights reserved. Movie data provided by OMDB API.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
