import React, { useState, useEffect } from 'react';
import './home.css';
import { useOmdbMovie } from '../hooks/useOmdbApi';

const slides = [
  {
    key: 'dark-knight',
    title: 'The Dark Knight',
    subtitle: 'When Gotham is threatened by The Joker',
    description: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent. But when the Joker wreaks havoc on Gotham, Batman must confront his greatest psychological and physical test.',
    gradient: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
    color: '#ffc107',
  },
  {
    key: 'inception',
    title: 'Inception',
    subtitle: 'Dreams within dreams within dreams',
    description: 'Dom Cobb is a skilled thief who steals secrets from deep within the subconscious during the dream state. His rare ability has made him a coveted player in corporate espionage, but it has also made him an international fugitive.',
    gradient: 'linear-gradient(135deg, rgba(40, 35, 30, 0.95) 0%, rgba(25, 20, 15, 0.98) 100%)',
    color: '#ffa500',
  },
  {
    key: 'pulp-fiction',
    title: 'Pulp Fiction',
    subtitle: 'The lives of two mob hitmen, a boxer and more',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. A masterpiece of nonlinear storytelling from Quentin Tarantino.',
    gradient: 'linear-gradient(135deg, rgba(50, 35, 20, 0.95) 0%, rgba(30, 20, 10, 0.98) 100%)',
    color: '#ffd700',
  },
  {
    key: 'godfather',
    title: 'The Godfather',
    subtitle: 'An offer you can’t refuse',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. A cinematic classic of power, family, and betrayal.',
    gradient: 'linear-gradient(135deg, rgba(35, 25, 15, 0.95) 0%, rgba(20, 15, 10, 0.98) 100%)',
    color: '#b8860b',
  },
  {
    key: 'shawshank',
    title: 'The Shawshank Redemption',
    subtitle: 'Hope can set you free',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A story of hope and friendship.',
    gradient: 'linear-gradient(135deg, rgba(25, 35, 45, 0.95) 0%, rgba(15, 25, 35, 0.98) 100%)',
    color: '#87ceeb',
  },
  {
    key: 'interstellar',
    title: 'Interstellar',
    subtitle: 'Mankind was born on Earth. It was never meant to die here.',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival. A visually stunning journey through space and time.',
    gradient: 'linear-gradient(135deg, rgba(15, 25, 40, 0.95) 0%, rgba(5, 15, 30, 0.98) 100%)',
    color: '#ff8c00',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [bgGradient, setBgGradient] = useState(slides[0].gradient);
  const [posterStyle, setPosterStyle] = useState({ opacity: 1, transform: 'translateX(0) scale(1)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
  const slide = slides[current];
  const { movie, loading } = useOmdbMovie(slide.title);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setPosterStyle({ opacity: 0, transform: 'translateX(60px) scale(0.95)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setBgGradient(slides[(current + 1) % slides.length].gradient);
        setPosterStyle({ opacity: 1, transform: 'translateX(0) scale(1)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
        setAnimating(false);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [current, slides]);

  const prevSlide = () => {
    setAnimating(true);
    setPosterStyle({ opacity: 0, transform: 'translateX(-60px) scale(0.95)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setBgGradient(slides[(current === 0 ? slides.length - 1 : current - 1)].gradient);
      setPosterStyle({ opacity: 1, transform: 'translateX(0) scale(1)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
      setAnimating(false);
    }, 800);
  };
  const nextSlide = () => {
    setAnimating(true);
    setPosterStyle({ opacity: 0, transform: 'translateX(60px) scale(0.95)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setBgGradient(slides[(current + 1) % slides.length].gradient);
      setPosterStyle({ opacity: 1, transform: 'translateX(0) scale(1)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' });
      setAnimating(false);
    }, 800);
  };

  return (
    <section
      className={`hero ${slide.key}`}
      style={{ background: bgGradient, transition: 'background 0.8s cubic-bezier(0.4,0,0.2,1)' }}
    >
      <div className="hero-container with-navbar">
        <div className="hero-home">
          <div className="hero-content">
            <h1 className="hero-title" style={{ color: slide.color }}>{slide.title}</h1>
            <div className="movie-meta"></div>
            <h2 className="hero-subtitle">{slide.subtitle}</h2>
            <p className="hero-description">{slide.description}</p>
            <div className="hero-actions"></div>
          </div>
          <div className="hero-image">
            <div className="movie-slideshow">
              <div className="slideshow-poster-container">
                {loading ? (
                  <div className="slideshow-poster loading">Loading...</div>
                ) : movie && movie.Poster && movie.Poster !== 'N/A' ? (
                  <img
                    src={movie.Poster}
                    alt={slide.title}
                    className="slideshow-poster"
                    style={posterStyle}
                  />
                ) : (
                  <div className="slideshow-poster no-poster" style={posterStyle}>No Poster</div>
                )}
              </div>
              <div className="slideshow-nav">
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                  <button className="prev" onClick={prevSlide}>&#8592;</button>
                  <div className="slideshow-dots">
                    {slides.map((_, idx) => (
                      <span
                        key={idx}
                        className={"dot" + (idx === current ? " active" : "")}
                        onClick={() => setCurrent(idx)}
                      />
                    ))}
                  </div>
                  <button className="next" onClick={nextSlide}>&#8594;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Hero;
