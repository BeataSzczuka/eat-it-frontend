import React, { Component } from 'react';
import '../../styles/css/my-meal-plan.styles.css';
import { Calendar } from '../Calendar/Calendar.component';
import { MealInfo } from '../MealInfo/MealInfo.component';
import { i18n } from '../..';
import { changeSelectedDate } from '../../actions/calendarAction';
import { connect } from 'react-redux';
import { formatRelative } from 'date-fns';
import { pl, enGB } from 'date-fns/locale';
import RecommendedMeals from '../RecommendedMeals/RecommendedMeals.component';
import {
  fetchMealPlan,
  clearMealPlanError,
  markAsEaten,
  removeFromMealPlan
} from '../../actions/mealPlanAction';
import Statistics from '../Statistics/Statistics.component';
import { bindActionCreators } from 'redux';
import { errorAlert } from '../../helpers/Alert.component';
import { MyMealPlanProps, MyMealPlanState } from './MyMealPlan.types';
import { IconButton, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * This component renders the meal plan of a logged in user
 * @see Calendar
 * @see RecommendedMeals
 * @author Beata Szczuka
 */
export class MyMealPlan extends Component<MyMealPlanProps, MyMealPlanState> {
  constructor(props: MyMealPlanProps) {
    super(props);
    this.state = {
      dateLocale: i18n.language === 'pl' ? pl : enGB,
      calendarReducer: {} as any,
      mealPlanReducer: {} as any
    };
  }
  componentDidMount() {
    this.props.fetchMealPlan(this.props.selectedDate);
  }
  renderMealsForTheDay() {
    if (this.props.mealPlan.length === 0)
      return <div className="emptyInfo">{i18n._("You don't have any meals planned for this day yet.")}</div>;
    const mealsInfo: any[] = [];
    this.props.mealPlan.forEach((meal, i) => {
      let buttons: any = <></>;
      if (!meal.eaten) {
        buttons = (
          <div className="buttons">
            <Tooltip title={i18n._('Mark as eaten')}>
              <IconButton onClick={() => this.props.markAsEaten(meal.id, this.props.selectedDate)}>
                <FontAwesomeIcon icon={faCheck} />
              </IconButton>
            </Tooltip>
            <Tooltip title={i18n._('Remove')}>
              <IconButton onClick={() => this.props.removeFromMealPlan(meal.id, this.props.selectedDate)}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
      mealsInfo.push(
        <span key={i} className={`mealInfoContainer ${meal.eaten ? 'eaten' : ''}`}>
          <MealInfo meal={meal}></MealInfo>
          {buttons}
        </span>
      );
    });
    return <div>{mealsInfo}</div>;
  }

  componentDidUpdate() {
    if (i18n.language === 'pl' && this.state.dateLocale !== pl) {
      this.setState({ dateLocale: pl });
    } else if (i18n.language === 'en' && this.state.dateLocale !== enGB) {
      this.setState({ dateLocale: enGB });
    }
  }

  changeSelectedDate = (date: Date) => {
    this.props.changeSelectedDate(date);
  };

  cutTime(dateRelative: string) {
    let substr = ' at ';
    if (i18n.language === 'pl') substr = ' o ';
    const index = dateRelative.indexOf(substr);
    if (index === -1) return dateRelative;
    return dateRelative.substring(0, index);
  }

  render() {
    return (
      <>
        <div className="myMealPlanComponent">
          <span>
            <h2>
              {i18n._('My meal plan for ')}
              {this.cutTime(
                formatRelative(this.props.selectedDate, new Date(), {
                  locale: this.state.dateLocale
                })
              )}
            </h2>
            <span className="calendarButton">
              <Calendar
                selectedDate={this.props.selectedDate}
                changeSelectedDate={this.changeSelectedDate}
                dateLocale={this.state.dateLocale}
              ></Calendar>
            </span>
          </span>
          {this.renderMealsForTheDay()}
          <Statistics day={this.props.selectedDate} />
        </div>
        <RecommendedMeals />
        {this.showAlert()}
      </>
    );
  }
  showAlert() {
    if (!this.props.pending && !!this.props.error) {
      return errorAlert({
        isOpen: !!this.props.error,
        message: this.props.error,
        onClose: () => this.props.clearMealPlanError()
      });
    }
  }
}

const mapStateToProps = (state: MyMealPlanState) => ({
  selectedDate: state.calendarReducer.selectedDate,
  mealPlan: state.mealPlanReducer.mealPlan,
  error: state.mealPlanReducer.error,
  pending: state.mealPlanReducer.pending
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      changeSelectedDate,
      fetchMealPlan,
      clearMealPlanError,
      removeFromMealPlan,
      markAsEaten
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyMealPlan);
