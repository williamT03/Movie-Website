// CinemaHub Home Page JavaScript - OMDB API Integration

// Slideshow functionality
let slideIndex = 1;
let slideInterval;

// Movie data for Netflix-style content updates
const movieData = {
  'dark-knight': {
    title: 'The Dark Knight',
    year: '2008',
    rating: 'PG-13',
    duration: '152 min',
    subtitle: 'When Gotham is threatened by The Joker',
    description: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent. But when the Joker wreaks havoc on Gotham, Batman must confront his greatest psychological and physical test.'
  },
  'inception': {
    title: 'Inception',
    year: '2010',
    rating: 'PG-13',
    duration: '148 min',
    subtitle: 'Dreams within dreams within dreams',
    description: 'Dom Cobb is a skilled thief who steals secrets from deep within the subconscious during the dream state. His rare ability has made him a coveted player in corporate espionage, but it has also made him an international fugitive.'
  },
  'pulp-fiction': {
    title: 'Pulp Fiction',
    year: '1994',
    rating: 'R',
    duration: '154 min',
    subtitle: 'The lives of two mob hitmen, a boxer and more',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. A masterpiece of nonlinear storytelling from Quentin Tarantino.'
  },
  'godfather': {
    title: 'The Godfather',
    year: '1972',
    rating: 'R',
    duration: '175 min',
    subtitle: 'An offer you cannot refuse',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. A timeless saga of power, family, and betrayal.'
  },
  'shawshank': {
    title: 'The Shawshank Redemption',
    year: '1994',
    rating: 'R',
    duration: '142 min',
    subtitle: 'Fear can hold you prisoner. Hope can set you free',
    description: 'Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency. A story of hope, friendship, and the indomitable human spirit.'
  },
  'interstellar': {
    title: 'Interstellar',
    year: '2014',
    rating: 'PG-13',
    duration: '169 min',
    subtitle: 'Mankind was born on Earth. It was never meant to die here',
    description: "Earth's future has been riddled by disasters. A group of explorers use a newly discovered wormhole to surpass the limitations on human space travel and conquer interstellar space."
  }
};

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const heroSection = document.querySelector('.hero');
  
  if (index > slides.length) slideIndex = 1;
  if (index < 1) slideIndex = slides.length;
  
  // Hide all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Remove active class from all dots and reset animations
  dots.forEach(dot => {
    dot.classList.remove('active');
    // Force animation restart by removing and re-adding the class
    dot.style.animation = 'none';
    dot.offsetHeight; // Trigger reflow
    dot.style.animation = null;
  });
  
  // Show current slide and activate corresponding dot
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].classList.add('active');
    
    // Update entire hero section background based on active movie
    const activeMovie = slides[slideIndex - 1].getAttribute('data-movie');
    
    // Remove all existing movie theme classes from hero section
    heroSection.classList.remove('dark-knight', 'inception', 'pulp-fiction', 'godfather', 'shawshank', 'interstellar');
    
    // Add the current movie theme class to hero section
    if (activeMovie) {
      heroSection.classList.add(activeMovie);
      
      // Update content with Netflix-style movie information
      updateMovieContent(activeMovie);
    }
  }
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add('active');
  }
}

function updateMovieContent(movieKey) {
  const movie = movieData[movieKey];
  if (!movie) return;
  
  // Update movie title
  const titleElement = document.getElementById('movie-title');
  if (titleElement) {
    titleElement.textContent = movie.title;
  }
  
  // Update movie metadata
  const yearElement = document.querySelector('.movie-year');
  const ratingElement = document.querySelector('.movie-rating');
  const durationElement = document.querySelector('.movie-duration');
  
  if (yearElement) yearElement.textContent = movie.year;
  if (ratingElement) ratingElement.textContent = movie.rating;
  if (durationElement) durationElement.textContent = movie.duration;
  
  // Update subtitle
  const subtitleElement = document.querySelector('.hero-subtitle');
  if (subtitleElement) {
    subtitleElement.textContent = movie.subtitle;
  }
  
  // Update description
  const descriptionElement = document.getElementById('movie-description');
  if (descriptionElement) {
    descriptionElement.textContent = movie.description;
  }
}

