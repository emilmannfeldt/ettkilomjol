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
    let orgSize = window.document.body.clientHeight + window.document.body.clientWidth;
    this.autoHeight();
    let that = this;
    window.addEventListener("resize", function () {
      that.autoHeight(orgSize);
    }, false);

  }
  bottomnavout() {
    let element = document.getElementById("bottomnav");
    element.classList.remove("hide-mobile");
  }
  bottomnav() {
    let focus = document.activeElement;
    if (document.activeElement.tagName === "INPUT" && window.document.body.clientHeight < 600) {
      let element = document.getElementById("bottomnav");
      element.classList.add("hide-mobile");
    }
  }
  autoHeight(orgSize) {
    let header = document.querySelector('#header');
    let content = document.querySelector('#content');
    let footer = document.querySelector('#footer');
    if (footer.scrollHeight > 0) {
      content.style.minHeight = 0;
      content.style.minHeight = (window.document.body.scrollHeight - header.offsetHeight - footer.offsetHeight) + "px";
    }
    let newSize = window.document.body.clientHeight + window.document.body.clientWidth;
    if (orgSize) {
      if (orgSize > newSize && document.activeElement.tagName === "INPUT") {
        let element = document.getElementById("bottomnav");
        element.classList.add("hide-mobile");
      } else {
        let element = document.getElementById("bottomnav");
        element.classList.remove("hide-mobile");
      }
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
        <div className="hide-desktop" id="bottomnav">
          <BottomNavigation value={route} className="bottom-navigation-container">
            <BottomNavigationAction value="/" icon={<SearchIcon />} component={Link} to="/"></BottomNavigationAction>
            <BottomNavigationAction value="/favorites" icon={<FavoriteIcon />} component={Link} to="/favorites"></BottomNavigationAction>
            <BottomNavigationAction value="/grocerylists" icon={<ShoppingCartOutlinedIcon />} component={Link} to="/grocerylists"></BottomNavigationAction>
            <BottomNavigationAction className="bottomNavigationAction-contact" label="Kontakt" icon={<MailIcon />} onClick={() => { this.props.openContact('') }}></BottomNavigationAction>
          </BottomNavigation>
        </div>
      </div>
    );
  }
}
export default Footer;
