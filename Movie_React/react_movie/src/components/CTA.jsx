import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate('/discover');
  };
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Discover Your Next Favorite Movie?</h2>
          <p className="cta-description"></p>
          <div className="cta-actions">
            <button className="cta-btn search-btn" onClick={handleSearch}>Search Movies</button>
            <button className="cta-btn">Get Started</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
