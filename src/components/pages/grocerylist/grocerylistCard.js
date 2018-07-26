import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Fade from '@material-ui/core/Fade';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import IconButton from '@material-ui/core/IconButton';

class GrocerylistCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.chooseList = this.chooseList.bind(this);
    this.deleteList = this.deleteList.bind(this);

  }

  chooseList() {
    this.props.setCurrentList(this.props.grocerylist);
  }
  deleteList() {
    this.props.deleteList(this.props.grocerylist);
  }
  render() {

    let itemString = "";
    if (this.props.grocerylist.items) {
      for (let i = 0; i < this.props.grocerylist.items.length; i++) {
        let item = this.props.grocerylist.items[i];
        if (i > 0) {
          itemString += ", ";
        }
        itemString += item.name;
      }
    } else {
      itemString = "Inga varor tillagda.";
    }
    return (<div className="col-xs-12 list-item">
      <Fade in={true}
        timeout={500}>
        <Card>
          <CardHeader className="grocerylist-card-header"
            avatar={
              <IconButton onClick={this.chooseList} className="grocerylist-icon--primarycolor">
                <AssignmentIcon />
              </IconButton>
            }
            action={
              <IconButton onClick={this.deleteList}>
                <DeleteIcon />
              </IconButton>
            }
            title={<span className="grocerylist-card--title" onClick={this.chooseList}>{this.props.grocerylist.name}</span>}
            subheader={<span>{itemString}</span>}
            classes={{
              content: 'grocerylist-cardheader-content',
              subheader: 'grocerylist-cardheader-subheader',
            }}
          />
        </Card>
      </Fade>
    </div>);
  }
}
export default GrocerylistCard;