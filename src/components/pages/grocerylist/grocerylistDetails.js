import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import NewGroceryItem from './newGroceryItem';
import GroceryItem from './groceryItem';
import { fire } from '../../../base';

function printPage() {
  window.print();
}

class GrocerylistDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.updateItem = this.updateItem.bind(this);
    this.createItem = this.createItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  createItem(item) {
    const { grocerylist } = this.props;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${grocerylist.name}/items`).push(item);
  }

  updateItem(item, key) {
    const { grocerylist } = this.props;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${grocerylist.name}/items/${key}`).update(item);
  }

  deleteItem(key) {
    const { grocerylist } = this.props;
    const items = {};
    items[key] = null;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${grocerylist.name}/items`).update(items);
  }

  render() {
    const {
      returnFunc, grocerylist, foods, units,
    } = this.props;
    return (
      <Grid item container xs={12} className="grocerylist-details--container">
        <List className="grocerylist-itemlist">
          <ListItem className="grocerylist-header text-big">
            <IconButton onClick={returnFunc}>
              <ChevronLeftIcon />
            </IconButton>
            {grocerylist.name}
            <IconButton onClick={printPage} className="print-btn">
              <PrintIcon />
            </IconButton>
          </ListItem>
          <NewGroceryItem foods={foods} units={units} createItem={this.createItem} grocerylistItems={grocerylist.items} />
          {grocerylist.items
                    && grocerylist.items.map((grocerytItem, index) => (
                      <div key={grocerytItem.key}>
                        <GroceryItem
                          itemId={index}
                          foods={foods}
                          units={units}
                          updateItem={this.updateItem}
                          groceryItem={grocerytItem}
                          deleteItem={this.deleteItem}
                          itemList={grocerylist.items}
                        />
                        {index === grocerylist.items.length - 1 ? (null) : (<Divider />)}
                      </div>
                    ))
                }
        </List>
      </Grid>
    );
  }
}
GrocerylistDetails.propTypes = {
  grocerylist: PropTypes.object.isRequired,
  foods: PropTypes.array.isRequired,
  units: PropTypes.any.isRequired,
  returnFunc: PropTypes.func.isRequired,
};
export default GrocerylistDetails;
