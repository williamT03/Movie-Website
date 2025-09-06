import React, { useEffect, useState } from "react";
import useTheme from "./useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
  // View All state
  const [viewAll, setViewAll] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
    // New filter states
    const [genre, setGenre] = useState("");
    const [sort, setSort] = useState("");
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch full movie details for modal
  async function openMovieModal(imdbID) {
    setModalLoading(true);
    setModalOpen(true);
    const params = new URLSearchParams({ apikey: OMDB_API_KEY, i: imdbID });
    const response = await fetch(`${OMDB_BASE_URL}?${params}`);
    const data = await response.json();
    setModalMovie(data);
    setModalLoading(false);
  }

  function closeModal() {
    setModalOpen(false);
    setModalMovie(null);
  }
  // Theme mode state
  const [theme, setTheme] = useState("light");
  useTheme(theme);
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

  async function searchMovies(query, type = "", year = "", page = 1, genreArg = "", sortArg = "") {
    setLoading(true);
    let searchTerm = query && query.trim().length > 0 ? query : "movie";
    let allResults = [];
    let total = 0;
    for (let p = 1; p <= Math.ceil(100 / 10); p++) {
      const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: searchTerm, page: p.toString() });
      if (type) params.append("type", type);
      if (year) params.append("y", year);
      const response = await fetch(`${OMDB_BASE_URL}?${params}`);
      const data = await response.json();
      if (data.Response === "True") {
        if (p === 1) {
          total = parseInt(data.totalResults, 10) || 0;
        }
        allResults = allResults.concat(data.Search || []);
      }
      if (allResults.length >= total) break;
    }

    // Fetch full details for each movie if genre filter is used
    const genreToUse = genreArg || genre;
    let filteredResults = allResults;
    if (genreToUse) {
      // Fetch details for each movie in parallel
      const detailedResults = await Promise.all(
        allResults.map(async m => {
          const params = new URLSearchParams({ apikey: OMDB_API_KEY, i: m.imdbID });
          const response = await fetch(`${OMDB_BASE_URL}?${params}`);
          const data = await response.json();
          return data;
        })
      );
      filteredResults = detailedResults.filter(m => m.Genre && m.Genre.includes(genreToUse));
    }
    else {
      filteredResults = allResults;
    }

    // Sort by selected option
    const sortToUse = sortArg || sort;
    if (sortToUse === "rating") {
      filteredResults.sort((a, b) => (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));
    } else if (sortToUse === "year") {
      filteredResults.sort((a, b) => (parseInt(b.Year) || 0) - (parseInt(a.Year) || 0));
    } else if (sortToUse === "alpha") {
      filteredResults.sort((a, b) => a.Title.localeCompare(b.Title));
    } else {
      filteredResults.sort((a, b) => {
        const yearA = parseInt(a.Year) || 0;
        const yearB = parseInt(b.Year) || 0;
        if (yearA !== yearB) return yearB - yearA;
        return a.Title.localeCompare(b.Title);
      });
    }
    setLoading(false);
    setResults(filteredResults);
    setTotalResults(filteredResults.length);
    setCurrentPage(page);
    setViewAll(false);
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
    <div>
      {/* Movie Details Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modalLoading ? (
              <div className="modal-loading">Loading...</div>
            ) : modalMovie ? (
              <>
                <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                <div className="modal-header">
                  <img src={modalMovie.Poster && modalMovie.Poster !== "N/A" ? modalMovie.Poster : `https://via.placeholder.com/320x480/1a1a1a/ffffff?text=${encodeURIComponent(modalMovie.Title)}`} alt={modalMovie.Title} className="modal-poster" />
                  <div className="modal-movie-info">
                    <h2 className="modal-title">{modalMovie.Title}</h2>
                    <p className="modal-year-type">{modalMovie.Year} &bull; {modalMovie.Type}</p>
                    <p className="modal-genre"><strong>Genre:</strong> {modalMovie.Genre}</p>
                    <p className="modal-rating"><strong>IMDB Rating:</strong> {modalMovie.imdbRating}</p>
                    <p className="modal-plot"><strong>Plot:</strong> {modalMovie.Plot}</p>
                    <p className="modal-director"><strong>Director:</strong> {modalMovie.Director}</p>
                    <p className="modal-actors"><strong>Actors:</strong> {modalMovie.Actors}</p>
                    <a href={`https://www.imdb.com/title/${modalMovie.imdbID}`} target="_blank" rel="noopener noreferrer" className="primary-btn modal-imdb-btn">View on IMDB</a>
                  </div>
                </div>
              </>
            ) : (
              <div className="modal-error">Movie details not found.</div>
            )}
          </div>
        </div>
      )}
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
      <section className="hero hero-discover">
        <div className="hero-container with-navbar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="search-input-group" style={{ width: '100%' }}>
              <input id="q" className="search-input" style={{ width: '100%', fontSize: '1.2em', padding: '12px 18px', borderRadius: '8px', boxSizing: 'border-box' }} placeholder="Search movies, TV shows, actors..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {/* Dropdown for filter options */}
            <details style={{ width: '100%', marginTop: '18px', textAlign: 'center' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.1em', padding: '8px 0' }}>Show Filter Options</summary>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: '12px' }}>
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
                <div className="select-group">
                  <select id="genreSelect" className="make-select" value={genre} onChange={e => setGenre(e.target.value)}>
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Crime">Crime</option>
                    <option value="Drama">Drama</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                  </select>
                </div>
                <div className="select-group">
                  <select id="sortSelect" className="make-select" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="trending">Most Trending</option>
                    <option value="rating">Highest Rated</option>
                    <option value="year">Newest Year</option>
                    <option value="alpha">Alphabetical</option>
                  </select>
                </div>
              </div>
            </details>
            {/* Centered buttons below search/filter */}
            <div style={{ display: 'flex', gap: '18px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="primary-btn stylized-btn"
                style={{ minWidth: '180px', fontSize: '1.25em', padding: '16px 32px', borderRadius: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontWeight: 700, letterSpacing: '1px', background: 'linear-gradient(90deg, #ff3c3c 0%, #b31217 100%)', color: '#fff', border: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
                onClick={() => searchMovies(search, type, year, 1, genre, sort)}
              >
                Search Movie
              </button>
              <button
                className="primary-btn stylized-btn"
                style={{ minWidth: '180px', fontSize: '1.25em', padding: '16px 32px', borderRadius: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontWeight: 700, letterSpacing: '1px', background: 'linear-gradient(90deg, #ff3c3c 0%, #b31217 100%)', color: '#fff', border: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
                onClick={() => setViewAll(true)}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main>
        { (results.length > 0 || loading) ?
          <section id="searchResults" className="movie-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">🔍 Search Results</h2>
                <div className="results-info">
                  <strong id="resultsCount" className="results-count">{totalResults}</strong>
                  <span className="results-text">results found</span>
                </div>
                {results.length > 20 && !viewAll &&
                  <button className="primary-btn" style={{ margin: '18px 0 0 0' }} onClick={() => setViewAll(true)}>View All</button>
                }
                {viewAll &&
                  <button className="secondary-btn" style={{ margin: '18px 0 0 12px' }} onClick={() => setViewAll(false)}>View Paged</button>
                }
              </div>
              <div id="listingArea" className="search-results-grid">
                {loading && <div className="loading-placeholder">Searching...</div>}
                {!loading && results.length === 0 && <div className="loading-placeholder">No movies found matching your search criteria. Try different keywords.</div>}
                {!loading && results.length > 0 && (viewAll ? results : results.slice((currentPage - 1) * 20, currentPage * 20)).map(movie => (
                  <MovieCard key={movie.imdbID} movie={movie} openMovieModal={openMovieModal} />
                ))}
              </div>
              {/* Pagination Controls */}
              {!viewAll && totalResults > 20 &&
                <div className="pagination-controls" style={{ textAlign: 'center', margin: '32px 0' }}>
                  <button className="primary-btn" disabled={currentPage === 1} onClick={() => searchMovies(search, type, year, currentPage - 1, genre, sort)} style={{ marginRight: '12px' }} aria-label="Previous Page">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                  <span style={{ fontWeight: 600, fontSize: '1.1em', margin: '0 12px' }}>Page {currentPage} of {Math.ceil(totalResults / 20)}</span>
                  <button className="primary-btn" disabled={currentPage >= Math.ceil(totalResults / 20)} onClick={() => searchMovies(search, type, year, currentPage + 1, genre, sort)} style={{ marginLeft: '12px' }} aria-label="Next Page">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              }
            </div>
          </section>
        :
          <>
            {/* Movie Sections (default view) */}
            <section className="movie-section">
              <div className="container">
                <div className="section-header">
                  <h2 className="section-title">🔥 Trending Now</h2>
                  <p className="section-description">The hottest movies everyone is talking about</p>
                </div>
                <div id="trendingMovies" className="movie-grid">
                  {categories.trending.length === 0 ?
                    <div className="loading-placeholder">Loading trending movies...</div>
                  :
                    categories.trending.map(movie => (
                      <MovieCard key={movie.imdbID} movie={movie} openMovieModal={openMovieModal} />
                    ))
                  }
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
                  {categories.popular.length === 0 ?
                    <div className="loading-placeholder">Loading popular movies...</div>
                  :
                    categories.popular.map(movie => (
                      <MovieCard key={movie.imdbID} movie={movie} openMovieModal={openMovieModal} />
                    ))
                  }
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
                  {categories.action.length === 0 ?
                    <div className="loading-placeholder">Loading action movies...</div>
                  :
                    categories.action.map(movie => (
                      <MovieCard key={movie.imdbID} movie={movie} openMovieModal={openMovieModal} />
                    ))
                  }
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
                  {categories.award.length === 0 ?
                    <div className="loading-placeholder">Loading award-winning movies...</div>
                  :
                    categories.award.map(movie => (
                      <MovieCard key={movie.imdbID} movie={movie} openMovieModal={openMovieModal} />
                    ))
                  }
                </div>
              </div>
            </section>
          </>
        }
      </main>
      <footer>
        <div className="footer-bottom">
          <p>&copy; 2024 CinemaHub. All rights reserved. Movie data provided by OMDB API.</p>
        </div>
      </footer>
    </div>
  );
}

function MovieCard({ movie, openMovieModal }) {
  return (
    <article className="movie-grid-card" onClick={() => openMovieModal && openMovieModal(movie.imdbID)} style={{ cursor: openMovieModal ? 'pointer' : 'default' }}>
      <img src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : `https://via.placeholder.com/280x320/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`} alt={movie.Title} className="movie-poster-grid" loading="lazy" />
      <div className="movie-info-grid">
        <h3 className="movie-title-grid">{movie.Title}</h3>
        <div className="movie-details-grid">
          <span className="movie-year-grid">{movie.Year}</span>
          <span className="movie-type-grid">{movie.Type}</span>
        </div>
        <div className="movie-actions-grid">
          <button className="primary-btn movie-btn-grid" onClick={e => {e.stopPropagation(); window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank");}}>IMDB</button>
        </div>
      </div>
    </article>
  );
}

export default Discover;
