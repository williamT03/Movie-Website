// OMDB API Configuration
// Note: You need to get a free API key from http://www.omdbapi.com/apikey.aspx
// Replace 'DEMO_KEY' with your actual API key
const OMDB_API_KEY = '7ef2f0e6'; // Your OMDB API key
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Enhanced movie searches for different categories with better variety
const movieCategories = {
  trending: ['Marvel', 'DC Comics', 'Star Wars', 'Fast Furious', 'James Bond', 'Mission Impossible', 'Jurassic'],
  popular: ['Dark Knight', 'Inception', 'Pulp Fiction', 'Godfather', 'Shawshank', 'Matrix', 'Titanic', 'Avatar'],
  action: ['John Wick', 'Mad Max', 'Die Hard', 'Terminator', 'Rambo', 'Top Gun', 'Bourne', 'Expendables'],
  award: ['Parasite', 'Moonlight', 'Green Book', 'Shape of Water', 'Birdman', '12 Years Slave', 'Spotlight', 'Nomadland']
};

// DOM Elements
const searchInput = document.getElementById('q');
const typeSelect = document.getElementById('typeSelect');
const yearSelect = document.getElementById('yearSelect');
const searchBtn = document.getElementById('searchBtn');
const listingArea = document.getElementById('listingArea');
const resultsCount = document.getElementById('resultsCount');
const searchResults = document.getElementById('searchResults');

// Movie section containers
const trendingContainer = document.getElementById('trendingMovies');
const popularContainer = document.getElementById('popularMovies');
const actionContainer = document.getElementById('actionMovies');
const awardContainer = document.getElementById('awardMovies');

// Helper function to create DOM elements
function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k in e) e[k] = v;
    else e.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

// OMDB API Functions with Live API Priority
async function searchMovies(query, type = '', year = '', page = 1) {
  try {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      s: query,
      page: page.toString()
    });
    
    if (type) params.append('type', type);
    if (year) params.append('y', year);
    
    const response = await fetch(`${OMDB_BASE_URL}?${params}`);
    const data = await response.json();
    
    if (data.Response === 'True') {
      console.log(`OMDB API: Found ${data.totalResults} results for "${query}"`);
      return {
        movies: data.Search || [],
        totalResults: parseInt(data.totalResults) || 0
      };
    } else {
      console.warn('OMDB API Error:', data.Error);
      return { movies: [], totalResults: 0 };
    }
  } catch (error) {
    console.error('Error searching movies:', error);
    return { movies: [], totalResults: 0 };
  }
}

async function getMovieDetails(imdbID) {
  try {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      i: imdbID,
      plot: 'full'
    });
    
    const response = await fetch(`${OMDB_BASE_URL}?${params}`);
    const data = await response.json();
    
    if (data.Response === 'True') {
      console.log(`OMDB API: Retrieved details for "${data.Title}"`);
      return data;
    } else {
      console.warn('OMDB API Error for movie details:', data.Error);
      return null;
    }
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
}

// Initialize year dropdown
function initializeYearDropdown() {
  if (!yearSelect) return;
  
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  
  for (let year = currentYear; year >= startYear; year--) {
    const option = el('option', { value: year.toString() }, year.toString());
    yearSelect.appendChild(option);
  }
}

// Create movie grid card with enhanced image handling
function createMovieGridCard(movie) {
  const card = el('article', { 
    className: 'movie-grid-card',
    onclick: () => {
      console.log('Movie card clicked:', movie.Title, movie.imdbID);
      showMovieModal(movie.imdbID);
    }
  });
  
  // Movie poster with enhanced fallback and loading
  const poster = el('img', {
    src: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : `https://via.placeholder.com/280x320/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`,
    alt: movie.Title,
    className: 'movie-poster-grid',
    loading: 'lazy'
  });
  
  poster.onerror = function() {
    this.src = `https://via.placeholder.com/280x320/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`;
  };
  
  // Movie info
  const info = el('div', { className: 'movie-info-grid' });
  
  const title = el('h3', { className: 'movie-title-grid' }, movie.Title);
  
  const details = el('div', { className: 'movie-details-grid' },
    el('span', { className: 'movie-year-grid' }, movie.Year),
    el('span', { className: 'movie-type-grid' }, capitalizeFirst(movie.Type))
  );
  
  // Action buttons
  const actions = el('div', { className: 'movie-actions-grid' },
    el('button', {
      className: 'primary-btn movie-btn-grid',
      onclick: (e) => {
        e.stopPropagation();
        console.log('Details button clicked:', movie.Title, movie.imdbID);
        showMovieModal(movie.imdbID);
      }
    }, 'Details'),
    el('button', {
      className: 'secondary-btn movie-btn-grid',
      onclick: (e) => {
        e.stopPropagation();
        window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank');
      }
    }, 'IMDB')
  );
  
  info.append(title, details, actions);
  card.append(poster, info);
  
  return card;
}

