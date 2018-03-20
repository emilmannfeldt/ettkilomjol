import React, { Component } from 'react';
import './footer.css';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
<footer id="footer" className="container">  
        <div id="newsletter" className="newsletter-wrap col-lg-12">
          <h4>Få de senaste nyheterna!</h4>
          <RaisedButton className="login-btn" label="Prenumerera på nyhetsbrev" primary={true} />
        </div>
  //prenumerar knappen ska bort om den inte går att använda på något snygget sätt med pop upp mailchimp form när man klickar på den??
  //lägg till kontaka mig länk till en ny sida /contact där finns en formspree med olika fält för hjälp i olika ärenden 
  //(kanske även en kryssruta för mailchimp, kanske får manuellt lägga till dem som kryussar i rutan?)

  //länkar som ska visas: Kontakt, faq, annonsera, om webbplatsen, statistik, logga in(?) Några av dessa ämnen kan ligga på samma sida fast länkas till olika delar av sidan (scroll nivå)
  //t.ex. "om webbplatsen" och "statistik", "faq" och "kontakt"
        <div className="social col-lg-12">
          <ul className="social-links">
            <li><a href="https://www.facebook.com/KoketTV4">
  Facebook</a></li>
            <li><a href="https://instagram.com/koket.se/">
  Instagram</a></li>
            <li><a href="https://se.pinterest.com/kket0268/">
  Pinterest</a></li>
            <li><a href="https://www.youtube.com/c/koketse">
  YouTube</a></li>
          </ul>
        </div>
  
        <div className="info col-lg-12">
          <div className="col-lg-4">
            <ul>
              <li><a href="/om-koket">Om Köket.se</a></li>
              <li><a href="http://www.tv4.se/tv4/artiklar/allmänna-användarvillkor-för-tv4s-tjänster-5540a1dafca38f60e90000e6" rel="new-window">Allmänna användarvillkor</a></li>
              <li><a href="http://www.tv4.se/tv4/artiklar/om-cookies-4f955a0204bf72169c000004" rel="new-window">Om cookies</a></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <ul>
              <li><a href="/kontakta-koket">Kontakta Köket</a></li>
              <li><a href="http://www.tv4.se/tv4/artiklar/integritetspolicy-tv4-ab-54339befc45948a638000008" rel="new-window">Integritetspolicy</a></li>
              <li><a href="mailto:malin.liljeholm@tv4.se" title="Kontakta Malin Liljeholm">Annonsera på köket.se</a></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <ul>
              <li>Redaktörer: <a href="mailto:info@koket.se" title="Kontakta redaktionen">Emma Langlet Vessman</a> och <a href="mailto:info@koket.se" title="Kontakta redaktionen">Lina Sandén</a></li>
              <li>Ansvarig utgivare: <a href="mailto:ida.tapper@tv4.se" title="Kontakta ansvarig utgivare">Ida Tapper</a></li>
            </ul>
          </div>
        </div>
  </footer>
    );
  }
}
export default Footer;
