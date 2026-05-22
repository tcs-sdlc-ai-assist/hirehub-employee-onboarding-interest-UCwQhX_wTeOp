import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Welcome to HireHub</h1>
          <p className="hero-subtitle">
            Join a team that values innovation, collaboration, and growth. We're
            building something extraordinary — and we want you to be part of it.
          </p>
          <Link to="/apply" className="hero-cta">
            Express Your Interest
          </Link>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-section-title">Why Join Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">🚀</div>
              <h3 className="feature-card-title">Innovation</h3>
              <p className="feature-card-description">
                Work on cutting-edge projects that push boundaries. We encourage
                creative thinking and empower you to bring bold ideas to life.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">📈</div>
              <h3 className="feature-card-title">Growth</h3>
              <p className="feature-card-description">
                Accelerate your career with mentorship programs, learning
                opportunities, and a clear path for professional development.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🤝</div>
              <h3 className="feature-card-title">Culture</h3>
              <p className="feature-card-description">
                Thrive in an inclusive, supportive environment where every voice
                matters. We celebrate diversity and foster genuine connections.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🌍</div>
              <h3 className="feature-card-title">Impact</h3>
              <p className="feature-card-description">
                Make a real difference with meaningful work that reaches millions.
                Your contributions here create lasting, positive change.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-section-title">Ready to Start Your Journey?</h2>
          <p className="cta-section-text">
            Take the first step toward an exciting career. Submit your interest
            and our team will be in touch.
          </p>
          <Link to="/apply" className="cta-section-btn">
            Apply Now
          </Link>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;