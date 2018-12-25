import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import './util.css';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { fire } from '../../base';

class Contact extends Component {
    state = {
      name: '',
      message: '',
      replyto: '',
      type: '',
      helptext: 'dsa',
    };

    componentDidMount() {
      const { subject } = this.props;
      if (!fire.auth().currentUser.isAnonymous) {
        this.setState({
          name: fire.auth().currentUser.displayName,
          replyto: fire.auth().currentUser.email,
        });
      }

      this.setState({
        type: subject,
      });
      this.updateHelptext(subject);
    }

    handleChange = name => (event) => {
      this.setState({
        [name]: event.target.value,
      });
      if (name === 'type') {
        this.updateHelptext(event.target.value);
      }
    };

    updateHelptext(subject) {
      const helptext = {
        tip: 'Beskriv vad du skulle vilja kunna göra eller vad som du känner kan förbättras.',
        help: 'Beskriv vad du stött på för problem.',
        recipeError: 'Beskriv vad som är fel med receptet och bifoga länken till receptet.',
        newRecipe: 'För att kunna få tillgång till ditt recept här behöver du skapa ditt recept på Ica, tasteline, koket, eller mittkok. Bifoga sedan länk till ditt skapade receptet här.',
        other: '',
      };
      this.setState({
        helptext: helptext[subject],
      });
    }

    render() {
      const { onClose } = this.props;
      const {
        helptext, type, name, message, replyto,
      } = this.state;
      return (
        <Dialog
          className="contact-dialog"
          open
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <form action="https://formspree.io/info.ettkilomjol@gmail.com" method="POST">
            <DialogTitle id="simple-dialog-title">Kontakta mig</DialogTitle>
            <DialogContent className="dialog-content">
              <DialogContentText>
                {helptext}
              </DialogContentText>
              <input type="text" name="_gotcha" style={{ display: 'none' }} />
              <input type="hidden" name="_subject" value="Contact form" />
              <FormControl className="contact-field">
                <InputLabel htmlFor="age-simple">Ämne</InputLabel>
                <Select
                  autoWidth
                  required
                  value={type}
                  onChange={this.handleChange('type')}
                  inputProps={{
                    name: 'type',
                    value: type,
                  }}
                >
                  <MenuItem value="tip">Tips på förbättring / ny feature</MenuItem>
                  <MenuItem value="help">Hjälp</MenuItem>
                  <MenuItem value="recipeError">Felanmäl recept</MenuItem>
                  <MenuItem value="newRecipe">Lägg till recept</MenuItem>
                  <MenuItem value="other">Annat</MenuItem>
                </Select>
              </FormControl>

              <TextField
                className="contact-field"
                label="Namn"
                name="name"
                value={name}
                onChange={this.handleChange('name')}
                margin="normal"
              />

              <TextField
                className="contact-field"
                required
                label="Meddelande"
                multiline
                name="message"
                value={message}
                onChange={this.handleChange('message')}
                rowsMax="20"
                margin="normal"
              />
              <TextField
                className="contact-field"
                label="Din email"
                required
                type="email"
                name="_replyto"
                value={replyto}
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
Contact.propTypes = {
  onClose: PropTypes.func.isRequired,
  subject: PropTypes.string.isRequired,
};
export default Contact;
