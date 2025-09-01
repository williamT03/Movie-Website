import { useEffect, useRef } from 'react';

export function useCountUp(target, end, duration = 2000, suffix = '') {
  const ref = useRef();

  useEffect(() => {
    let start = 0;
    let startTimestamp = null;
    let frame;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * end);
      if (ref.current) {
        ref.current.textContent = value.toLocaleString() + suffix;
      }
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        if (ref.current) {
          ref.current.textContent = end.toLocaleString() + suffix;
        }
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, suffix]);

  return ref;
}
