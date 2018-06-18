import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
class Faq extends Component {

    render() {
        //sätt upp en faq kort
        //fixa en sida för "mina favoritrecept"
        //använd recipecard? något problem med det? vill jag visa på något annat sätt? 
        //sortering?
        //kunna filtrera på recept-title
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
                            Om du vill se dina egna recept här så behöver du skapa receptet på någon av dessa sidor (tasteline.com, ica.se, mittkok.expressen.se, koket.se). När du gjort detta kan du maila mig din länk till info.ettkilomjol@gmail.com. Så kan jag se till att receptet dyker upp här.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            Jag har ett problem med appen, hur kan jag få hjälp?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            Du kan maila mig på info.ettkilomjol@gmail.com.
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