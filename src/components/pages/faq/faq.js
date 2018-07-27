import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import './faq.css'

class Faq extends Component {

    render() {
        return (
            <div className="container">
                <div className="col-xs-12 faq-title">
                    <h2 className="page-title">Frequently Asked Questions</h2>
                </div>
                <div className="faq-container col-xs-12 text-medium">
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>Var kommer alla recept ifrån?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="text-small">
                            Recepten på ettkilomjol kommer från flera av Sveriges största receptsidor på nätet. Tasteline.com, ica.se, mittkok.expressen.se, koket.se.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Hur kan jag lägga till egna recept?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="faq-panel text-small">
                            Om du vill se dina egna recept här så behöver du skapa receptet på någon av dessa sidor (tasteline.com, ica.se, mittkok.expressen.se, koket.se). När du gjort det kan du kontakta mig med länken.
                            <Button variant="contained" color="primary" className="faq-contact-btn" onClick={() => { this.props.openContact('newRecipe') }}>Kontakta mig</Button>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Jag har ett problem med appen, hur kan jag få hjälp?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="faq-panel text-small">
                            Absolut. Du kan kontakta mig här nedan.
                            <Button color="primary" className="faq-contact-btn" variant="contained" onClick={() => { this.props.openContact('help') }}>Kontakta mig</Button>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Jag har en matallergi, kan jag filtrera på recept för mig?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="text-small">
                            Ja. Du kan söka på en mängd olika preferenser utöver ingredienser t.ex. "glutenfri" eller "laktosfri". Alla recept är inte säkert att de uppfyller alla dina preferenser. Kolla på de gröna taggarna om recptet har din preferens.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Jag hittar inga recept som passar mig. Vad kan jag göra?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="text-small">
                            Ju fler sökord du lägger till deto bättre resultat får du.
                            Du kan testa att söka på nära angränsande eller alternativa ingredienser. T.ex buljong/buljongtärning, nötfärs/köttfärs, lax/laxfilé, lime/limeklyfta.
                            <br></br>
                            <br></br>
                            Du kan även lägga till preferenser för att hitta recept som passar just dig. Du kan priortiera recept efter ursprung, diet, tillfälle, allergier, svårighetsgrad m.m.
                            Glöm inte att sortera på relevans för att sortera efter recepten som bäst matchar din sökning.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </div>
        );
    }
}
export default Faq;