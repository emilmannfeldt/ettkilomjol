import React, { Component } from 'react';
import './footer.css';
import { Link } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/MailOutline';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'asdf'
    };
  }
  componentDidMount() {
    this.autoHeight();
    window.addEventListener("resize", this.autoHeight);
  }

  autoHeight() {
    let header = document.querySelector('#header');
    let content = document.querySelector('#content');
    let footer = document.querySelector('#footer');
    if (footer.scrollHeight > 0) {
      content.style.minHeight = 0;
      content.style.minHeight = (window.document.body.scrollHeight - header.offsetHeight - footer.offsetHeight) + "px";
    }

  }

  handleChange = (event, value) => {
    if (value !== 3) {
      this.setState({ value });
    }
  };

  render() {
    let route = window.location.href.substr(window.location.href.indexOf("/#/") + 2);
    return (
      <div>
        <footer id="footer" className="footer-content hide-mobile">
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
                  <li><a href="#" onClick={() => { this.props.openContact('') }}>Kontakta mig</a></li>
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
        <div className="bottom-navigation-container hide-desktop">
          <BottomNavigation value={route}>
            <BottomNavigationAction label="Sök" value="/" icon={<SearchIcon />} component={Link} to="/"></BottomNavigationAction>
            <BottomNavigationAction label="Favoriter" value="/favorites" icon={<FavoriteIcon />} component={Link} to="/favorites"></BottomNavigationAction>
            <BottomNavigationAction label="Inköpslistor" value="/grocerylists" icon={<ShoppingCartOutlinedIcon />} component={Link} to="/grocerylists"></BottomNavigationAction>
            <BottomNavigationAction className="bottomNavigationAction-contact" label="Kontakt" icon={<MailIcon />} onClick={() => { this.props.openContact('') }}></BottomNavigationAction>
          </BottomNavigation>
        </div>
      </div>
    );
  }
}
export default Footer;