// Render movies in a grid format
function renderMovieGrid(movies, container) {
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!movies.length) {
    container.appendChild(
      el('div', {
        className: 'loading-placeholder'
      }, 'No movies found for this category.')
    );
    return;
  }
  
  movies.forEach(movie => {
    const card = createMovieGridCard(movie);
    container.appendChild(card);
  });
}

// Render search results (list format)
function renderMovieListings(movies) {
  if (!listingArea || !resultsCount) {
    console.error('Required DOM elements not found');
    return;
  }
  
  listingArea.innerHTML = '';
  resultsCount.textContent = movies.length.toLocaleString();
  
  if (!movies.length) {
    listingArea.appendChild(
      el('div', {
        style: 'text-align:center; padding:60px 20px; color:var(--text-secondary)'
      }, 'No movies found matching your search criteria. Try different keywords.')
    );
    return;
  }
  
  movies.forEach(movie => {
    const card = el('article', { className: 'movie-card' });
    
    // Movie poster with enhanced fallback and OMDB image optimization
    const poster = el('img', {
      src: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`,
      alt: movie.Title,
      className: 'movie-poster',
      loading: 'lazy'
    });
    
    poster.onerror = function() {
      this.src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`;
    };
    
    // Movie info
    const info = el('div', { className: 'movie-info' });
    
    const title = el('h3', { className: 'movie-title' }, movie.Title);
    
    const details = el('div', { className: 'movie-details' },
      el('span', { className: 'movie-year' }, movie.Year),
      el('span', { className: 'movie-type' }, capitalizeFirst(movie.Type))
    );
    
    // Action buttons
    const actions = el('div', { className: 'movie-actions' },
      el('button', {
        className: 'primary-btn movie-btn',
        onclick: () => {
          console.log('View Details clicked for:', movie.Title, movie.imdbID);
          showMovieModal(movie.imdbID);
        }
      }, 'View Details'),
      el('button', {
        className: 'secondary-btn movie-btn',
        onclick: () => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')
      }, 'IMDB Page')
    );
    
    info.append(title, details, actions);
    card.append(poster, info);
    
    // Add click event to the entire card as well
    card.onclick = (e) => {
      // Only trigger if clicked on card directly, not buttons
      if (e.target === card || e.target === poster || e.target === info || e.target === title) {
        console.log('Movie card clicked:', movie.Title, movie.imdbID);
        showMovieModal(movie.imdbID);
      }
    };
    
    listingArea.appendChild(card);
  });
}

// Load movies for a specific category using Live OMDB API
async function loadMovieCategory(category, container, limit = 6) {
  if (!container) return;
  
  try {
    const searchTerms = movieCategories[category];
    if (!searchTerms) {
      console.warn(`No search terms found for category: ${category}`);
      return;
    }
    
    const allMovies = [];
    console.log(`Loading ${category} movies from OMDB API...`);
    
    // Search OMDB API for each term and collect movies with their poster images
    for (const term of searchTerms.slice(0, 3)) { // Limit API calls to avoid rate limits
      const results = await searchMovies(term, 'movie');
      if (results.movies.length > 0) {
        // Take first 2 movies from each search to get variety
        allMovies.push(...results.movies.slice(0, 2));
      }
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (allMovies.length === 0) {
      console.warn(`No movies found for ${category} category`);
      container.innerHTML = '<div class="loading-placeholder">No movies found for this category.</div>';
      return;
    }
    
    // Remove duplicates by IMDB ID and prioritize movies with posters
    const uniqueMovies = allMovies
      .filter((movie, index, self) => 
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      )
      .sort((a, b) => {
        // Prioritize movies with actual poster images from OMDB
        if (a.Poster !== 'N/A' && b.Poster === 'N/A') return -1;
        if (a.Poster === 'N/A' && b.Poster !== 'N/A') return 1;
        return 0;
      });
    
    // Limit to specified number
    const limitedMovies = uniqueMovies.slice(0, limit);
    console.log(`Displaying ${limitedMovies.length} movies for ${category} category`);
    
    renderMovieGrid(limitedMovies, container);
    
  } catch (error) {
    console.error(`Error loading ${category} movies:`, error);
    container.innerHTML = '<div class="loading-placeholder">Error loading movies. Please try again later.</div>';
  }
}

// Show detailed movie modal
async function showMovieModal(imdbID) {
  console.log('Opening modal for movie ID:', imdbID);
  
  // Create loading modal first
  const loadingModal = createLoadingModal();
  document.body.appendChild(loadingModal);
  
  try {
    const movieDetails = await getMovieDetails(imdbID);
    
    // Remove loading modal
    if (document.body.contains(loadingModal)) {
      document.body.removeChild(loadingModal);
    }
    
    if (!movieDetails) {
      console.error('No movie details received');
      alert('Error loading movie details. Please try again.');
      return;
    }
    
    console.log('Movie details received:', movieDetails.Title);
    const modal = createMovieModal(movieDetails);
    document.body.appendChild(modal);
    
    // Force show the modal
    setTimeout(() => {
      modal.style.display = 'flex';
    }, 10);
    
  } catch (error) {
    console.error('Error in showMovieModal:', error);
    if (document.body.contains(loadingModal)) {
      document.body.removeChild(loadingModal);
    }
    alert('Error loading movie details: ' + error.message);
  }
}

// Create loading modal
function createLoadingModal() {
  return el('div', {
    className: 'modal-overlay',
    style: `position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); 
            display:flex; align-items:center; justify-content:center; z-index:10000;`
  },
    el('div', {
      style: 'color:white; font-size:18px; text-align:center;'
    },
      el('div', { style: 'margin-bottom:10px;' }, '🎬'),
      'Loading movie details...'
    )
  );
}

// Create detailed movie modal with enhanced functionality
function createMovieModal(movie) {
  console.log('Creating modal for:', movie.Title);
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
  
  const content = document.createElement('div');
  content.className = 'modal-content';
  content.style.cssText = `
    background: white;
    border-radius: 16px;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  `;
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0,0,0,0.5);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeBtn.onclick = () => document.body.removeChild(modal);
  
  // Modal header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    gap: 25px;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px 16px 0 0;
  `;
  
  // Poster
  const poster = document.createElement('img');
  poster.src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : `https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`;
  poster.alt = movie.Title;
  poster.style.cssText = `
    width: 180px;
    height: 270px;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  `;
  poster.onerror = function() {
    this.src = `https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`;
  };
  
  // Header info
  const headerInfo = document.createElement('div');
  headerInfo.style.cssText = 'flex: 1; min-width: 0;';
  
  const title = document.createElement('h2');
  title.textContent = movie.Title;
  title.style.cssText = 'margin: 0 0 12px; font-size: 32px; line-height: 1.2; font-weight: 700;';
  
  const details = document.createElement('div');
  details.textContent = `${movie.Year} • ${movie.Runtime || 'N/A'} • ${movie.Rated || 'Not Rated'}`;
  details.style.cssText = 'margin-bottom: 16px; opacity: 0.9; font-size: 16px;';
  
  const genre = document.createElement('div');
  genre.textContent = movie.Genre || 'Genre not available';
  genre.style.cssText = 'margin-bottom: 18px; font-size: 16px; font-weight: 500;';
  
  // Ratings
  const ratingsDiv = document.createElement('div');
  ratingsDiv.style.cssText = 'display: flex; gap: 25px; margin-bottom: 20px; flex-wrap: wrap;';
  
  if (movie.imdbRating !== 'N/A') {
    const imdbDiv = document.createElement('div');
    imdbDiv.innerHTML = `
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">IMDB Rating</div>
      <div style="font-size: 22px; font-weight: bold;">⭐ ${movie.imdbRating}/10</div>
    `;
    ratingsDiv.appendChild(imdbDiv);
  }
  
  if (movie.Metascore !== 'N/A') {
    const metaDiv = document.createElement('div');
    metaDiv.innerHTML = `
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Metacritic</div>
      <div style="font-size: 22px; font-weight: bold;">${movie.Metascore}/100</div>
    `;
    ratingsDiv.appendChild(metaDiv);
  }
  
  // Play button
  const playButton = document.createElement('button');
  playButton.textContent = 'Watch Trailer';
  playButton.className = 'play-button';
  playButton.style.cssText = `
    background: linear-gradient(45deg, #e31e24, #ff4444);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(227, 30, 36, 0.3);
    transition: all 0.3s ease;
  `;
  playButton.onclick = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' trailer')}`, '_blank');
  };
  
  headerInfo.append(title, details, genre, ratingsDiv, playButton);
  header.append(poster, headerInfo);
  
  // Modal body
  const body = document.createElement('div');
  body.style.cssText = 'padding: 30px;';
  
  // Plot
  if (movie.Plot && movie.Plot !== 'N/A') {
    const plotSection = document.createElement('div');
    plotSection.style.cssText = 'margin-bottom: 30px;';
    
    const plotTitle = document.createElement('h3');
    plotTitle.textContent = '📖 Plot';
    plotTitle.style.cssText = 'margin: 0 0 12px; color: #333; font-size: 20px; font-weight: 600;';
    
    const plotText = document.createElement('p');
    plotText.textContent = movie.Plot;
    plotText.style.cssText = 'line-height: 1.7; color: #555; font-size: 16px; margin: 0;';
    
    plotSection.append(plotTitle, plotText);
    body.appendChild(plotSection);
  }
  
  // Additional info
  const infoGrid = document.createElement('div');
  infoGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px;';
  
  const infoItems = [
    { label: '🎬 Director', value: movie.Director },
    { label: '✍️ Writer', value: movie.Writer },
    { label: '🌍 Language', value: movie.Language },
    { label: '🏆 Awards', value: movie.Awards }
  ];
  
  infoItems.forEach(item => {
    if (item.value && item.value !== 'N/A') {
      const infoItem = document.createElement('div');
      infoItem.innerHTML = `
        <h4 style="margin: 0 0 8px; color: #333; font-size: 16px; font-weight: 600;">${item.label}</h4>
        <p style="margin: 0; color: #666; line-height: 1.5;">${item.value}</p>
      `;
      infoGrid.appendChild(infoItem);
    }
  });
  
  // Cast (full width)
  if (movie.Actors && movie.Actors !== 'N/A') {
    const castDiv = document.createElement('div');
    castDiv.style.cssText = 'grid-column: 1 / -1;';
    castDiv.innerHTML = `
      <h4 style="margin: 0 0 8px; color: #333; font-size: 16px; font-weight: 600;">� Cast</h4>
      <p style="margin: 0; color: #666; line-height: 1.5;">${movie.Actors}</p>
    `;
    infoGrid.appendChild(castDiv);
  }
  
  body.appendChild(infoGrid);
  
  // Action buttons
  const actions = document.createElement('div');
  actions.style.cssText = `
    display: flex;
    gap: 15px;
    justify-content: center;
    padding: 25px 30px;
    border-top: 1px solid #eee;
    background: #fafafa;
    border-radius: 0 0 16px 16px;
  `;
  
  const imdbBtn = document.createElement('button');
  imdbBtn.textContent = 'View on IMDB';
  imdbBtn.className = 'primary-btn';
  imdbBtn.style.cssText = 'padding: 14px 28px; font-size: 16px; font-weight: 600;';
  imdbBtn.onclick = () => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank');
  
  const findBtn = document.createElement('button');
  findBtn.textContent = 'Find Movie';
  findBtn.className = 'play-button';
  findBtn.style.cssText = `
    background: linear-gradient(45deg, #e31e24, #ff4444);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(227, 30, 36, 0.3);
  `;
  findBtn.onclick = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' full movie')}`, '_blank');
  };
  
  const closeBtn2 = document.createElement('button');
  closeBtn2.textContent = 'Close';
  closeBtn2.className = 'secondary-btn';
  closeBtn2.style.cssText = 'padding: 14px 28px; font-size: 16px;';
  closeBtn2.onclick = () => document.body.removeChild(modal);
  
  actions.append(imdbBtn, findBtn, closeBtn2);
  
  content.append(closeBtn, header, body, actions);
  modal.appendChild(content);
  
  // Add keyboard event listener for ESC key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  
  console.log('Modal created successfully');
  return modal;
}

// Search functionality
async function performSearch() {
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }
  
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search term');
    return;
  }
  
  if (searchBtn) {
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
  }
  
  try {
    const type = typeSelect ? typeSelect.value : '';
    const year = yearSelect ? yearSelect.value : '';
    
    const results = await searchMovies(query, type, year);
    
    renderMovieListings(results.movies);
    
    // Show search results section and hide others
    if (searchResults) {
      searchResults.style.display = 'block';
      searchResults.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update results summary
    updateSearchSummary(results.movies.length, {
      query,
      type: type || 'All Types',
      year: year || 'All Years'
    });
    
  } catch (error) {
    console.error('Search error:', error);
    if (listingArea) {
      listingArea.innerHTML = '<div style="color:var(--text-secondary); text-align:center; padding:40px">Error searching movies. Please try again.</div>';
    }
  } finally {
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Search Movies';
    }
  }
}

// Update search summary
function updateSearchSummary(count, filters) {
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => !value.startsWith('All'))
    .map(([key, value]) => `${key}: ${value}`);
  
  if (activeFilters.length > 0) {
    const summaryText = `Search: ${activeFilters.join(', ')}`;
    let summary = document.querySelector('.search-summary');
    
    if (!summary) {
      const resultsInfo = document.querySelector('.results-info');
      if (resultsInfo) {
        summary = el('div', { 
          className: 'search-summary', 
          style: 'font-size:12px; color:var(--text-secondary); margin-top:8px;' 
        });
        resultsInfo.appendChild(summary);
      }
    }
    
    if (summary) {
      summary.textContent = summaryText;
    }
  } else {
    const summary = document.querySelector('.search-summary');
    if (summary) summary.remove();
  }
}

// Utility functions
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load all movie categories
async function loadAllMovieCategories() {
  console.log('Loading movie categories...');
  
  // Load each category with staggered timing to avoid API rate limits
  setTimeout(() => loadMovieCategory('trending', trendingContainer), 100);
  setTimeout(() => loadMovieCategory('popular', popularContainer), 500);
  setTimeout(() => loadMovieCategory('action', actionContainer), 1000);
  setTimeout(() => loadMovieCategory('award', awardContainer), 1500);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('CinemaHub Browse page initialized with live OMDB API');
  
  // Initialize year dropdown
  initializeYearDropdown();
  
  // Load movie categories
  loadAllMovieCategories();
  
  // Set up event listeners
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  // Search on Enter key
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
    
    // Mobile optimization: prevent zoom on focus
    searchInput.addEventListener('focus', function() {
      if (window.innerWidth <= 768) {
        this.style.fontSize = '16px';
      }
    });
  }
  
  // Search on type/year change
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      if (searchInput && searchInput.value.trim()) performSearch();
    });
  }
  
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      if (searchInput && searchInput.value.trim()) performSearch();
    });
  }
  
  // Mobile touch optimizations
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Add touch-friendly class for touch devices
    document.body.classList.add('touch-device');
    
    // Improve touch scrolling for movie grids
    const movieGrids = document.querySelectorAll('.movie-grid');
    movieGrids.forEach(grid => {
      grid.style.scrollBehavior = 'smooth';
      grid.style.webkitOverflowScrolling = 'touch';
    });
  }
  
  // Handle orientation changes on mobile
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Recalculate layouts after orientation change
      window.dispatchEvent(new Event('resize'));
    }, 100);
  });
  
  // Optimize modal for mobile devices
  const handleResize = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Mobile-specific optimizations can be added here
      document.body.style.setProperty('--mobile-vh', window.innerHeight * 0.01 + 'px');
    }
  };
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call
});