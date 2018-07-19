import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
class Portion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPortionIndex: 1,
        };

    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        this.props.portionsUpdate(event.target.value);
    };

    render() {
        //det finns många receipt som har liknande "2 st" "2 små plåtar" etc
        //täcker jag alla som har en ren siffra och alla som börjar med ett nummer så får jag fixa de andra i inläsningen.
        //de som har ren siffra skriver jag om till x portioner
        //de som har siffra + text blir till att jag använder texten så det blir t.ex.
        //"2 st", "4 st" i selecten. hela texten är med i selecttexten. men själva valuet i selectitems blir bara indexet av selectens position.
        // index 0= multiplyer 0.5 index 1 är defaulten som är på 1, 
        //0.5,1,1.5,2,2.5,3

        //de som behöver fixas är de som har "2-4" "ca 2 st" "1,5" "3dl" "ger 50 bitar" "ger ca 40 bitar"
        function PortionItems(props) {
            let items = [];
            items.push(< MenuItem key={0} value={0.5} >{(props.portionNumber * 0.5) + " " + props.portionText}</MenuItem >);
            items.push(< MenuItem key={1} value={1} >{(props.portionNumber * 1) + " " + props.portionText}</MenuItem >);
            items.push(< MenuItem key={2} value={1.5} >{(props.portionNumber * 1.5) + " " + props.portionText}</MenuItem >);
            items.push(< MenuItem key={3} value={2} >{(props.portionNumber * 2) + " " + props.portionText}</MenuItem >);
            items.push(< MenuItem key={4} value={2.5} >{(props.portionNumber * 2.5) + " " + props.portionText}</MenuItem >);
            items.push(< MenuItem key={5} value={3} >{(props.portionNumber * 3) + " " + props.portionText}</MenuItem >);


            return (items);
        }
        let portionValue;
        let portionText = "";
        if (this.props.portions) {
            if (!isNaN(this.props.portions)) {
                portionValue = Number(this.props.portions);
                portionText = "portioner";
            } else {
                let splited = this.props.portions.split(" ");
                if (splited.length > 1 && !isNaN(splited[0])) {
                    portionValue = Number(splited[0]);
                    portionText = this.props.portions.substr(this.props.portions.indexOf(splited[1]));
                }
            }
        }

        if (portionValue) {
            return (
                <div className="recipecard-portion">
                    <Select value={this.state.selectedPortionIndex}
                        onChange={this.handleChange('selectedPortionIndex')}
                        displayEmpty
                        inputProps={{
                            name: 'selectedPortionIndex',
                            id: 'portion-simple',
                        }}
                    >
                        < MenuItem key={0} value={0.5} >{(portionValue * 0.5) + " " + portionText}</MenuItem >
                        < MenuItem key={1} value={1} >{(portionValue * 1) + " " + portionText}</MenuItem >
                        < MenuItem key={2} value={1.5} >{(portionValue * 1.5) + " " + portionText}</MenuItem >
                        < MenuItem key={3} value={2} >{(portionValue * 2) + " " + portionText}</MenuItem >
                        < MenuItem key={4} value={2.5} >{(portionValue * 2.5) + " " + portionText}</MenuItem >
                        < MenuItem key={5} value={3} >{(portionValue * 3) + " " + portionText}</MenuItem >
                    </Select></div>
            );
        } else {
            return (<div className="recipecard-portion">{this.props.portions}
            </div>);
        }
    }
}
export default Portion;