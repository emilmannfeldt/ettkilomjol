import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Fade from '@material-ui/core/Fade';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

class GrocerylistCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.chooseList = this.chooseList.bind(this);
    this.deleteList = this.deleteList.bind(this);
  }

  chooseList() {
    const { setCurrentList, grocerylist } = this.props;
    setCurrentList(grocerylist);
  }

  deleteList() {
    const { deleteList, grocerylist } = this.props;
    deleteList(grocerylist);
  }

  render() {
    const { grocerylist } = this.props;
    let itemString = '';
    if (grocerylist.items) {
      itemString = grocerylist.items.reduce((result_, item, index) => {
        let result = result_;
        if (index > 0) {
          result += ', ';
        }
        result += item.name;
        return result;
      }, '');
    } else {
      itemString = 'Inga varor tillagda.';
    }
    return (
      <Grid item container xs={12} className="list-item">
        <Fade
          in
          timeout={500}
        >
          <Card className="grocerylist-card">
            <CardHeader
              className="grocerylist-card-header"
              avatar={(
                <IconButton onClick={this.chooseList} className="grocerylist-icon--primarycolor">
                  <AssignmentIcon />
                </IconButton>
              )}
              action={(
                <IconButton onClick={this.deleteList}>
                  <DeleteIcon />
                </IconButton>
              )}
              title={grocerylist.name}
              subheader={<span>{itemString}</span>}
              classes={{
                content: 'grocerylist-cardheader-content',
                subheader: 'grocerylist-cardheader-subheader',
              }}
            />
          </Card>
        </Fade>
      </Grid>
    );
  }
}
GrocerylistCard.propTypes = {
  setCurrentList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  grocerylist: PropTypes.object.isRequired,
};
export default GrocerylistCard;
