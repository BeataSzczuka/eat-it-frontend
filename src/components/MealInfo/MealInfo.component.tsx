import React, { Component } from 'react';
import '../../styles/css/meal-info.styles.css';
import { Link } from 'react-router-dom';
import image from '../../styles/images/placeholder.png';
import { NutrientsInfo } from '../NutrientsInfo/NutrientsInfo.component';
import Rating from '@material-ui/lab/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Skeleton } from '@material-ui/lab';
import { i18n } from '../..';
import { MealInfoProps } from './MealInfo.types';
import { API_URL } from '../../utils/RequestService';

/**
 * This component renders short information about one meal
 * @author Beata Szczuka
 */
class MealInfo extends Component<MealInfoProps> {
  getMealId() {
    if (!!this.props.meal) return this.props.meal.id;
  }
  render() {
    return (
      <Link
        onClick={(e) => {
          if (!this.props.meal) e.preventDefault();
        }}
        to={{
          pathname: `/${i18n.language}/meals/${this.getMealId()}`
        }}
        color="inherit"
        className="mealInfoComponent link"
      >
        <div className="image">
          {!this.props.meal ? (
            <Skeleton variant="rect" width={'100%'} height={'330px'} />
          ) : !this.props.meal.image ? (
            <img src={image} alt="Meal" />
          ) : (
            <img src={`${API_URL}${this.props.meal.image}`} alt="Meal" />
          )}
        </div>
        <div className="info">
          <div className="top">
            {!this.props.meal ? (
              <Skeleton variant="rect" width={'30%'} height={'30px'} />
            ) : (
              <div className="name">{this.props.meal.name}</div>
            )}
            {!this.props.meal ? (
              <div className="relative">
                <Skeleton variant="text" width={'50%'} />
                <Skeleton variant="text" width={'100px'} className="absoluteRight" />
              </div>
            ) : (
              <span className="toRight">
                <Rating readOnly={true} value={this.props.meal.rate} precision={0.5} />
                <FontAwesomeIcon icon={faClock} className="paddingIcon" />
                <span id="prepTime">{this.props.meal.prepareTime} min</span>
              </span>
            )}
          </div>
          {!this.props.meal ? (
            <Skeleton variant="text" width={'100%'} />
          ) : (
            <NutrientsInfo
              kcal={this.props.meal.calories}
              carbs={this.props.meal.carbs}
              proteins={this.props.meal.proteins}
              fats={this.props.meal.fats}
            />
          )}
          {this.displayDescription()}
        </div>
      </Link>
    );
  }

  displayDescription() {
    if (!!this.props.meal && !!this.props.meal.description) {
      return <div>{this.props.meal.description}</div>;
    }
  }
}

export { MealInfo };
