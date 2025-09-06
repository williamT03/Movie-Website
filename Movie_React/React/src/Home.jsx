import React, { useEffect, useRef, useState, useCallback } from "react";
import useTheme from "./useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { Link } from 'react-router-dom';
import "./common.css";
import "./home.css";

// Movie data for slideshow
const movieData = {
  "dark-knight": {
    title: "The Dark Knight",
    year: "2008",
    rating: "PG-13",
    duration: "152 min",
    subtitle: "When Gotham is threatened by The Joker",
    description:
      "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent. But when the Joker wreaks havoc on Gotham, Batman must confront his greatest psychological and physical test.",
  },
  "inception": {
    title: "Inception",
    year: "2010",
    rating: "PG-13",
    duration: "148 min",
    subtitle: "Dreams within dreams within dreams",
    description:
      "Dom Cobb is a skilled thief who steals secrets from deep within the subconscious during the dream state. His rare ability has made him a coveted player in corporate espionage, but it has also made him an international fugitive.",
  },
  "pulp-fiction": {
    title: "Pulp Fiction",
    year: "1994",
    rating: "R",
    duration: "154 min",
    subtitle: "The lives of two mob hitmen, a boxer and more",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. A masterpiece of nonlinear storytelling from Quentin Tarantino.",
  },
  "godfather": {
    title: "The Godfather",
    year: "1972",
    rating: "R",
    duration: "175 min",
    subtitle: "An offer you cannot refuse",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. A timeless saga of power, family, and betrayal.",
  },
  "shawshank": {
    title: "The Shawshank Redemption",
    year: "1994",
    rating: "R",
    duration: "142 min",
    subtitle: "Fear can hold you prisoner. Hope can set you free",
    description:
      "Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency. A story of hope, friendship, and the indomitable human spirit.",
  },
  "interstellar": {
    title: "Interstellar",
    year: "2014",
    rating: "PG-13",
    duration: "169 min",
    subtitle: "Mankind was born on Earth. It was never meant to die here",
    description:
      "Earth's future has been riddled by disasters. A group of explorers use a newly discovered wormhole to surpass the limitations on human space travel and conquer interstellar space.",
  },
};

const slidesArr = [
  "dark-knight",
  "inception",
  "pulp-fiction",
  "godfather",
  "shawshank",
  "interstellar",
];

const OMDB_API_KEY = "7ef2f0e6";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

// Fetch movie details for slideshow from OMDB API
function getPosterUrl(key) {
  switch (key) {
    case "dark-knight":
      return "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg";
    case "inception":
      return "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg";
    case "pulp-fiction":
      return "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg";
    case "godfather":
      return "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg";
    case "shawshank":
      return "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg";
    case "interstellar":
      return "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg";
    default:
      return "";
  }
}

