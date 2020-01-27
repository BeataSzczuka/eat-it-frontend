import React, { Component } from 'react';
import '../../styles/css/meal.styles.css';
import image from '../../styles/images/carbonara.jpg';
import MealComments from '../MealComments/MealComments.component';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { NutrientsInfo } from '../NutrientsInfo/NutrientsInfo.component';
import { faShoppingBasket, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddToMealPlan } from '../AddToMealPlan/AddToMealPlan.component';
import { i18n } from '@lingui/core';
import { fetchMeal } from '../../actions/mealAction';
import { bindActionCreators } from 'redux';
import { MealStateType, TMeal } from '../../types/MealTypes';
import { connect } from 'react-redux';
import { Skeleton } from '@material-ui/lab';
import { ProductInfo } from '../ProductInfo/ProductInfo.component';
import { showAlert } from '../../helpers/Alert.component';
import { JWT_TOKEN } from '../../utils/RequestService';
import {
  clearShoppingListError,
  clearShoppingListSuccess
} from '../../actions/shoppingList/clearMessageShoppingList';
import { addIngredientsToList } from '../../actions/shoppingList/addIngredientsToShoppingList';
import { ShoppingListState } from '../../types/ShoppingList';

interface MealProps {
  /**
   *  @param id indicates a meal
   */
  match: {
    params: { id: string };
  };
  /**
   * fetch information about meal
   * @param {string} id
   */
  fetchMeal: typeof fetchMeal;
  addIngredientsToList: typeof addIngredientsToList;
  clearShoppingListError: typeof clearShoppingListError;
  clearShoppingListSuccess: typeof clearShoppingListSuccess;
  addIngredientsToListStatus: any;
  /**
   * contains an error message or is null
   */
  error: any | null;
  /**
   * contains informations about meal if defined
   */
  meal: TMeal | undefined;
  /**
   * determines whether fetching is pending
   */
  pending: boolean;
}
interface MealState {
  mealReducer: MealStateType;
  shoppingListReducer: ShoppingListState;
  selectAllProducts: boolean;
  selectedProducts: { id: number; amount: string }[];
}
/**
 * This component renders full information about one meal.
 * @author Beata Szczuka
 */
