import React, { Component } from 'react';
import '../../styles/css/my-meal-plan.styles.css';
import { Calendar } from '../Calendar/Calendar.component';
import { TMealExtended } from '../Meal/Meal.component';
import { MealInfo } from '../MealInfo/MealInfo.component';

const meal: TMealExtended = {
  id: 1,
  name: 'Spaghetti carbonara',
  recipe: 'Heat pasta water: Put a large pot of salted water on to boil (1 Tbsp salt for every 2 ',
  createdAt: new Date(),
  ingredients: ['butter', 'bacon', 'garlic', 'eggs', 'parmesan', 'spaghetti pasta', 'salt', 'pepper'],
  calories: 200,
  fats: 9,
  protein: 16.5,
  carbs: 16,
  prepareTime: '30 min',
  servings: 1
};
const mealsList = [1, 2, 3].map((i) => {
  const temp = Object.assign({}, meal);
  temp.id = i;
  return temp;
});

interface MyMealPlanState {
  meals: TMealExtended[];
}

class MyMealPlan extends Component {
  state: MyMealPlanState = {
    meals: mealsList
  };
  componentDidMount() {}

  renderMealsForTheDay() {
    if (this.state.meals === []) return <div>Nothing to display</div>;
    const mealsInfo: any[] = [];
    this.state.meals.forEach((meal, i) => mealsInfo.push(<MealInfo meal={meal} key={i}></MealInfo>));
    return <div>{mealsInfo}</div>;
  }

  render() {
    return (
      <div className="myMealPlanComponent">
        <h2>My meal plan for today</h2>
        <Calendar></Calendar>
        {this.renderMealsForTheDay()}
        <br></br>
      </div>
    );
  }
}

export { MyMealPlan };
