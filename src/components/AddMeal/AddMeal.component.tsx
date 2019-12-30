import React, { Component } from 'react';
import { Card, TextField, MenuItem, CardHeader, Button } from '@material-ui/core';
import { addMeal } from '../../actions/mealAction';
import { ProductsList } from '../ProductsList/ProductsList.component';
import { removeProduct, addProduct } from '../../actions/productAction';
import '../../styles/css/add-meal.styles.css';
import { connect } from 'react-redux';
import { ProductsState } from '../../types/Products';
import { CreateProduct } from '../CreateProduct/CreateProduct.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUtensils,
  faInfo,
  faClipboardList,
  faFilter,
  faBalanceScaleRight,
  faListOl,
  faCheck,
  faCamera,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Recipe } from '../Recipe/Recipe.component';

interface AddMealProps {
  addMeal: typeof addMeal;
  removeProduct: typeof removeProduct;
  addProduct: typeof addProduct;
  productsList: ProductType[];
}
interface AddMealState {
  name: string;
  recipe: string;
  selectedProductId: string;
  productsReducer: ProductsState;
  creatingProduct: boolean;
}

type ProductType = {
  id: number;
  name: string;
};

const allProducts: ProductType[] = [
  { id: 1, name: 'egg' },
  { id: 2, name: 'water' },
  { id: 3, name: 'salt' }
];
class AddMeal extends Component<AddMealProps, AddMealState> {
  state: AddMealState = {
    name: '',
    recipe: '',
    selectedProductId: '',
    productsReducer: {} as ProductsState,
    creatingProduct: false
  };

  add = () => {
    this.props.addMeal({
      id: 3,
      name: this.state.name,
      recipe: this.state.recipe
    });
    this.setState({ name: '', recipe: '' });
  };

  addProduct = () => {
    const newProduct = allProducts.find((product) => {
      return product.id === +this.state.selectedProductId;
    });
    if (newProduct) {
      this.props.addProduct(newProduct);
      this.setState({ selectedProductId: '' });
    }
  };

  render() {
    return (
      <div className="addMealComponent">
        <Card>
          <CardHeader className="title" title="Add a new meal" />
          <form>
            <div className="padding">
              <FontAwesomeIcon icon={faUtensils} />
              <TextField
                variant="outlined"
                label="Name"
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
                label="Description"
                value={this.state.name}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faCamera} />
              <div>
                <Button variant="contained" className="uploadImage">
                  Add image
                </Button>
              </div>
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faClock} />
              <TextField
                variant="outlined"
                label="Preparation time"
                value={this.state.name}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faBalanceScaleRight} />
              <TextField
                variant="outlined"
                label="Servings"
                value={this.state.name}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faFilter} />
              <TextField
                variant="outlined"
                label="Category"
                select
                value={this.state.name}
                fullWidth={true}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faListOl} />
              <Recipe />
            </div>
            <div className="padding">
              <FontAwesomeIcon icon={faClipboardList} />
              <div>
                <div className="addProductGroup">
                  <TextField
                    label="Product"
                    select
                    variant="outlined"
                    className="selectProduct"
                    value={this.state.selectedProductId}
                    multiline={true}
                    onChange={(e) => {
                      this.setState({
                        selectedProductId: e.target.value
                      });
                    }}
                  >
                    {allProducts.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <span>
                    <Button
                      className="addProduct"
                      variant="contained"
                      onClick={this.addProduct}
                      startIcon={<FontAwesomeIcon icon={faPlus} />}
                    >
                      Add
                    </Button>
                    <CreateProduct />
                  </span>
                </div>
                <ProductsList
                  productsList={this.props.productsList}
                  removeProduct={this.props.removeProduct}
                />
              </div>
            </div>
            <Button
              className="groupButton save"
              variant="contained"
              onClick={this.add}
              startIcon={<FontAwesomeIcon icon={faCheck} />}
            >
              Save
            </Button>
            <Button
              className="groupButton cancel"
              variant="contained"
              onClick={this.add}
              startIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              Cancel
            </Button>
          </form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: AddMealState) => {
  return {
    productsList: state.productsReducer.productsList
  };
};

export default connect(
  mapStateToProps,
  { addMeal, addProduct, removeProduct }
)(AddMeal);
