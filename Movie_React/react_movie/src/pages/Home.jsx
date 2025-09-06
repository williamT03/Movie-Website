import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import About from '../components/About';
import CTA from '../components/CTA';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <Stats />
    <Features />
    <About />
    <CTA />
    <Contact />
    <Footer />
  </>
);

export default Home;
