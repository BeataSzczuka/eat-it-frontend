import React, { Component } from 'react';
import { Card, TextField, CardHeader, Button } from '@material-ui/core';
import { ProductsList } from '../ProductsList/ProductsList.component';
import '../../styles/css/add-meal.styles.css';
import { connect } from 'react-redux';
import { ProductType } from '../../types/Products';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUtensils,
  faInfo,
  faClipboardList,
  faFilter,
  faListOl,
  faCheck,
  faCamera,
  faTimes,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Recipe } from '../Recipe/Recipe.component';
import { i18n } from '../..';
import { Autocomplete } from '@material-ui/lab';
import { addMeal, clearAddMealSuccess, clearAddMealError } from '../../actions/mealAction';
import { bindActionCreators } from 'redux';
import { showAlert } from '../../helpers/Alert.component';
import { AddMealProps, AddMealState, initialAddMealState as initialState } from './AddMeal.types';

/**
 * This component renders a new meal adding form.
 * @author Beata Szczuka
 */
export class AddMeal extends Component<AddMealProps, AddMealState> {
  constructor(props) {
    super(props);
    this.state = { ...initialState, videoHelperText: i18n._('Provide url for YouTube recipe') };
  }
  isButtonAddDisabled = () => {
    const {
      name,
      description,
      recipeSteps,
      prepTime,
      category,
      selectedProductsList,
      videoHelperText
    } = this.state;
    if (
      name === '' ||
      description === '' ||
      recipeSteps.length === 0 ||
      prepTime === '' ||
      category === '' ||
      selectedProductsList.length === 0 ||
      selectedProductsList.find((p) => !p.amount) ||
      videoHelperText !== i18n._('Provide url for YouTube recipe')
    )
      return true;
    return false;
  };
  add = () => {
    let video = this.state.video;
    if (video !== '') {
      const validPrefixLength = 'https://www.youtube.com/watch?v='.length;
      video = video.substring(validPrefixLength);
    }
    this.props.addMeal({
      id: 1,
      name: this.state.name,
      recipe: this.state.recipeSteps,
      description: this.state.description,
      prepareTime: this.state.prepTime,
      category: this.state.category,
      image: this.state.selectedFile,
      video: video,
      ingredients: this.state.selectedProductsList
    });
    this.setState({ ...initialState, videoHelperText: i18n._('Provide url for YouTube recipe') });
  };

  uploadImage() {
    return (
      <>
        <input type="file" id="file" onChange={this.fileChangedHandler} />
        <label htmlFor="file">{i18n._('Add image')}</label>
        {this.state.selectedFile !== null ? (
          <span className="fileName">{this.state.selectedFile.name}</span>
        ) : (
          <></>
        )}
      </>
    );
  }

  fileChangedHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  addProduct = () => {
    this.setState((prev: AddMealState) => ({
      selectedProductsList: [...prev.selectedProductsList, prev.selectedProduct]
    }));
    this.setState({ selectedProduct: {} as ProductType });
  };