function changeSlide(direction) {
  slideIndex += direction;
  showSlide(slideIndex);
  resetAutoSlide();
}

function currentSlide(index) {
  slideIndex = index;
  showSlide(slideIndex);
  resetAutoSlide();
}

function autoSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function startAutoSlide() {
  slideInterval = setInterval(autoSlide, 4000); // Change slide every 4 seconds
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Make functions global for onclick handlers
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// Smooth scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Animate statistics numbers with movie-themed counts
function animateNumbers() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const statTargets = {
    '1M+': 1000000,
    '50K+': 50000,
    '100%': 100,
    '24/7': 247
  };
  
  statNumbers.forEach(stat => {
    const originalText = stat.textContent.trim();
    const target = statTargets[originalText] || parseInt(stat.getAttribute('data-target')) || 100;
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = originalText; // Restore original format
        clearInterval(timer);
      } else {
        if (originalText === '24/7') {
          stat.textContent = Math.floor(current);
        } else if (originalText === '100%') {
          stat.textContent = Math.floor(current) + '%';
        } else {
          stat.textContent = Math.floor(current).toLocaleString();
        }
      }
    }, 20);
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('stats-section')) {
        animateNumbers();
        observer.unobserve(entry.target);
      }
      
      // Add animation classes
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Contact form handling with movie-themed responses
document.addEventListener('DOMContentLoaded', () => {
  // Initialize slideshow
  const slideshow = document.querySelector('.movie-slideshow');
  if (slideshow) {
    showSlide(slideIndex);
    startAutoSlide();
    
    // Pause slideshow on hover
    slideshow.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    // Resume slideshow when mouse leaves
    slideshow.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
  const contactForm = document.querySelector('.contact-form');
  const statsSection = document.querySelector('.stats-section');
  
  // Add movie tip of the day
  const movieTips = [
    "💡 Tip: Use specific keywords like 'Marvel' or 'Action' to find your favorite movie genres!",
    "🎬 Did you know? Our database includes movies from 1900 to present day!",
    "⭐ Fun fact: You can search by year to discover classic films from any decade!",
    "🔍 Pro tip: Try searching for director names to explore their complete filmography!"
  ];
  
  const randomTip = movieTips[Math.floor(Math.random() * movieTips.length)];
  const tipElement = document.createElement('div');
  tipElement.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; background: var(--primary-color);
    color: white; padding: 15px 20px; border-radius: 8px; box-shadow: var(--shadow);
    max-width: 300px; font-size: 14px; z-index: 1000; animation: slideIn 0.5s ease;
  `;
  tipElement.textContent = randomTip;
  
  // Auto-hide tip after 8 seconds
  setTimeout(() => {
    tipElement.style.animation = 'slideOut 0.5s ease forwards';
    setTimeout(() => tipElement.remove(), 500);
  }, 8000);
  
  // Add click to dismiss
  tipElement.addEventListener('click', () => {
    tipElement.style.animation = 'slideOut 0.5s ease forwards';
    setTimeout(() => tipElement.remove(), 500);
  });
  
  document.body.appendChild(tipElement);
  
  // Observe stats section for number animation
  if (statsSection) {
    observer.observe(statsSection);
  }
  
  // Handle contact form submission with movie-themed responses
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const name = contactForm.querySelector('input[type="text"]').value;
      const email = contactForm.querySelector('input[type="email"]').value;
      const subject = contactForm.querySelector('#subject').value;
      const message = contactForm.querySelector('textarea').value;
      
      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Simulate form submission with movie-themed response
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
    });
  }
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    
    // Add background to navbar on scroll
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Add fade-in animation to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, { threshold: 0.2 });
  
  featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';
    cardObserver.observe(card);
  });
});

// Add some interactive elements
document.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('feature-card')) {
    e.target.style.transform += ' scale(1.02)';
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.classList.contains('feature-card')) {
    e.target.style.transform = e.target.style.transform.replace(' scale(1.02)', '');
  }
});
