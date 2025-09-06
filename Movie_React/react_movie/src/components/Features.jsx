import React from 'react';
import './home.css';

const Features = () => (
  <section className="features-section" id="features">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Explore Cinema Like Never Before</h2>
        <p className="section-description">
          Powered by OMDB API, discover comprehensive movie information with advanced search and filtering capabilities.
        </p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <span className="feature-icon">🔍</span>
          <h3 className="feature-title">Advanced Search</h3>
          <p className="feature-description">Find movies and shows instantly with powerful filters and search options.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⭐</span>
          <h3 className="feature-title">Detailed Ratings</h3>
          <p className="feature-description">Access ratings from IMDB, Rotten Tomatoes, and more for every title.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎭</span>
          <h3 className="feature-title">Cast & Crew Info</h3>
          <p className="feature-description">See full cast, crew, and production details for every movie.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎬</span>
          <h3 className="feature-title">Trailers & Clips</h3>
          <p className="feature-description">Watch official trailers and exclusive clips for your favorite films.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📅</span>
          <h3 className="feature-title">Release Calendar</h3>
          <p className="feature-description">Stay updated with upcoming releases and cinema schedules.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💬</span>
          <h3 className="feature-title">User Reviews</h3>
          <p className="feature-description">Read and share reviews from movie fans around the world.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
