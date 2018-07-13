import React, { Component } from 'react';
import { fire } from '../../base';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import GroceryItem from './groceryItem';
import Divider from '@material-ui/core/Divider';
import NewGroceryItem from './newGroceryItem';
import ListItem from '@material-ui/core/ListItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';



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
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + this.props.grocerylist.name + '/items').push(item, function (error) {
            if (error) {
                console.log('Error has occured during saving process');
            }
            else {
                console.log("Data hss been dleted succesfully");
            }
        });
    }
    updateItem(item, key) {
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + this.props.grocerylist.name + '/items/' + key).update(item, function (error) {
            if (error) {
                console.log('Error has occured during saving process');
            }
            else {
                console.log("Data hss been dleted succesfully");
            }
        });
    }
    deleteItem(key) {
        let items = {};
        items[key] = null;
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + this.props.grocerylist.name + '/items').update(items, function (error) {
            if (error) {
                console.log('Error has occured during saving process');
            }
            else {
                console.log("Data hss been dleted succesfully");
            }
        });
    }

    render() {
        //vill jag ha det precis som ica med att färdiga items hamnar i en egen lista? eller kan det räcka med att sortera items på done
        return (<div>
            <List className="grocerylist-itemlist">
                <ListItem className="grocerylist-header">
                <IconButton onClick={this.props.return}>
                    <ChevronLeftIcon />
                </IconButton>
                    {this.props.grocerylist.name}
                </ListItem>
                <NewGroceryItem foods={this.props.foods} units={this.props.units} createItem={this.createItem} grocerylistItems={this.props.grocerylist.items} />
                {this.props.grocerylist.items ? (this.props.grocerylist.items.map((grocerytItem, index) =>
                    <div key={index}>
                        <GroceryItem key={index} itemId={index} ref="child" foods={this.props.foods} units={this.props.units} updateItem={this.updateItem}
                            groceryItem={grocerytItem} deleteItem={this.deleteItem}
                            itemList={this.props.grocerylist.items} />
                        {index === this.props.grocerylist.items.length - 1 ? (null) : (<Divider />)}
                    </div>
                )) : (null)}
            </List>
        </div>);
    }
}
export default GrocerylistDetails;