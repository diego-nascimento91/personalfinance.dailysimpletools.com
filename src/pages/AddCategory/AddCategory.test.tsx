/* eslint-disable react/display-name */
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import { useUser } from 'assets/state/hooks/firebaseHooks';
import { handleFetchOnlyUserCategories } from 'assets/functions/handleDatabaseFunctions';
import AddCategory from './AddCategory';

// useUser mock
jest.mock('assets/state/hooks/firebaseHooks', () => ({
  ...jest.requireActual('assets/state/hooks/firebaseHooks'),
  useUser: jest.fn()
}));

// useSelectedCategory and useUserCategories mock
const mockedSetUserCategories = jest.fn();
const mockedSetSelectedCategory = jest.fn();
jest.mock('assets/state/hooks/addCategoryHooks', () => ({
  useSelectedCategory: () => ([[], mockedSetSelectedCategory]),
  useUserCategories: () => ([[], mockedSetUserCategories])
}));

// useNavigate mock
const mockedNavegacao = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavegacao
}));

// handleFetchOlyUserCategories mock
jest.mock('assets/functions/handleDatabaseFunctions');

// React Components mocks
jest.mock('./AddCategoryForm/AddCategoryForm', () => () => (<div>AddCategoryForm</div>));
jest.mock('./UserCategories/UserCategories', () => () => (<div>UserCategories</div>));

describe('<AddCategory /> Page', () => {
  describe('User not LoggedIn', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([false, false]);
    });

    it('should return to login page', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategory />
          </BrowserRouter>
        </RecoilRoot>
      );

      expect(mockedNavegacao).toBeCalled();
      expect(mockedNavegacao).toBeCalledWith('/');
    });
  });

  describe('User LoggedIn', () => {
    const user = { uid: 'uid' };
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([user, false]);
    });

    it('should stay in this page', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategory />
          </BrowserRouter>
        </RecoilRoot>
      );

      expect(mockedNavegacao).not.toBeCalled();
    });

    it('should call setSelectedCategory()', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategory />
          </BrowserRouter>
        </RecoilRoot>
      );

      expect(mockedSetSelectedCategory).toBeCalled();
      expect(mockedSetSelectedCategory).toBeCalledWith(null);
    });

    it('should call handleFetchOnlyUserCategories()', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategory />
          </BrowserRouter>
        </RecoilRoot>
      );

      expect(handleFetchOnlyUserCategories).toBeCalled();
      expect(handleFetchOnlyUserCategories).toBeCalledWith(mockedSetUserCategories, user.uid);
    });

    // This test will guarantee that if the user state changes to false, then the page will be redirected to '/'
    // it('should return to login page if user signs out', async () => {
    //   (useUser as jest.Mock).mockReturnValueOnce([true, false]).mockReturnValueOnce([false,false]);
    //   render(
    //     <RecoilRoot>
    //       <BrowserRouter>
    //         <AddCategory />
    //       </BrowserRouter>
    //     </RecoilRoot>
    //   );

    //   expect(mockedNavegacao).toBeCalled();
    // });

    it('should render <AddCategoryForm />', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategory />
          </BrowserRouter>
        </RecoilRoot>
      );

      const AddCategoryForm_Component = screen.getByText('AddCategoryForm');

      expect(AddCategoryForm_Component).toBeInTheDocument();
    });
    
    it('should render <UserCategories />', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategory />
          </BrowserRouter>
        </RecoilRoot>
      );

      const AddCategoryForm_Component = screen.getByText('UserCategories');

      expect(AddCategoryForm_Component).toBeInTheDocument();
    });

    it('should render <AddCategory/> correctly', () => {
      const { container } = render(
        <RecoilRoot>
          <AddCategory />
        </RecoilRoot>
      );
  
      expect(container).toMatchSnapshot();
    });
  });
});