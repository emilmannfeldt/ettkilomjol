import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import './contact.css';
import { fire } from '../../base';

class Contact extends Component {
    state = {
        name: '',
        message: '',
        replyto: '',
        type: '',
    };
    componentDidMount() {
        if (!fire.auth().currentUser.isAnonymous) {
            this.setState({
                name: fire.auth().currentUser.displayName,
                replyto: fire.auth().currentUser.email
            });
        }
        this.setState({
            type: this.props.subject
        })
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    render() {

        return (
            <div className="container contact-container">
                <h2>Kontakta mig</h2>
                <form action="https://formspree.io/info.ettkilomjol@gmail.com"
                    method="POST">
                    <input type="text" name="_gotcha" style={{ display: 'none' }} />
                    <input type="hidden" name="_subject" value="Contact form" />
                    <div className="col-xs-12 no-gutter">
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
                                <MenuItem value={'recipe'}>Lägg till recept</MenuItem>
                                <MenuItem value={'other'}>Annat</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-xs-12 no-gutter">
                        <TextField className="contact-field"
                            label="Namn"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal"
                        />
                    </div>
                    <div className="col-xs-12 no-gutter">
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
                    </div>
                    <div className="col-xs-12 no-gutter">
                        <TextField className="contact-field"
                            label="Din email"
                            required
                            type="email"
                            name="_replyto"
                            value={this.state.replyto}
                            onChange={this.handleChange('replyto')}
                            margin="normal"
                        />
                    </div>
                    <div className="col-xs-12 no-gutter">
                        <Button color="primary" variant="contained" type="submit">Skicka</Button>
                    </div>
                </form>
            </div>
        );
    }
}
export default Contact;