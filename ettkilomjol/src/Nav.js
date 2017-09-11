import React, { Component } from 'react';
import ReactRouter from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

let NavLink = ReactRouter.NavLink;

class Nav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: {
                ingredients: [],
            }
        };
        this.handleFilterInput = this.handleFilterInput.bind(this);
    }
    render() {
        return (
            <Toolbar>
        <ToolbarGroup firstChild={true}>

        </ToolbarGroup>
        <NavLink to='/datachange'>Datachange</NavLink>
        <ToolbarGroup>
       
        </ToolbarGroup>
      </Toolbar>
        );
    }
}
export default Nav;
