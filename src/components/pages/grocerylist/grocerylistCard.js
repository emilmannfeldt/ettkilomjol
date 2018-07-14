import React, { Component } from 'react';
import { Card } from 'material-ui/Card';
import Fade from '@material-ui/core/Fade';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';


class GrocerylistCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.chooseList = this.chooseList.bind(this);
    this.deleteList = this.deleteList.bind(this);


    //jag får lägga någon form av route/link här eller i myGroceryLists så att när jag klickar på en lista kommer jag till /uid/grocerylistname
    //mockar jag upp det bland alla andra routes? den ska routa till en cmoponent som är groceryList.js eller liknande som är en sida där bara en specifik lista vias och man kan editera allt i den
  }
  //här ska jag fylla på med delete funktion, och snygga till utseendet. kanske lägga till datumet. ska vara tydligt att det är klikbart, hover ändrar lite på färgen, cursor.

  chooseList() {
    this.props.setCurrentList(this.props.grocerylist);
  }
  deleteList() {
    this.props.deleteList(this.props.grocerylist);

    //ta bort this.props.grocerylist från firebase
    //skapa en snackbar med UNDO på sig 
    //undo fungerar så att jag sparat undan listan i stateoch klickar man på undo så lägger jag tillbaka receptet i firebase?
    //det vore bättre om undo inte skulle kräva detle + add. utan att man döljer listan först och tar bort det när snackbaren stänger/efter samma antal sekunder.
    //undo avbryter då denna timer.
    //måste köra denna deleteList-metod i mygrocerList.js för denna komponent försvinner ju när jag tar bort det så state för undo fungerar inte att ha här.
  }
  render() {
    let itemString = "";
    if (this.props.grocerylist.items) {
      for (let i = 0; i < this.props.grocerylist.items.length; i++) {
        let item = this.props.grocerylist.items[i];
        let tmp = (item.amount || "") + " " + (item.unit || "") + " " + item.name + ",";
        tmp = tmp.trim();
        itemString += tmp + " ";
      }
      itemString = itemString.trim();
    }else{
      itemString = "Inga varor tillagda.";
    }
    return (<div className="col-xs-12 list-item">
      <Fade in={true}
        timeout={500}>
        <Card>
          <CardHeader className="grocerylist-card-header"
            avatar={
              <IconButton onClick={this.chooseList}>
                <AssignmentIcon />
              </IconButton>
            }
            action={
              <IconButton onClick={this.deleteList}>
                <DeleteIcon />
              </IconButton>
            }
            title={<span className="grocerylist-card-title" onClick={this.chooseList}>{this.props.grocerylist.name}</span>}
            subheader={<span className="grocerylist-card-subheader">{itemString}</span>}
          />
        </Card>
      </Fade>
    </div>);
  }
}
export default GrocerylistCard;
