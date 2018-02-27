import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  //här ska jag bygga upp en header med login/register knapp om man inte är authed. annars visas ikoner för "min profil, mina recept, inköpslistor, logga ut"
  //https://www.youtube.com/watch?v=XMuoDQy61ys
  //https://www.youtube.com/watch?v=-OKrloDzGpU
  
 // får in metoder här från app.js för logout/signin/register new user. 
  //slutresultatet ska vara ett korrekt state i app.js över inloggad användare och tillgörande data för denna som sedan skickas vidare till berörda componenter.
  //se om jag kan dela upp / bryta ut mer delar från index.js för att snygga till den.
  //kanske behöver använda react routing?
      
//problem med run deploy..
//push behöver jag skriva in namn och lösenord igen
//senaste tre commitsen har inte kunnat deployats, recipebackups, mailchimp, header.js, base.js
//testa felsökning annars försök styra om till firebase hosting?

  render() {
    return (
    <div>
</div>
    );
  }
}
export default Header;

