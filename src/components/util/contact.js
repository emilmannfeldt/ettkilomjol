import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import './util.css';
import { fire } from '../../base';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

class Contact extends Component {
    state = {
        name: '',
        message: '',
        replyto: '',
        type: '',
        helptext: 'dsa'
    };
    componentDidMount() {
        if (!fire.auth().currentUser.isAnonymous) {
            this.setState({
                name: fire.auth().currentUser.displayName,
                replyto: fire.auth().currentUser.email
            });
        }

        this.setState({
            type: this.props.subject,
        });
        this.updateHelptext(this.props.subject);
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        if (name === "type") {
            this.updateHelptext(event.target.value);
        }
    };

    updateHelptext(subject) {
        let helptext = "";
        switch (subject) {
            case 'tip':
                helptext = "Beskriv vad du skulle vilja kunna göra eller vad som du känner kan förbättras.";
                break;
            case 'help':
                helptext = "Beskriv vad du stött på för problem.";
                break;
            case 'recipeError':
                helptext = "Beskriv vad som är fel med receptet och bifoga länken till receptet.";
                break;
            case 'newRecipe':
                helptext = "För att kunna få tillgång till ditt recept här behöver du skapa ditt recept på Ica, tasteline, koket, eller mittkok. Bifoga sedan länk till ditt skapade receptet här.";
                break;
            case 'other':
                helptext = "";
                break;
            case undefined:
                break;
            default:
                break;
        }
        this.setState({
            helptext: helptext,
        });
    }
    render() {

        return (
            <Dialog className="contact-dialog"
                open={true}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
            >
                <form action="https://formspree.io/info.ettkilomjol@gmail.com" method="POST">
                    <DialogTitle id="simple-dialog-title">Kontakta mig</DialogTitle>
                    <DialogContent className="contact-dialog-content">
                        <DialogContentText>
                            {this.state.helptext}
                        </DialogContentText>
                        <input type="text" name="_gotcha" style={{ display: 'none' }} />
                        <input type="hidden" name="_subject" value="Contact form" />
                        <FormControl className="contact-field">
                            <InputLabel htmlFor="age-simple">Ämne</InputLabel>
                            <Select autoWidth={true}
                                required
                                value={this.state.type}
                                onChange={this.handleChange('type')}
                                inputProps={{
                                    name: 'type',
                                    value: this.state.type
                                }}
                            >
                                <MenuItem value={'tip'}>Tips på förbättring / ny feature</MenuItem>
                                <MenuItem value={'help'}>Hjälp</MenuItem>
                                <MenuItem value={'recipeError'}>Felanmäl recept</MenuItem>
                                <MenuItem value={'newRecipe'}>Lägg till recept</MenuItem>
                                <MenuItem value={'other'}>Annat</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField className="contact-field"
                            label="Namn"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal"
                        />

                        <TextField className="contact-field"
                            required
                            label="Meddelande"
                            multiline
                            name="message"
                            value={this.state.message}
                            onChange={this.handleChange('message')}
                            rowsMax="20"
                            margin="normal"
                        />
                        <TextField className="contact-field"
                            label="Din email"
                            required
                            type="email"
                            name="_replyto"
                            value={this.state.replyto}
                            onChange={this.handleChange('replyto')}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" variant="contained" type="submit">Skicka</Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}
export default Contact;