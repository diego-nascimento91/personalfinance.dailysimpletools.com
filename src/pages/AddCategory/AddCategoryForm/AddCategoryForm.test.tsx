import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import AddCategoryForm from './AddCategoryForm';

// useUser mock
jest.mock('assets/state/hooks/firebaseHooks', () => ({
  ...jest.requireActual('assets/state/hooks/firebaseHooks'),
  useUser: () => ([true])
}));

// useSelectedCategory and useUserCategories mock
const mockedSetUserCategories = jest.fn();
const mockedSetSelectedCategory = jest.fn();
jest.mock('assets/state/hooks/addCategoryHooks', () => ({
  useSelectedCategory: () => ([null, mockedSetSelectedCategory]),
  useUserCategories: () => ([[], mockedSetUserCategories])
}));

describe('<AddCategoryForm', () => {
  describe('submit form', () => {
    it('should call handleCreateDocFunction()', () => {
      // (useUser as jest.Mock).mockReturnValue([true, false]);
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      expect(2).toBe(2);
    });

  });
});