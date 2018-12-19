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
  },
  actions: {
    color: '#ffb3b7',
  },
  [theme.breakpoints.up('sm')]: {
    image: {
      width: 300,
      height: 300,
      marginTop: 15,
      marginBottom: 15,
      marginLeft: 5,
    },
  },
  [theme.breakpoints.down('xs')]: {
    actions: {
      position: 'absolute',
      top: 15,
      right: 15,
      width: '100%',
    },
  },

});

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portionsMultiplier: 1,
      recipe: this.props.recipe,
    };
    this.toggleIngredientlist = this.toggleIngredientlist.bind(this);
    this.closeIngredientlist = this.closeIngredientlist.bind(this);
    this.visitSource = this.visitSource.bind(this);
    this.showGroceryListDialog = this.showGroceryListDialog.bind(this);
    this.showGroceryListDialogInternal = this.showGroceryListDialogInternal.bind(this);
    this.closeGrocerylistDialog = this.closeGrocerylistDialog.bind(this);
    this.updatePortions = this.updatePortions.bind(this);
  }

  toggleIngredientlist() {
    const recipe = this.state.recipe;
    recipe.expanded = !recipe.expanded;
    this.setState({
      recipe,
    });
  }

  closeIngredientlist() {
    this.setState({
      expanded: false,
    });
  }

  updatePortions(newPortionMultiplier) {
    const recipe = this.state.recipe;
    for (let i = 0; i < recipe.ingredients.length; i++) {
      if (recipe.ingredients[i].amount) {
        recipe.ingredients[i].amount = Utils.closestDecimals(recipe.ingredients[i].amount * (newPortionMultiplier / this.state.portionsMultiplier));
        if (recipe.ingredients[i].unit) {
          recipe.ingredients[i] = Utils.correctIngredientUnit(recipe.ingredients[i], this.props.units);
          // 8. recepten som tillhör inköslistan ska bara finnas med under en knapp. "visa recept" klickar man där visas alla recipecards som grocerylist.recipes har.
          // gå ut med detta till gruppen i helgen. vår chatgrupp först kanske :)
          // fixa bättre felhantering på grocerylists. felmeddelandet ska skrivas intill fältet. kanske en required på amount som name och unit finns: required={name && unit}
        }// kolla best pracite för felmeddelanden. Alert? rödfärg vid knappen? vid fältet? snackbar? toaster?
        // felmeddelanden: männskilga, humor, placera vid relevant fält.
      }
    }
    this.setState({
      portionsMultiplier: newPortionMultiplier,
      recipe,
    });
  }

  visitSource() {
    const recipeRef = fire.database().ref('recipes');
    recipeRef.orderByChild('source').equalTo(this.state.recipe.source).once('value', (snapshot) => {
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
    this.showGroceryListDialog(this.state.recipe, this.state.recipe.ingredients);
  }

  showGroceryListDialog(recipe, items) {
    if (fire.auth().currentUser.isAnonymous) {
      this.props.setSnackbar('login_required');
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
    const { classes } = this.props;
    const matchedIngredients = [];
    const missingIngredients = [];
    const matchedTags = [];
    for (let i = 0; i < this.state.recipe.ingredients.length; i++) {
      const name = this.state.recipe.ingredients[i].name;
      if (this.props.filter.ingredients.indexOf(name) > -1) {
        matchedIngredients.push(this.state.recipe.ingredients[i]);
      } else {
        missingIngredients.push(name);
      }
    }
    for (const tag in this.state.recipe.tags) {
      if (this.state.recipe.tags.hasOwnProperty(tag)) {
        if (this.props.filter.tags.indexOf(tag) > -1) {
          matchedTags.push(tag);
        }
      }
    }

    // få card content mer kompakt, använd cardheader och footer?
    // BUGG: när jag angett food och tags så det går över en rad så försvinner den raden??

    // ta bort bootstrap helt? ersätt med grid på alla ställen.
    // testa igenom allt
    // fixa eslintar
    return (
      <Grid item xs={12} className="list-item">
        <Fade
          in
          style={{ transitionDelay: this.props.transitionDelay * 200 }}
          timeout={500}
        >
          <Card className={classes.recipeCard}>
            <Grid item container xs={12}>
              <Grid item xs={12} sm style={{ display: 'contents' }}>
                <CardMedia
                  className={classes.image}
                  image={this.state.recipe.image}
                />
              </Grid>
              <Grid item xs={12} sm>
                <CardContent className="recipe-card-info row">
                  <Grid item container>
                    <Grid item xs={12}>
                      <div className="recipecard-title">
                        {this.props.demo ? (<h3 className="text-big">{this.state.recipe.title}</h3>
                        ) : (<h3 className="text-big">
                          <a
                            onClick={this.visitSource}
                            target="_blank"
                            href={this.state.recipe.source.indexOf('tasteline.com') > -1 ? `//www.${this.state.recipe.source}` : `//${this.state.recipe.source}`}
                          >
                            {this.state.recipe.title}

                          </a>

                             </h3>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="recipecard-author text-medium">
                        <span>
                          {this.state.recipe.author}
                          {this.state.recipe.createdFor ? `, ${this.state.recipe.createdFor}` : ''}
                          {this.state.recipe.created ? ` - ${this.state.recipe.created}` : ''}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className={classes.actions}>
                        <Favorite source={this.state.recipe.source} isFav={this.props.isFav} setSnackbar={this.props.setSnackbar} />
                        <IconButton onClick={this.showGroceryListDialogInternal} color="inherit" className="recipe-grocerylist--btn">
                          <ShoppingCartOutlinedIcon />
                        </IconButton>
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="recipecard-description text-medium">
                        {this.state.recipe.description}
                        {' '}
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="recipecard-rating text-small">
                        <Rating value={this.state.recipe.rating} votes={this.state.recipe.votes} />
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="text-small">
                        <Time time={this.state.recipe.time} />
                        <Level index={this.state.recipe.level} />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="recipecard-tags text-small">
                        <Tags matchedTags={matchedTags} recipeTags={this.state.recipe.tags} recipeKey={this.state.recipe.source} />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="recipecard-ingredients text-medium">
                        <IngredientProgress matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} toggleIngredientlist={this.toggleIngredientlist} />
                        {this.state.recipe.expanded && <Portion portionsUpdate={this.updatePortions} portions={this.state.recipe.portions} />}
                      </div>
                    </Grid>
                    <Grid item xs={12}>

                      <div className="ingredient-list text-medium">
                        {this.state.recipe.expanded && (
                        <Ingredientlist
                          handleAddItem={this.showGroceryListDialog}
                          portionsMultiplier={this.state.portionsMultiplier}
                          ingredients={this.state.recipe.ingredients}
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
          units={this.props.units}
          open={!!this.state.showGroceryDialog}
          onClose={this.closeGrocerylistDialog}
          grocerylists={this.props.grocerylists}
          itemsToAdd={this.state.itemsToAdd}
          recipeToAdd={this.state.recipeToAdd}
          setSnackbar={this.props.setSnackbar}
        />
      </Grid>
    );
  }
}
export default withStyles(styles)(Recipe);
