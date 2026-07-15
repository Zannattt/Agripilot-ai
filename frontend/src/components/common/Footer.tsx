import { APP_NAME } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="nav__brand" style={{ marginBottom: 12 }}>
              <img src="/leaf.svg" alt="" width={28} height={28} />
              {APP_NAME}
            </div>
            <p className="muted" style={{ maxWidth: 300 }}>
              A voice-first AI copilot helping farmers spray less, save more, and grow healthier
              crops.
            </p>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><a href="/#features">Features</a></li>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="/#impact">Impact</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="mailto:hello@agripilot.example">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Social</h5>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>X / Twitter</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <span>Made for farmers, first.</span>
        </div>
      </div>
    </footer>
  );
}
