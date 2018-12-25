/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { Component } from 'react';
import './footer.css';
import { Link } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/MailOutline';

function autoHeight(orgSize) {
  const content = document.querySelector('#content');
  const footer = document.querySelector('#footer');
  if (footer.scrollHeight > 0) {
    content.style.minHeight = 0;
    content.style.minHeight = `${window.document.body.scrollHeight - footer.offsetHeight}px`;
  }
  const newSize = window.document.body.clientHeight + window.document.body.clientWidth;
  if (orgSize) {
    if (orgSize > newSize && document.activeElement.tagName === 'INPUT') {
      const element = document.getElementById('bottomnav');
      element.classList.add('hide-mobile');
    } else {
      const element = document.getElementById('bottomnav');
      element.classList.remove('hide-mobile');
    }
  }
}
class Footer extends Component {
  componentDidMount() {
    const orgSize = window.document.body.clientHeight + window.document.body.clientWidth;
    autoHeight();
    window.addEventListener('resize', () => {
      autoHeight(orgSize);
    }, false);
  }

  render() {
    const { openContact } = this.props;
    const route = window.location.href.substr(window.location.href.indexOf('/#/') + 2);
    return (
      <div style={{ backgroundColor: '#efe9e6' }}>
        <footer id="footer" className="footer-content hide-mobile">
          <Grid item container>
            <Grid item xs={12} className="social">
              <ul className="social-links">
                <li>
                  <a href="https://github.com/emilmannfeldt/ettkilomjol">
                  GitHub

                  </a>

                </li>
                <li>
                  <a href="https://www.linkedin.com/in/mannfeldt/">
                  LinkedIn

                  </a>

                </li>
              </ul>
            </Grid>
            <Grid item container xs={12} className="info">
              <Grid item xs={4}>
                <ul>
                  <li><a href="#" onClick={() => { openContact(''); }}>Kontakta mig</a></li>
                </ul>
              </Grid>
              <Grid item xs={4}>
                <ul>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/stats">Statistik</Link></li>
                </ul>
              </Grid>
              <Grid item xs={4}>
                <ul>
                  <li><Link to="/privacy">Integritetspolicy</Link></li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
        </footer>
        <div className="hide-desktop" id="bottomnav">
          <BottomNavigation value={route} className="bottom-navigation-container">
            <BottomNavigationAction value="/" icon={<SearchIcon />} component={Link} to="/" />
            <BottomNavigationAction value="/favorites" icon={<FavoriteIcon />} component={Link} to="/favorites" />
            <BottomNavigationAction value="/grocerylists" icon={<ShoppingCartOutlinedIcon />} component={Link} to="/grocerylists" />
            <BottomNavigationAction className="bottomNavigationAction-contact" label="Kontakt" icon={<MailIcon />} onClick={() => { openContact(''); }} />
          </BottomNavigation>
        </div>
      </div>
    );
  }
}
Footer.propTypes = {
  openContact: PropTypes.func.isRequired,
};
export default Footer;