const Home = () => {
  // Theme mode state
  const [theme, setTheme] = useState("light");
  useTheme(theme);
  // Slideshow state
  const [slideIndex, setSlideIndex] = useState(0);
  const slideIntervalRef = useRef();

  // Navigation menu state
  const [navOpen, setNavOpen] = useState(false);

  // Fetched OMDB movie details state
  const [omdbMovies, setOmdbMovies] = useState({});

  // Movie info for current slide
  const currentMovieKey = slidesArr[slideIndex];
  const movie = omdbMovies[currentMovieKey] || movieData[currentMovieKey];

  // Fetch OMDB details for movies in the slideshow
  const fetchOMDBDetails = useCallback(async () => {
    const keys = slidesArr;
    const results = {};
    for (const key of keys) {
      let title = movieData[key].title;
      const params = new URLSearchParams({ apikey: OMDB_API_KEY, t: title });
      const response = await fetch(`${OMDB_BASE_URL}?${params}`);
      const data = await response.json();
      if (data.Response === "True") {
        results[key] = {
          title: data.Title,
          year: data.Year,
          rating: data.Rated,
          duration: data.Runtime,
          subtitle: movieData[key].subtitle,
          description: data.Plot,
          poster: data.Poster !== "N/A" ? data.Poster : getPosterUrl(key),
        };
      } else {
        results[key] = { ...movieData[key], poster: getPosterUrl(key) };
      }
    }
    setOmdbMovies(results);
  }, []);

  // Animate stats
  useEffect(() => {
    const statNumbers = document.querySelectorAll(".stat-number");
    const statTargets = {
      "1M+": 1000000,
      "50K+": 50000,
      "100%": 100,
      "24/7": 247,
    };
    statNumbers.forEach((stat) => {
      const originalText = stat.textContent.trim();
      const target = statTargets[originalText] || 100;
      const increment = target / 100;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = originalText;
          clearInterval(timer);
        } else {
          if (originalText === "24/7") stat.textContent = Math.floor(current);
          else if (originalText === "100%") stat.textContent = Math.floor(current) + "%";
          else stat.textContent = Math.floor(current).toLocaleString();
        }
      }, 20);
    });
  }, []);

  // Slideshow logic
  useEffect(() => {
    function nextSlide() {
      setSlideIndex((prev) => (prev + 1) % slidesArr.length);
    }
    slideIntervalRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(slideIntervalRef.current);
  }, []);

  // Navigation menu logic
  useEffect(() => {
    if (navOpen) {
      document.body.classList.add("nav-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  // Slide change handlers
  const changeSlide = (direction) => {
    setSlideIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = slidesArr.length - 1;
      if (next >= slidesArr.length) next = 0;
      return next;
    });
    clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(() => setSlideIndex((prev) => (prev + 1) % slidesArr.length), 4000);
  };
  const setCurrentSlide = (idx) => {
    setSlideIndex(idx);
    clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(() => setSlideIndex((prev) => (prev + 1) % slidesArr.length), 4000);
  };

  // Feature card fade-in animation
  useEffect(() => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, idx) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.5s ease';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, idx * 100 + 500);
    });
  }, []);

  // Contact form handler
  useEffect(() => {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    const submitHandler = (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[type="text"]').value;
      const email = contactForm.querySelector('input[type="email"]').value;
      const subject = contactForm.querySelector('#subject').value;
      const message = contactForm.querySelector('textarea').value;
      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      setTimeout(() => {
        alert(`🎬 Thank you, ${name}! Your message about "${subject}" has been sent successfully. We'll get back to you within 24 hours. Keep exploring movies! 🍿`);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    };
    contactForm.addEventListener('submit', submitHandler);
    return () => contactForm.removeEventListener('submit', submitHandler);
  }, []);

  // Tip of the day
  useEffect(() => {
    const movieTips = [
      "💡 Tip: Use specific keywords like 'Marvel' or 'Action' to find your favorite movie genres!",
      "🎬 Did you know? Our database includes movies from 1900 to present day!",
      "⭐ Fun fact: You can search by year to discover classic films from any decade!",
      "🔍 Pro tip: Try searching for director names to explore their complete filmography!",
    ];
    const randomTip = movieTips[Math.floor(Math.random() * movieTips.length)];
    const tipElement = document.createElement('div');
    tipElement.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: var(--primary-color); color: white; padding: 15px 20px; border-radius: 8px; box-shadow: var(--shadow); max-width: 300px; font-size: 14px; z-index: 1000; animation: slideIn 0.5s ease;`;
    tipElement.textContent = randomTip;
    setTimeout(() => {
      tipElement.style.animation = 'slideOut 0.5s ease forwards';
      setTimeout(() => tipElement.remove(), 500);
    }, 8000);
    tipElement.addEventListener('click', () => {
      tipElement.style.animation = 'slideOut 0.5s ease forwards';
      setTimeout(() => tipElement.remove(), 500);
    });
    document.body.appendChild(tipElement);
    return () => tipElement.remove();
  }, []);

  // Fetch OMDB details on component mount
  useEffect(() => {
    fetchOMDBDetails();
  }, [fetchOMDBDetails]);

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <a href="#" className="logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">CinemaHub</span>
            </a>
          </div>
          <button className={`nav-toggle${navOpen ? " active" : ""}`} aria-label="Toggle navigation" onClick={() => setNavOpen((open) => !open)}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <div className={`nav-links${navOpen ? " active" : ""}`}>
            <Link to="/" className="nav-link active" onClick={() => setNavOpen(false)}>Home</Link>
            <Link to="/discover" className="nav-link" onClick={() => setNavOpen(false)}>Discover Movies</Link>
            <a href="#about" className="nav-link" onClick={() => setNavOpen(false)}>About</a>
            <a href="#contact" className="nav-link" onClick={() => setNavOpen(false)}>Contact</a>
            <button
              className="nav-link theme-toggle-btn"
              aria-label="Toggle dark/light mode"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light"
                ? <FontAwesomeIcon icon={faMoon} />
                : <FontAwesomeIcon icon={faSun} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`hero ${currentMovieKey}`}>
        <div className="hero-container with-navbar">
          <div className="hero-home">
            <div className="hero-content">
              <h1 className="hero-title" id="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span className="movie-year">{movie.year}</span>
                <span className="movie-rating">{movie.rating}</span>
                <span className="movie-duration">{movie.duration}</span>
              </div>
              <h2 className="hero-subtitle">{movie.subtitle}</h2>
              <p className="hero-description" id="movie-description">{movie.description}</p>
              <div className="hero-actions">
                <a href="#" className="primary-btn hero-btn">▶ Play</a>
                <a href="#about" className="secondary-btn hero-btn">ℹ More Info</a>
              </div>
            </div>
            <div className="hero-image">
              <div className="movie-slideshow">
                <div className="slideshow-container">
                  {slidesArr.map((key, idx) => (
                    <div key={key} className={`slide${slideIndex === idx ? " active" : ""}`} data-movie={key}>
                      <div className="slide-background"></div>
                      <div className="slide-poster">
                        <img src={movieData[key].poster || getPosterUrl(key)} alt={movieData[key].title} className="poster-img" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Slideshow navigation with arrows and dots */}
                <div className="slideshow-dots">
                  <a className="prev" href="#" onClick={(e) => {e.preventDefault(); changeSlide(-1);}}>&#10094;</a>
                  {slidesArr.map((_, idx) => (
                    <span key={idx} className={`dot${slideIndex === idx ? " active" : ""}`} onClick={() => setCurrentSlide(idx)}></span>
                  ))}
                  <a className="next" href="#" onClick={(e) => {e.preventDefault(); changeSlide(1);}}>&#10095;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Movies & Shows</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Daily Searches</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Free to Use</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Always Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              <p className="feature-description">
                Search by title, year, type, and more. Find exactly what you're looking for with our powerful search engine.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⭐</span>
              <h3 className="feature-title">Detailed Ratings</h3>
              <p className="feature-description">
                Get IMDB ratings, Metacritic scores, and comprehensive reviews to help you choose your next watch.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎭</span>
              <h3 className="feature-title">Cast & Crew Info</h3>
              <p className="feature-description">
                Discover directors, writers, and cast members. Explore filmographies and creative teams behind your favorites.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3 className="feature-title">Mobile Optimized</h3>
              <p className="feature-description">
                Perfect experience on all devices. Browse movies seamlessly whether on desktop, tablet, or mobile.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚀</span>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Instant search results and quick loading times. Spend more time discovering, less time waiting.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🆓</span>
              <h3 className="feature-title">Completely Free</h3>
              <p className="feature-description">
                No subscriptions, no hidden fees. Access comprehensive movie data completely free of charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About CinemaHub</h2>
              <p className="about-description">
                CinemaHub is your gateway to the world of cinema. Built with movie enthusiasts in mind,
                we provide instant access to comprehensive movie and TV show information from the trusted OMDB database.
              </p>
              <p className="about-description">
                Whether you're looking for the latest blockbusters, classic films, or hidden gems,
                CinemaHub makes discovery easy and enjoyable. Our intuitive interface and powerful
                search capabilities help you find exactly what you're looking for.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Extensive movie and TV show database</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Real-time search with instant results</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Detailed cast, crew, and production info</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>IMDB ratings and Metacritic scores</span>
                </div>
                <div className="about-feature">
                  <span className="feature-check">✓</span>
                  <span>Mobile-friendly responsive design</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" alt="Movie Theater" className="about-img" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Discover Your Next Favorite Movie?</h2>
            <p className="cta-description">
              Join thousands of movie lovers who use CinemaHub daily to discover new films,
              check ratings, and explore the world of cinema.
            </p>
            <div className="cta-actions">
              <a href="#" className="primary-btn cta-btn">Start Exploring Movies</a>
              <a href="#contact" className="secondary-btn cta-btn">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-description">
              Have questions, suggestions, or feedback? We'd love to hear from you.
            </p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <p className="contact-description">
                CinemaHub is constantly evolving to serve movie enthusiasts better.
                Your feedback helps us improve and add new features that matter to you.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <h4>Email</h4>
                    <p>support@cinemahub.com<br />info@cinemahub.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div>
                    <h4>Website</h4>
                    <p>www.cinemahub.com<br />Available 24/7</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💬</span>
                  <div>
                    <h4>Support</h4>
                    <p>Live chat available<br />Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" id="name" name="name" className="form-input" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" id="email" name="email" className="form-input" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" id="subject" name="subject" className="form-input" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea id="message" name="message" className="form-input form-textarea" placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" className="primary-btn form-submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">🎬</span>
                <span className="logo-text">CinemaHub</span>
              </div>
              <p className="footer-description">
                Your ultimate destination for movie discovery. Explore comprehensive movie data,
                ratings, cast information, and more - all powered by the trusted OMDB database.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Explore</h4>
              <ul className="footer-links">
                <li><a href="#" className="">Discover Movies</a></li>
                <li><a href="#" className="">Search TV Shows</a></li>
                <li><a href="#" className="">Browse by Year</a></li>
                <li><a href="#" className="">Top Rated</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Features</h4>
              <ul className="footer-links">
                <li><a href="#features" className="">Advanced Search</a></li>
                <li><a href="#features" className="">Detailed Info</a></li>
                <li><a href="#features" className="">Ratings & Reviews</a></li>
                <li><a href="#features" className="">Cast & Crew</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#contact" className="">Contact Us</a></li>
                <li><a href="#about" className="">About</a></li>
                <li><a href="#" className="">Privacy Policy</a></li>
                <li><a href="#" className="">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CinemaHub. All rights reserved. Movie data provided by OMDB API.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
