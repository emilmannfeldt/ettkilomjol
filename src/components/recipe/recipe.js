import React, { Component } from 'react';
import './recipe.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Fade from '@material-ui/core/Fade';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { fire } from '../../base';
import Time from './time';
import Tags from './tags';
import Favorite from './favorite';
import Level from './level';
import Rating from './rating';
import Portion from './portion';
import Ingredientlist from './ingredientlist';
import IngredientProgress from './ingredientProgress';
import AddGroceryDialog from './addGroceryDialog';
import Utils from '../../util';

const styles = theme => ({
  recipeCard: {
    padding: 15,
    flexGrow: 1,
    marginBottom: 6,
    position: 'relative',
  },
  wrapper: {},
  title: {
    fontSize: 14,
    lineHeight: 1,
  },
  image: {
    width: '100%',
    height: 210,
    borderRadius: 3,
    marginTop: -10,
  },
  actions: {
    color: '#f50057',
    position: 'absolute',
    top: 15,
    right: 15,
    width: 110,
  },
  [theme.breakpoints.up('sm')]: {
    image: {
      width: 300,
      height: 300,
      marginTop: 15,
      marginBottom: 15,
      marginLeft: -15,
      marginRight:15,
      borderRadius: '0px 3px 3px 0px',
    },
    recipeCard: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  [theme.breakpoints.up('md')]: {
    image: {
      marginRight: 15,
      marginLeft: 0,
      borderRadius: 3,
    },
  },
  [theme.breakpoints.down('xs')]: {
    actions: {
      width: '100%',
    },
  },

});

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portionsMultiplier: 1,
      recipe: props.recipe,
    };
    this.toggleIngredientlist = this.toggleIngredientlist.bind(this);
    this.visitSource = this.visitSource.bind(this);
    this.showGroceryListDialog = this.showGroceryListDialog.bind(this);
    this.showGroceryListDialogInternal = this.showGroceryListDialogInternal.bind(this);
    this.closeGrocerylistDialog = this.closeGrocerylistDialog.bind(this);
    this.updatePortions = this.updatePortions.bind(this);
  }

  toggleIngredientlist() {
    const { recipe } = this.state;
    recipe.expanded = !recipe.expanded;
    this.setState({
      recipe,
    });
  }

  updatePortions(newPortionMultiplier) {
    const { recipe, portionsMultiplier } = this.state;
    const { units } = this.props;
    recipe.ingredients = Utils.convertIngredientPortions(recipe.ingredients, newPortionMultiplier, portionsMultiplier, units);
    this.setState({
      portionsMultiplier: newPortionMultiplier,
      recipe,
    });
  }

  visitSource() {
    const { recipe: { source } } = this.state;
    const recipeRef = fire.database().ref('recipes');
    recipeRef.orderByChild('source').equalTo(source).once('value', (snapshot) => {
      snapshot.forEach((child) => {
        const recipeTmp = child.val();
        // console.log("visiting " + child.val().source);
        if (recipeTmp.visits) {
          recipeTmp.visits += 1;
        } else {
          recipeTmp.visits = 1;
        }
        recipeRef.child(child.key).update(recipeTmp);
      });
    });
  }

  showGroceryListDialogInternal() {
    const { recipe } = this.state;
    this.showGroceryListDialog(recipe, recipe.ingredients);
  }

  showGroceryListDialog(recipe, items) {
    const { setSnackbar } = this.props;
    if (fire.auth().currentUser.isAnonymous) {
      setSnackbar('login_required');
    } else {
      this.setState({
        showGroceryDialog: true,
        itemsToAdd: items,
        recipeToAdd: recipe,
      });
    }
  }

  closeGrocerylistDialog() {
    this.setState({
      itemsToAdd: [],
      showGroceryDialog: false,
      recipeToAdd: {},
    });
  }

  render() {
    const {
      recipe, portionsMultiplier, showGroceryDialog, itemsToAdd, recipeToAdd,
    } = this.state;
    const {
      classes, filter, transitionDelay, isFav, demo, grocerylists, units, setSnackbar,
    } = this.props;

    const { missingIngredients, matchedIngredients } = recipe.ingredients.reduce((result, ingredient) => {
      if (filter.ingredients.includes(ingredient.name)) {
        result.matchedIngredients.push(ingredient.name);
      } else {
        result.missingIngredients.push(ingredient.name);
      }
      return result;
    },
    { missingIngredients: [], matchedIngredients: [] });

    const matchedTags = filter.tags.filter(tag => recipe.tags[tag]);
    return (
      <Grid item xs={12} className="list-item">
        <Fade
          in
          style={{ transitionDelay: transitionDelay * 200 }}
          timeout={500}
        >
          <Card className={classes.recipeCard}>
            <Grid item container xs={12}>
              <Grid item xs={12} sm style={{ display: 'contents' }}>
                <CardMedia
                  className={classes.image}
                  image={recipe.image}
                />
              </Grid>
              <Grid item xs={12} sm>
                <CardContent className="recipe-card-info row">
                  <Grid item container>
                    <Grid item xs={12}>
                      <div className="recipecard-title">
                        {demo ? (<h3 className="text-big">{recipe.title}</h3>
                        ) : (
                          <h3 className="text-big">
                            <a
                              onClick={this.visitSource}
                              target="_blank"
                              rel="noopener noreferrer"
                              href={recipe.source.indexOf('tasteline.com') > -1 ? `//www.${recipe.source}` : `//${recipe.source}`}
                            >
                              {recipe.title}

                            </a>
                          </h3>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="recipecard-author text-medium">
                        <span>
                          {recipe.author}
                          {recipe.createdFor ? `, ${recipe.createdFor}` : ''}
                          {recipe.created ? ` - ${recipe.created}` : ''}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className={classes.actions}>
                        <Favorite source={recipe.source} isFav={isFav} setSnackbar={setSnackbar} />
                        <IconButton onClick={this.showGroceryListDialogInternal} color="inherit" className="recipe-grocerylist--btn">
                          <ShoppingCartOutlinedIcon />
                        </IconButton>
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="recipecard-description text-medium">
                        {recipe.description}
                        {' '}
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="recipecard-rating text-small">
                        <Rating value={recipe.rating} votes={recipe.votes} />
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="text-small">
                        {recipe.time && <Time time={recipe.time} />}
                        <Level index={recipe.level} />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="recipecard-tags text-small">
                        <Tags matchedTags={matchedTags} recipeTags={recipe.tags} recipeKey={recipe.source} />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="recipecard-ingredients text-medium">
                        <IngredientProgress matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} toggleIngredientlist={this.toggleIngredientlist} />
                        {recipe.expanded && <Portion portionsUpdate={this.updatePortions} portions={recipe.portions} />}
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="ingredient-list text-medium">
                        {recipe.expanded && (
                        <Ingredientlist
                          handleAddItem={this.showGroceryListDialog}
                          portionsMultiplier={portionsMultiplier}
                          ingredients={recipe.ingredients}
                          missing={missingIngredients}
                        />
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Fade>
        <AddGroceryDialog
          units={units}
          open={!!showGroceryDialog}
          onClose={this.closeGrocerylistDialog}
          grocerylists={grocerylists}
          itemsToAdd={itemsToAdd}
          recipeToAdd={recipeToAdd}
          setSnackbar={setSnackbar}
        />
      </Grid>
    );
  }
}
Recipe.propTypes = {
  classes: PropTypes.object.isRequired,
  recipe: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
  transitionDelay: PropTypes.number.isRequired,
  isFav: PropTypes.bool,
  demo: PropTypes.bool,
  setSnackbar: PropTypes.func.isRequired,
  grocerylists: PropTypes.array,
};
export default withStyles(styles)(Recipe);
