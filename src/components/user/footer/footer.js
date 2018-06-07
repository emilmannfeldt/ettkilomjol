import React, { Component } from 'react';
import './footer.css';
import {BrowserRouter as Router, Link} from 'react-router-dom';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
        <footer id="footer" className="footer-content">
          <div className="container">
            <div className="social col-lg-12">
              <ul className="social-links">
                <li><a href="https://github.com/emilmannfeldt/ettkilomjol">
                  GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/mannfeldt/">
                  LinkedIn</a></li>
                <li><a href="https://tree.taiga.io/project/ettkilomjol-ett-kilo-mjol/">
                  Taiga</a></li>
                <li><a href="#">
                  Portfolio</a></li>
              </ul>
            </div>

            <div className="info col-lg-12 no-gutter">
              <div className="col-lg-4">
                <ul>
                  <li><a href="/about">Om Ettkilomjol.se</a></li>
                  <li><a href="/contact">Kontakta mig</a></li>
                  <li><a href="/feedback">Lämna feedback / anmäl fel</a></li>
                </ul>
              </div>
              <div className="col-lg-4">
                <ul>
                  <li><a href="/faq">FAQ</a></li>
                  <li><Link to={'/stats'}>Statistik</Link></li>
                  <li><a href="/advertise">Annonsera</a></li>
                </ul>
              </div>
              <div className="col-lg-4">
                <ul>
                  <li><a href="/create-recipes">Lägg till recept</a></li>
                  <li><a href="/login">Logga in</a></li>
                  <li><a href="/register">Registrera</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
    );
  }
}
export default Footer;
