import React from 'react';
import './home.css';
import { useCountUp } from './useCountUp';

const statsData = [
  { end: 1000000, label: 'Movies & Shows', suffix: '+' },
  { end: 50000, label: 'Daily Searches', suffix: '+' },
  { end: 100, label: 'Free to Use', suffix: '%' },
  { end: 24, label: 'Always Available', suffix: '/7' },
];

const Stats = () => (
  <section className="stats-section">
    <div className="container">
      <div className="stats-grid">
        {statsData.map((stat, idx) => {
          const ref = useCountUp(null, stat.end, 1800 + idx * 400, stat.suffix);
          return (
            <div className="stat-item" key={stat.label}>
              <span className="stat-number" ref={ref}></span>
              <span className="stat-label">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Stats;
