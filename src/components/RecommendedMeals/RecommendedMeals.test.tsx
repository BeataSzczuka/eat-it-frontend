import React from 'react';
import { shallow } from 'enzyme';
import RecommendedMeals from './RecommendedMeals.component';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

jest.mock('../..', () => ({
  get i18n() {
    return { _: (data: string) => data };
  }
}));

describe('RecommendedMeals', () => {
  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <RecommendedMeals />
      </Provider>
    );
  });
});
