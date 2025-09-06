import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./common.css";
import "./discover.css";

const OMDB_API_KEY = "7ef2f0e6";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

const movieCategories = {
  trending: ["Marvel", "DC Comics", "Star Wars", "Fast Furious", "James Bond", "Mission Impossible", "Jurassic"],
  popular: ["Dark Knight", "Inception", "Pulp Fiction", "Godfather", "Shawshank", "Matrix", "Titanic", "Avatar"],
  action: ["John Wick", "Mad Max", "Die Hard", "Terminator", "Rambo", "Top Gun", "Bourne", "Expendables"],
  award: ["Parasite", "Moonlight", "Green Book", "Shape of Water", "Birdman", "12 Years Slave", "Spotlight", "Nomadland"],
};

function Discover() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({ trending: [], popular: [], action: [], award: [] });

  // Fetch categories on mount
  useEffect(() => {
    Object.keys(movieCategories).forEach((cat) => {
      loadCategory(cat);
    });
    // eslint-disable-next-line
  }, []);

  async function searchMovies(query, type = "", year = "", page = 1) {
    setLoading(true);
    const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: query, page: page.toString() });
    if (type) params.append("type", type);
    if (year) params.append("y", year);
    const response = await fetch(`${OMDB_BASE_URL}?${params}`);
    const data = await response.json();
    setLoading(false);
    if (data.Response === "True") {
      setResults(data.Search || []);
    } else {
      setResults([]);
    }
  }

  async function loadCategory(category) {
    const searchTerms = movieCategories[category];
    let allMovies = [];
    for (const term of searchTerms.slice(0, 3)) {
      const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: term, type: "movie" });
      const response = await fetch(`${OMDB_BASE_URL}?${params}`);
      const data = await response.json();
      if (data.Response === "True") {
        allMovies = allMovies.concat(data.Search.slice(0, 2));
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    // Remove duplicates
    const uniqueMovies = allMovies.filter((movie, idx, self) => idx === self.findIndex((m) => m.imdbID === movie.imdbID));
    setCategories((prev) => ({ ...prev, [category]: uniqueMovies }));
  }

  // Year dropdown
  const yearOptions = [];
  for (let y = new Date().getFullYear(); y >= 1900; y--) yearOptions.push(y);

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
          <button className="nav-toggle" aria-label="Toggle navigation">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/discover" className="nav-link active">Discover Movies</Link>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero hero-discover">
        <div className="hero-container with-navbar">
          <div className="hero-content">
            <h1 className="hero-title">Discover Amazing Movies</h1>
            <h2 className="hero-subtitle">BROWSE OUR EXTENSIVE MOVIE DATABASE</h2>
            <p className="hero-description">Search through thousands of movies, TV shows, and series with detailed information and ratings</p>
          </div>
        </div>
      </section>
      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <form className="search-form" onSubmit={e => {e.preventDefault(); searchMovies(search, type, year);}}>
              <div className="search-input-group">
                <input id="q" className="search-input" placeholder="Search movies, TV shows, actors..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="select-group">
                <select id="typeSelect" className="make-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="series">TV Series</option>
                  <option value="episode">Episodes</option>
                </select>
              </div>
              <div className="select-group">
                <select id="yearSelect" className="make-select" value={year} onChange={e => setYear(e.target.value)}>
                  <option value="">All Years</option>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button className="search-btn primary-btn" id="searchBtn" type="submit">Search Movies</button>
            </form>
          </div>
        </div>
      </section>
      {/* Movie Sections */}
      <section className="movie-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🔥 Trending Now</h2>
            <p className="section-description">The hottest movies everyone is talking about</p>
          </div>
          <div id="trendingMovies" className="movie-grid">
            {categories.trending.length === 0 ? <div className="loading-placeholder">Loading trending movies...</div> : categories.trending.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      </section>
      <section className="movie-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">⭐ Popular Movies</h2>
            <p className="section-description">Fan favorites and crowd pleasers</p>
          </div>
          <div id="popularMovies" className="movie-grid">
            {categories.popular.length === 0 ? <div className="loading-placeholder">Loading popular movies...</div> : categories.popular.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      </section>
      <section className="movie-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">💥 Action & Adventure</h2>
            <p className="section-description">High-octane thrills and epic adventures</p>
          </div>
          <div id="actionMovies" className="movie-grid">
            {categories.action.length === 0 ? <div className="loading-placeholder">Loading action movies...</div> : categories.action.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      </section>
      <section className="movie-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🏆 Award Winners</h2>
            <p className="section-description">Critically acclaimed and award-winning films</p>
          </div>
          <div id="awardMovies" className="movie-grid">
            {categories.award.length === 0 ? <div className="loading-placeholder">Loading award-winning movies...</div> : categories.award.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      </section>
      {/* Search Results Section */}
      <section id="searchResults" className="movie-section" style={{ display: results.length > 0 ? "block" : "none" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🔍 Search Results</h2>
            <div className="results-info">
              <strong id="resultsCount" className="results-count">{results.length}</strong>
              <span className="results-text">results found</span>
            </div>
          </div>
          <div id="listingArea" className="search-results-grid">
            {loading ? <div className="loading-placeholder">Searching...</div> : results.length === 0 ? <div className="loading-placeholder">No movies found matching your search criteria. Try different keywords.</div> : results.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
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
}

function MovieCard({ movie }) {
  return (
    <article className="movie-grid-card">
      <img src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : `https://via.placeholder.com/280x320/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`} alt={movie.Title} className="movie-poster-grid" loading="lazy" />
      <div className="movie-info-grid">
        <h3 className="movie-title-grid">{movie.Title}</h3>
        <div className="movie-details-grid">
          <span className="movie-year-grid">{movie.Year}</span>
          <span className="movie-type-grid">{movie.Type}</span>
        </div>
        <div className="movie-actions-grid">
          <button className="primary-btn movie-btn-grid" onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank")}>IMDB</button>
        </div>
      </div>
    </article>
  );
}

export default Discover;
