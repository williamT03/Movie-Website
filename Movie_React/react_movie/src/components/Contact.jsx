import React, { useState } from 'react';
import './home.css';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    // Simulate sending email (replace with actual API integration if needed)
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-description">We'd love to hear from you! Fill out the form or reach us using the info on the left.</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Other Ways to Contact Us</h3>
            <div className="contact-item">
              <span className="contact-item-icon">📧</span>
              <div className="contact-item-details">
                <span className="contact-item-title">Email</span>
                <span className="contact-item-value">support@moviewebsite.com</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item-icon">📞</span>
              <div className="contact-item-details">
                <span className="contact-item-title">Phone</span>
                <span className="contact-item-value">+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item-icon">🏢</span>
              <div className="contact-item-details">
                <span className="contact-item-title">Address</span>
                <span className="contact-item-value">123 Movie Lane, Hollywood, CA</span>
              </div>
            </div>
            <p style={{marginTop: '2rem', color: '#ffd93d', fontWeight: 500}}>
              You can also reach us via social media or our support hotline for urgent requests.
            </p>
          </div>
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSend}>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  placeholder="Subject"
                />
              </div>
              <div className="form-group">
                <label htmlFor="body">Message</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  required
                  placeholder="Type your message here..."
                />
              </div>
              <button className="cta-btn" type="submit" style={{width: '100%', marginTop: '12px'}}>
                Send Message
              </button>
              {sent && (
                <div style={{color: '#ffd93d', marginTop: '1rem', fontWeight: 600}}>
                  Message sent! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
