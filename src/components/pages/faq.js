import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

class Faq extends Component {


    render() {

        return (
            <div className="container"><h2>Frequently Asked Questions</h2>
                <div className="faq-container">
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>Var kommer alla recept ifrån?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Recepten på ettkilomjol kommer från flera av Sveriges största receptsidor på nätet. Tasteline.com, ica.se, mittkok.expressen.se, koket.se.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Hur kan jag lägga till egna recept?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Om du vill se dina egna recept här så behöver du skapa receptet på någon av dessa sidor (tasteline.com, ica.se, mittkok.expressen.se, koket.se). När du gjort det kan du kontakta mig med länken.
                            <Button onClick={() => {this.props.openContact('recipe')}}>Kontakta mig</Button>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Jag har ett problem med appen, hur kan jag få hjälp?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Absolut. Du kan kontakta mig här nedan.
                            <Button onClick={() => {this.props.openContact('help')}}>Kontakta mig</Button>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Jag har en matallergi, kan jag filtrera på recept för mig?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Ja. Du kan söka på en mängd olika preferenser utöver ingredienser t.ex. "glutenfri" eller "laktosfri". Alla recept är inte säkert att de uppfyller alla dina preferenser. Kolla på de gröna taggarna om recptet har din preferens.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </div>
        );
    }
}
export default Faq;