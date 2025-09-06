import { useState, useEffect } from 'react';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDB_URL = 'https://www.omdbapi.com/';

export function useOmdbMovie(title) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!title) return;
    setLoading(true);
    fetch(`${OMDB_URL}?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === 'True') {
          setMovie(data);
          setError(null);
        } else {
          setError(data.Error);
          setMovie(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Network error');
        setLoading(false);
      });
  }, [title]);

  return { movie, loading, error };
}