export class Meal extends Component<MealProps, MealState> {
  constructor(props) {
    super(props);
    this.state = {
      selectAllProducts: false,
      selectedProducts: [],
      mealReducer: {} as any,
      shoppingListReducer: {} as any
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.fetchMeal(this.props.match.params.id);
  }

  renderAboutInfo() {
    const { meal } = this.props;
    return (
      <div className="about">
        {this.props.pending ? <Skeleton component="h1" /> : <h1>{meal.name}</h1>}
        <p className="prepInfo">
          {this.props.pending ? (
            <Skeleton component="span" width="50%" />
          ) : (
            <>
              <span>
                <FontAwesomeIcon icon={faClock} />
                {i18n._(`Prepare time: ${meal.prepareTime}`)}
              </span>
              <span className="divider"> | </span>
              <span className="divider"> | </span>
              <span>
                <FontAwesomeIcon icon={faFilter} />
                {i18n._(`Category: ${meal.category}`)}
              </span>
            </>
          )}
        </p>
        {this.props.pending ? (
          <Skeleton component="span" width="50%" />
        ) : (
          <NutrientsInfo carbs={meal.carbs} proteins={meal.proteins} fats={meal.fats} kcal={meal.calories} />
        )}
        {this.props.pending ? (
          <Skeleton width="20px" height="10px" />
        ) : (
          <AddToMealPlan mealName={meal.name} />
        )}
      </div>
    );
  }

  renderYoutubeVideo() {
    const { meal } = this.props;
    if (this.props.pending || meal.video) {
      return (
        <div className="card">
          <h3>{i18n._('Watch this recipe on YouTube')}</h3>
          <div className="youtubeVideo">
            {this.props.pending ? (
              <Skeleton variant="rect" component="iframe" />
            ) : (
              <iframe
                title="recipe"
                src={`https://www.youtube.com/embed/${meal.video}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      );
    }
  }
  render() {
    if (!this.props.pending && !this.props.meal) {
      return (
        <div>
          {i18n._('Cannot find element with id')} = {this.props.match.params.id}
        </div>
      );
    } else {
      const {
        addIngredientsToListStatus,
        clearShoppingListSuccess,
        clearShoppingListError,
        meal
      } = this.props;
      return (
        <div className="mealComponent">
          <div className="top">
            {this.props.pending ? (
              <Skeleton className="image" component="div" variant="rect" height="150px" />
            ) : (
              <div className="image">
                <img src={image} alt="Meal" />
              </div>
            )}

            {this.renderAboutInfo()}
          </div>
          <div className="ingredients card">
            <div className="header">
              <h3>{i18n._('Ingredients')}</h3>
            </div>
            {this.props.pending ? (
              <>
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </>
            ) : (
              meal.ingredients.map((ingredient, key) => (
                <ProductInfo
                  key={key}
                  product={ingredient}
                  selected={!!this.state.selectedProducts.find((e) => e.id === ingredient.id)}
                  markAsSelected={this.markAsSelected}
                />
              ))
            )}
            <div className="shoppingListGroup">
              <FormControlLabel
                className="shoppingListButton"
                control={
                  <Checkbox
                    icon={<FontAwesomeIcon icon={faShoppingBasket} />}
                    checkedIcon={<FontAwesomeIcon className="basket" icon={faShoppingBasket} />}
                    checked={this.state.selectAllProducts}
                    onChange={(_, checked) => this.selectAllProducts(checked)}
                  />
                }
                label={i18n._('Select all')}
              />
              <Button
                className="shoppingListButton"
                variant="outlined"
                disabled={!localStorage.getItem(JWT_TOKEN)}
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={() => this.addToShoppingList()}
              >
                {i18n._('Add selected to your shopping list')}
              </Button>
            </div>
          </div>
          <div className="card">
            <h3>Recipe</h3>
            {/* {this.props.pending ? (
              <Skeleton height="80px" />
            ) : (
              meal.recipe.forEach((line, key) => <p key={key}>{line}</p>)
            )} */}
          </div>
          {this.renderYoutubeVideo()}
          {this.renderComments()}
          {showAlert(
            addIngredientsToListStatus.pending,
            addIngredientsToListStatus.error,
            addIngredientsToListStatus.success,
            clearShoppingListError,
            clearShoppingListSuccess
          )}
        </div>
      );
    }
  }
  renderComments() {
    if (this.props.meal)
      return <MealComments comments={this.props.meal.comments} mealId={this.props.meal.id}></MealComments>;
  }
  markAsSelected = (id: number, amount: string, selected: boolean) => {
    if (!selected)
      this.setState((prevState: MealState) => ({
        selectedProducts: [...prevState.selectedProducts, { id, amount }]
      }));
    else
      this.setState((prevState: MealState) => ({
        selectedProducts: prevState.selectedProducts.filter((e) => e.id !== id)
      }));
  };
  selectAllProducts(checked) {
    if (!checked) {
      this.setState({ selectAllProducts: false, selectedProducts: [] });
    } else {
      this.setState({
        selectAllProducts: true,
        selectedProducts: this.props.meal.ingredients.map((e) => ({ id: e.id, amount: e.amount }))
      });
    }
  }
  addToShoppingList = () => {
    this.props.addIngredientsToList(this.state.selectedProducts);
    this.setState({ selectAllProducts: false, selectedProducts: [] });
  };
}

const mapStateToProps = (state: MealState) => {
  const { error, success, pending } = state.shoppingListReducer;
  return {
    error: state.mealReducer.error,
    meal: state.mealReducer.meal,
    pending: state.mealReducer.pending,
    addIngredientsToListStatus: { error, success, pending }
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchMeal,
      addIngredientsToList,
      clearShoppingListError,
      clearShoppingListSuccess
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Meal);
