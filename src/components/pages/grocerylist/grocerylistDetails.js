import React, { Component } from 'react';
import { fire } from '../../../base';
import List from '@material-ui/core/List';
import GroceryItem from './groceryItem';
import Divider from '@material-ui/core/Divider';
import NewGroceryItem from './newGroceryItem';
import ListItem from '@material-ui/core/ListItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import IconButton from '@material-ui/core/IconButton';



class GrocerylistDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.updateItem = this.updateItem.bind(this);
        this.createItem = this.createItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.printPage = this.printPage.bind(this);
    }
    printPage() {
        window.print();
    }
    createItem(item) {
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + this.props.grocerylist.name + '/items').push(item, function (error) {
            if (error) {
                //console.log('Error has occured during saving process');
            }
            else {
                //console.log("Data hss been dleted succesfully");
            }
        });
    }
    updateItem(item, key) {
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + this.props.grocerylist.name + '/items/' + key).update(item, function (error) {
            if (error) {
                //console.log('Error has occured during saving process');
            }
            else {
                //console.log("Data hss been dleted succesfully");
            }
        });
    }
    deleteItem(key) {
        let items = {};
        items[key] = null;
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + this.props.grocerylist.name + '/items').update(items, function (error) {
            if (error) {
                //console.log('Error has occured during saving process');
            }
            else {
                //console.log("Data hss been dleted succesfully");
            }
        });
    }

    render() {

        //vill jag ha det precis som ica med att färdiga items hamnar i en egen lista? eller kan det räcka med att sortera items på done
        return (<div className="col-xs-12 grocerylist-details--container">
            <List className="grocerylist-itemlist">
                <ListItem className="grocerylist-header text-big">
                    <IconButton onClick={this.props.return}>
                        <ChevronLeftIcon />
                    </IconButton>
                    {this.props.grocerylist.name}
                    <IconButton onClick={this.printPage} className="print-btn">
                        <PrintIcon />
                    </IconButton>
                </ListItem>
                <NewGroceryItem foods={this.props.foods} units={this.props.units} createItem={this.createItem} grocerylistItems={this.props.grocerylist.items} />
                {this.props.grocerylist.items &&
                    this.props.grocerylist.items.map((grocerytItem, index) =>
                        <div key={grocerytItem.key}>
                            <GroceryItem itemId={index} ref="child" foods={this.props.foods} units={this.props.units} updateItem={this.updateItem}
                                groceryItem={grocerytItem} deleteItem={this.deleteItem}
                                itemList={this.props.grocerylist.items} />
                            {index === this.props.grocerylist.items.length - 1 ? (null) : (<Divider />)}
                        </div>
                    )
                }
            </List>
        </div>);
    }
}
export default GrocerylistDetails;