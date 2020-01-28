import React, { Component } from 'react';
import '../../styles/css/meal-comments.styles.css';
import { TextField, Button, IconButton } from '@material-ui/core';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Rating from '@material-ui/lab/Rating';
import { i18n } from '../..';
import {
  addMealComment,
  clearMealCommentsErrors,
  clearMealCommentsSuccess,
  removeComment
} from '../../actions/mealCommentsAction';
import { CommentType } from '../../types/MealCommentsTypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showAlert } from '../../helpers/Alert.component';
import { MealCommentsProps, MealCommentsState, initialStateMeal } from './MealComments.types';
import { requestConsts, JWT_TOKEN, axiosInstance } from '../../utils/RequestService';
/**
 * This component renders given list of comments of a meal
 * @author Beata Szczuka
 */
export class MealComments extends Component<MealCommentsProps> {
  state: MealCommentsState = initialStateMeal;
  componentDidMount() {
    this.fetchComments();
  }

  addComment = () => {
    this.props.addMealComment(this.state.comment, this.state.rate, this.props.mealId);
    this.setState(initialStateMeal);
  };
  singleComment = (comment: CommentType, key: number) => (
    <div className="singleComment" key={key}>
      <div className="center">
        <FontAwesomeIcon icon={faUserAlt} size="3x" />
      </div>
      <div className="commentInfo">
        <div>
          <span className="author">{comment.author}</span>
          {this.removeButtonIfAuthor(comment.myComment, comment.id)}
          <Rating value={comment.rate} precision={0.5} readOnly={true} />
        </div>
        <span className="date">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
        <div>{comment.content}</div>
      </div>
    </div>
  );

  removeButtonIfAuthor(isOwner: boolean, commentId: number) {
    if (isOwner)
      return (
        <IconButton className="trash" onClick={() => this.props.removeComment(commentId)}>
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      );
  }

  listComments = () => {
    if (this.props.comments.length === 0)
      return <div className="emptyInfo">{i18n._('There are no comments yet.')}</div>;
    const list: any = [];
    this.props.comments.forEach((comment, key) => {
      list.push(this.singleComment(comment, key));
    });
    return list;
  };

  fetchComments() {
    axiosInstance
      .get(requestConsts.COMMENT_URL, { params: { page: this.state.page, id: this.props.mealId } })
      .then((response) => {
        console.log(response);
        this.setState((p: MealCommentsState) => ({
          comments: [...p.comments, response.data],
          page: p.page + 1
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { pending, error, success, clearMealCommentsErrors, clearMealCommentsSuccess } = this.props;
    return (
      <div className="mealCommentsComponent">
        <TextField
          multiline={true}
          label="Leave a comment"
          variant="outlined"
          value={this.state.comment}
          onChange={(e) => this.setState({ comment: e.target.value })}
          fullWidth={true}
          rows="3"
        ></TextField>
        <div>
          <span className="rightGroup">
            <Rating
              name="rate"
              value={this.state.rate}
              precision={0.5}
              onChange={(_, newValue) => {
                this.setState({ rate: newValue });
              }}
            />
            <span>
              <Button
                className="addComment"
                onClick={() => this.addComment()}
                variant="contained"
                disabled={this.state.comment === '' || !localStorage.getItem(JWT_TOKEN)}
                color="primary"
              >
                {i18n._('Comment & rate')}
              </Button>
            </span>
          </span>
        </div>
        <div className="marginBottom">{this.listComments()}</div>
        {showAlert(pending, error, success, clearMealCommentsErrors, clearMealCommentsSuccess)}
      </div>
    );
  }
}

const mapStateToProps = (state: MealCommentsState) => {
  return {
    error: state.mealCommentsReducer.error,
    success: state.mealCommentsReducer.success,
    pending: state.mealCommentsReducer.pending
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addMealComment,
      clearMealCommentsSuccess,
      clearMealCommentsErrors,
      removeComment
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MealComments);
