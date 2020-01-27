import { combineReducers } from 'redux';
import { productsReducer } from './productReducer';
import { mealsReducer } from './MealsReducer';
import { mealReducer } from './mealReducer';
import { calendarReducer } from './calendarReducer';
import { mealPlanReducer } from './mealPlanReducer';
import { recommendedMealsReducer } from './recommendedMealsReducer';
import { shoppingListReducer } from './shoppingListReducer';
import { fridgeReducer } from './fridgeReducer';
import { aboutUserReducer } from './aboutUserReducer';
import { createUserReducer } from './createUserReducer';
import { authReducer } from './authReducer';
import { statisticsReducer } from './statisticsReducer';
import { mealCommentsReducer } from './mealCommentsReducer';

export const reducers = combineReducers({
  mealsReducer: mealsReducer,
  productsReducer: productsReducer,
  mealReducer: mealReducer,
  calendarReducer: calendarReducer,
  mealPlanReducer: mealPlanReducer,
  recommendedMealsReducer: recommendedMealsReducer,
  shoppingListReducer: shoppingListReducer,
  fridgeReducer: fridgeReducer,
  aboutUserReducer: aboutUserReducer,
  createUserReducer: createUserReducer,
  authReducer: authReducer,
  statisticsReducer: statisticsReducer,
  mealCommentsReducer: mealCommentsReducer
});
