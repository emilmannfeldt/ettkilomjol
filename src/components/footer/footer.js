import React, { Component } from 'react';
import './footer.css';
import { Link } from 'react-router-dom';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount(){
    this.autoHeight();
    window.addEventListener("resize", this.autoHeight);
  }
  autoHeight() {
    let header = document.querySelector('#header');
    let content = document.querySelector('#content');
    let footer = document.querySelector('#footer');

    content.style.minHeight = 0;
    content.style.minHeight= (window.document.body.scrollHeight - header.offsetHeight - footer.offsetHeight)+"px";

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
            </ul>
          </div>

          <div className="info col-lg-12 no-gutter">
            <div className="col-lg-4">
              <ul>
                <li><a href="/about">Om Ettkilomjol.se</a></li>
                <li><a href="#" onClick={() => {this.props.openContact('')}}>Kontakta mig</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <ul>
                <li><Link to={'/faq'}>FAQ</Link></li>
                <li><Link to={'/stats'}>Statistik</Link></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <ul>
              <li><Link to={'/privacy'}>Integritetspolicy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;