  render() {
    const { pending, error, success, clearAddMealError, clearAddMealSuccess } = this.props;
    return (
      <div className="addMealComponent">
        <Card>
          <CardHeader className="title" title={i18n._('Add a new meal')} />
          <form>
            <div className="padding">
              <FontAwesomeIcon icon={faUtensils} />
              <TextField
                variant="outlined"
                label={i18n._('Name')}
                id="name"
                autoFocus={true}
                value={this.state.name}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faInfo} />
              <TextField
                variant="outlined"
                label={i18n._('Description')}
                id="description"
                value={this.state.description}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ description: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faCamera} />
              <div>{this.uploadImage()}</div>
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faClock} />
              <TextField
                variant="outlined"
                id="prepTime"
                label={i18n._('Preparation time')}
                value={this.state.prepTime}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ prepTime: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faFilter} />
              <Autocomplete
                options={['dinner', 'breakfast']}
                className="autocomplete"
                id="category"
                getOptionLabel={(o) => o}
                onChange={(e, v) => {
                  this.setState({ category: v });
                }}
                value={this.state.category}
                noOptionsText={i18n._('No categories')}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    value={this.state.category}
                    fullWidth
                    label={i18n._('Category')}
                  />
                )}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faListOl} />
              <Recipe
                steps={this.state.recipeSteps}
                removeStep={this.removeRecipeStep}
                addStep={this.addRecipeStep}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faVideo} />
              <TextField
                variant="outlined"
                id="video"
                label={i18n._('YouTube video')}
                helperText={this.state.videoHelperText}
                error={this.state.videoHelperText !== i18n._('Provide url for YouTube recipe')}
                value={this.state.video}
                fullWidth={true}
                onChange={(e) => {
                  this.validateYouTubeVideo(e.target.value);
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faClipboardList} />
              <div>
                <div className="addProductGroup">
                  <Autocomplete
                    options={this.props.productsList}
                    className="autocomplete"
                    getOptionLabel={(o) => (o.name ? o.name : '')}
                    onChange={(e, v) => {
                      this.setState({ selectedProduct: v });
                    }}
                    value={this.state.selectedProduct}
                    noOptionsText={i18n._('No products')}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        value={this.state.selectedProduct}
                        fullWidth
                        label={i18n._('Ingredient')}
                      />
                    )}
                  />
                  <span>
                    <Button
                      className="addProduct"
                      variant="contained"
                      disabled={!this.state.selectedProduct.name}
                      onClick={this.addProduct}
                      startIcon={<FontAwesomeIcon icon={faPlus} />}
                    >
                      {i18n._('Add')}
                    </Button>
                  </span>
                </div>
                <ProductsList
                  productsList={this.state.selectedProductsList}
                  removeProduct={this.removeFromSelectedProducts}
                  changeAmount={this.changeAmountOfSelectedProduct}
                />
              </div>
            </div>
            <Button
              className="groupButton save"
              disabled={this.isButtonAddDisabled()}
              variant="contained"
              onClick={this.add}
              startIcon={<FontAwesomeIcon icon={faCheck} />}
            >
              {i18n._('Save')}
            </Button>
            <Button
              className="groupButton cancel"
              variant="contained"
              onClick={this.add}
              startIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              {i18n._('Cancel')}
            </Button>
          </form>
        </Card>
        {showAlert(pending, error, success, clearAddMealError, clearAddMealSuccess)}
      </div>
    );
  }

  validateYouTubeVideo = (value) => {
    const validPrefix = 'https://www.youtube.com/watch?v=';
    if ((!value.startsWith(validPrefix, 0) || validPrefix.length >= value.length) && value.length > 0) {
      this.setState({ video: value, videoHelperText: i18n._('Given URL is invalid.') });
    } else {
      this.setState({ video: value, videoHelperText: i18n._('Provide url for YouTube recipe') });
    }
  };

  removeFromSelectedProducts = (product: ProductType) => {
    this.setState((prev: AddMealState) => ({
      selectedProductsList: prev.selectedProductsList.filter((p: ProductType) => p !== product)
    }));
  };
  changeAmountOfSelectedProduct = (product: ProductType, amount: string) => {
    this.setState((prev: AddMealState) => ({
      selectedProductsList: prev.selectedProductsList.map((p: ProductType) =>
        p === product ? { ...p, amount: amount } : p
      )
    }));
  };
  removeRecipeStep = (step: string) => {
    this.setState((prev: AddMealState) => ({
      recipeSteps: prev.recipeSteps.filter((s: string) => s !== step)
    }));
  };
  addRecipeStep = (step: string) => {
    this.setState((prev: AddMealState) => ({
      recipeSteps: [...prev.recipeSteps, step]
    }));
  };
}

const mapStateToProps = (state: AddMealState) => {
  return {
    productsList: state.productsReducer.productsList,
    error: state.mealReducer.error,
    success: state.mealReducer.success,
    pending: state.mealReducer.pending
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addMeal: addMeal,
      clearAddMealError,
      clearAddMealSuccess
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMeal);
