import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../components/discover.css';

const Discover = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extra sections
  const [trending, setTrending] = useState([]);
  const [awards, setAwards] = useState([]);
  const [topRated, setTopRated] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);

  useEffect(() => {
    // Example trending: Batman
    fetch(`https://www.omdbapi.com/?s=batman&type=movie&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => setTrending(data.Search || []));
    // Example award-winning: Godfather
    fetch(`https://www.omdbapi.com/?s=godfather&type=movie&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => setAwards(data.Search || []));
    // Example top-rated: Inception
    fetch(`https://www.omdbapi.com/?s=inception&type=movie&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => setTopRated(data.Search || []));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const params = [
        `s=${encodeURIComponent(query)}`,
        type ? `type=${type}` : '',
        year ? `y=${year}` : '',
        `apikey=${import.meta.env.VITE_OMDB_API_KEY}`
      ].filter(Boolean).join('&');
      const res = await fetch(`https://www.omdbapi.com/?${params}`);
      const data = await res.json();
      if (data.Response === 'True') {
        setResults(data.Search);
      } else {
        setError(data.Error || 'No results found.');
      }
    } catch (err) {
      setError('Failed to fetch results.');
    }
    setLoading(false);
  };

  // Modal logic
  const openMovieModal = async (imdbID) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalMovie(null);
    try {
      const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${import.meta.env.VITE_OMDB_API_KEY}`);
      const data = await res.json();
      setModalMovie(data);
    } catch (err) {
      setModalMovie(null);
    }
    setModalLoading(false);
  };
  const closeMovieModal = () => {
    setModalOpen(false);
    setModalMovie(null);
  };

  return (
    <>
      <Navbar />
  <main className="discover-main">
        <section className="hero hero-discover">
          <div className="hero-container with-navbar">
            <div className="hero-content">
              <h1 className="hero-title">Discover Amazing Movies</h1>
              <h2 className="hero-subtitle">Browse Our Extensive Movie Database</h2>
              <p className="hero-description">Search thousands of movies, TV shows, and series with detailed information and ratings.</p>
            </div>
          </div>
        </section>
        <section className="search-section">
          <div className="container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-group">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search movies, TV shows, actors..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  required
                />
              </div>
              <div className="select-group">
                <select className="make-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="series">TV Series</option>
                  <option value="episode">Episodes</option>
                </select>
              </div>
              <div className="select-group">
                <input
                  className="make-select"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Year"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
              </div>
              <button className="search-btn primary-btn" type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search Movies'}
              </button>
            </form>
          </div>
        </section>

        {/* Trending Movies Section */}
        <section className="movie-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Trending Movies</h2>
              <p className="section-description">High-octane thrills and epic adventures</p>
            </div>
            <div className="movie-grid">
              {trending.length === 0 && <div className="loading-placeholder">Loading trending movies...</div>}
              {trending.map(movie => (
                <div className="movie-grid-card" key={movie.imdbID} onClick={() => openMovieModal(movie.imdbID)} style={{cursor:'pointer'}}>
                  <img
                    className="movie-poster-grid"
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Poster'}
                    alt={movie.Title}
                  />
                  <div className="movie-info-grid">
                    <div className="movie-title-grid">{movie.Title}</div>
                    <div className="movie-details-grid">
                      <span className="movie-year-grid">{movie.Year}</span>
                      <span className="movie-type-grid">{movie.Type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Award Winning Section */}
        <section className="movie-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🏆 Award Winners</h2>
              <p className="section-description">Critically acclaimed and award-winning films</p>
            </div>
            <div className="movie-grid">
              {awards.length === 0 && <div className="loading-placeholder">Loading award-winning movies...</div>}
              {awards.map(movie => (
                <div className="movie-grid-card" key={movie.imdbID} onClick={() => openMovieModal(movie.imdbID)} style={{cursor:'pointer'}}>
                  <img
                    className="movie-poster-grid"
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Poster'}
                    alt={movie.Title}
                  />
                  <div className="movie-info-grid">
                    <div className="movie-title-grid">{movie.Title}</div>
                    <div className="movie-details-grid">
                      <span className="movie-year-grid">{movie.Year}</span>
                      <span className="movie-type-grid">{movie.Type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="movie-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">⭐ Top Rated</h2>
              <p className="section-description">Fan favorites and critically acclaimed</p>
            </div>
            <div className="movie-grid">
              {topRated.length === 0 && <div className="loading-placeholder">Loading top rated movies...</div>}
              {topRated.map(movie => (
                <div className="movie-grid-card" key={movie.imdbID} onClick={() => openMovieModal(movie.imdbID)} style={{cursor:'pointer'}}>
                  <img
                    className="movie-poster-grid"
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Poster'}
                    alt={movie.Title}
                  />
                  <div className="movie-info-grid">
                    <div className="movie-title-grid">{movie.Title}</div>
                    <div className="movie-details-grid">
                      <span className="movie-year-grid">{movie.Year}</span>
                      <span className="movie-type-grid">{movie.Type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search Results Section */}
        <section className="movie-section">
          <div className="container">
            {error && <div className="no-results"><h3>No Results</h3><p>{error}</p></div>}
            {!error && results.length > 0 && (
              <div className="movie-grid">
                {results.map(movie => (
                  <div className="movie-grid-card" key={movie.imdbID} onClick={() => openMovieModal(movie.imdbID)} style={{cursor:'pointer'}}>
                    <img
                      className="movie-poster-grid"
                      src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Poster'}
                      alt={movie.Title}
                    />
                    <div className="movie-info-grid">
                      <div className="movie-title-grid">{movie.Title}</div>
                      <div className="movie-details-grid">
                        <span className="movie-year-grid">{movie.Year}</span>
                        <span className="movie-type-grid">{movie.Type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Movie Modal Popup */}
        {modalOpen && (
          <div className="modal-overlay" onClick={e => {if(e.target.className==='modal-overlay'){closeMovieModal();}}}>
            <div className="modal-content">
              <button style={{position:'absolute',top:15,right:15,background:'rgba(0,0,0,0.5)',border:'none',color:'white',width:35,height:35,borderRadius:'50%',fontSize:20,cursor:'pointer',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={closeMovieModal}>×</button>
              {modalLoading ? (
                <div style={{color:'#333',fontSize:'1.2rem',textAlign:'center',padding:'60px 0'}}>Loading movie details...</div>
              ) : modalMovie ? (
                <>
                  <div style={{display:'flex',gap:25,padding:30,background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',color:'white',borderRadius:'16px 16px 0 0'}}>
                    <img src={modalMovie.Poster && modalMovie.Poster!=='N/A'?modalMovie.Poster:`https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${encodeURIComponent(modalMovie.Title)}`} alt={modalMovie.Title} style={{width:180,height:270,objectFit:'cover',borderRadius:12,flexShrink:0,boxShadow:'0 8px 25px rgba(0,0,0,0.3)'}} />
                    <div style={{flex:1,minWidth:0}}>
                      <h2 style={{margin:'0 0 12px',fontSize:32,lineHeight:1.2,fontWeight:700}}>{modalMovie.Title}</h2>
                      <div style={{marginBottom:16,opacity:0.9,fontSize:16}}>{modalMovie.Year} • {modalMovie.Runtime||'N/A'} • {modalMovie.Rated||'Not Rated'}</div>
                      <div style={{marginBottom:18,fontSize:16,fontWeight:500}}>{modalMovie.Genre||'Genre not available'}</div>
                      <div style={{display:'flex',gap:25,marginBottom:20,flexWrap:'wrap'}}>
                        {modalMovie.imdbRating && modalMovie.imdbRating!=='N/A' && (
                          <div>
                            <div style={{fontSize:12,opacity:0.8,marginBottom:4}}>IMDB Rating</div>
                            <div style={{fontSize:22,fontWeight:'bold'}}>⭐ {modalMovie.imdbRating}/10</div>
                          </div>
                        )}
                        {modalMovie.Metascore && modalMovie.Metascore!=='N/A' && (
                          <div>
                            <div style={{fontSize:12,opacity:0.8,marginBottom:4}}>Metacritic</div>
                            <div style={{fontSize:22,fontWeight:'bold'}}>{modalMovie.Metascore}/100</div>
                          </div>
                        )}
                      </div>
                      <button className="play-button" style={{marginTop:10}} onClick={()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(modalMovie.Title+' '+modalMovie.Year+' trailer')}`,'_blank')}>Watch Trailer</button>
                    </div>
                  </div>
                  <div style={{padding:30}}>
                    {modalMovie.Plot && modalMovie.Plot!=='N/A' && (
                      <div style={{marginBottom:30}}>
                        <h3 style={{margin:'0 0 12px',color:'#333',fontSize:20,fontWeight:600}}>📖 Plot</h3>
                        <p style={{lineHeight:1.7,color:'#555',fontSize:16,margin:0}}>{modalMovie.Plot}</p>
                      </div>
                    )}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:25,marginBottom:30}}>
                      {modalMovie.Director && modalMovie.Director!=='N/A' && (
                        <div>
                          <h4 style={{margin:'0 0 8px',color:'#333',fontSize:16,fontWeight:600}}>🎬 Director</h4>
                          <div style={{color:'#555',fontSize:15}}>{modalMovie.Director}</div>
                        </div>
                      )}
                      {modalMovie.Writer && modalMovie.Writer!=='N/A' && (
                        <div>
                          <h4 style={{margin:'0 0 8px',color:'#333',fontSize:16,fontWeight:600}}>✍️ Writer</h4>
                          <div style={{color:'#555',fontSize:15}}>{modalMovie.Writer}</div>
                        </div>
                      )}
                      {modalMovie.Language && modalMovie.Language!=='N/A' && (
                        <div>
                          <h4 style={{margin:'0 0 8px',color:'#333',fontSize:16,fontWeight:600}}>🌍 Language</h4>
                          <div style={{color:'#555',fontSize:15}}>{modalMovie.Language}</div>
                        </div>
                      )}
                      {modalMovie.Awards && modalMovie.Awards!=='N/A' && (
                        <div>
                          <h4 style={{margin:'0 0 8px',color:'#333',fontSize:16,fontWeight:600}}>🏆 Awards</h4>
                          <div style={{color:'#555',fontSize:15}}>{modalMovie.Awards}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{color:'#333',fontSize:'1.2rem',textAlign:'center',padding:'60px 0'}}>Error loading movie details.</div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Discover;
