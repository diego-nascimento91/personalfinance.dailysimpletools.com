import { act, fireEvent, render, screen } from '@testing-library/react';
import { handleCreateDocFunction, handleFetchCategories, handleFetchOnlyUserCategories } from 'assets/functions/handleDatabaseFunctions';
import { ICategory } from 'assets/interfaces/interfaces';
import { useSelectedCategory, useUserCategories } from 'assets/state/hooks/addCategoryHooks';
import { useCategories } from 'assets/state/hooks/firebaseHooks';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import AddCategoryForm from './AddCategoryForm';

// useUser mock
jest.mock('assets/state/hooks/firebaseHooks', () => ({
  useUser: () => [{uid: 'userid'}],
  useCategories: jest.fn()
}));
const mockedSetCategories = jest.fn();

// useSelectedCategory and useUserCategories mock
jest.mock('assets/state/hooks/addCategoryHooks');
const mockedSetUserCategories = jest.fn();
const mockedSetSelectedCategory = jest.fn();

// handleDatabaseFunctions mock
jest.mock('assets/functions/handleDatabaseFunctions');

// global variables
const validCategory = {
  value: 'Valid Category',
  type: 'expense',
  description: '',
  icon: '',
};
const userCategories: ICategory[] = [
  {
    description: 'Expenses with Family',
    value: 'Family',
    type: 'expense',
    icon: 'na',
    id: 'familyid',
  }
];
const categories: ICategory[] = [
  {
    description: 'Monthly payment',
    value: 'Salary',
    type: 'income',
    icon: 'na',
    id: 'salaryid',
    ordering: 1
  },
  {
    description: 'Expenses with Family',
    value: 'Family',
    type: 'expense',
    icon: 'na',
    id: 'familyid',
  }
];

describe('<AddCategoryForm />', () => {
  describe('Add a new Category', () => {
    beforeEach(() => {
      (useCategories as jest.Mock).mockReturnValue([categories, mockedSetCategories]);
      
      (useUserCategories as jest.Mock).mockReturnValue([userCategories, mockedSetUserCategories]);

      (useSelectedCategory as jest.Mock).mockReturnValue([null, mockedSetSelectedCategory]);
    });

    it('should call handleCreateDocFunction() for valid inputs', async () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      const submitFormButton = screen.getByText('Add Category');
      fireEvent.change(categoryNameInput, { target: { value: validCategory.value } });
      fireEvent.change(typeInput, { target: { value: validCategory.type } });
      fireEvent.click(submitFormButton);
      // this it to avoid ther act warning due to the resetForm() call.
      await act(async () => {
        await Promise.resolve();
      });

      expect(handleCreateDocFunction).toBeCalled();
      expect(handleCreateDocFunction).toBeCalledWith('categories', 'userid', validCategory);
    });

    it('should call handleFetchCategories() for valid inputs', async () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      const submitFormButton = screen.getByText('Add Category');
      fireEvent.change(categoryNameInput, { target: { value: validCategory.value } });
      fireEvent.change(typeInput, { target: { value: validCategory.type } });
      fireEvent.click(submitFormButton);
      // this it to avoid ther act warning due to the resetForm() call.
      await act(async () => {
        await Promise.resolve();
      });

      expect(handleFetchCategories).toBeCalled();
      expect(handleFetchCategories).toBeCalledWith(mockedSetCategories, 'userid');
    });

    it('should call handleFetchOnlyUserCategories() for valid inputs', async () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      const submitFormButton = screen.getByText('Add Category');
      fireEvent.change(categoryNameInput, { target: { value: validCategory.value } });
      fireEvent.change(typeInput, { target: { value: validCategory.type } });
      fireEvent.click(submitFormButton);
      // this it to avoid ther act warning due to the resetForm() call.
      await act(async () => {
        await Promise.resolve();
      });

      expect(handleFetchOnlyUserCategories).toBeCalled();
      expect(handleFetchOnlyUserCategories).toBeCalledWith(mockedSetUserCategories, 'userid');
    });

    it('should reset form', async () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      const descriptionInput = screen.getByLabelText('Description:');
      const iconInput = screen.getByLabelText('Icon:');
      const submitFormButton = screen.getByText('Add Category');

      fireEvent.change(categoryNameInput, { target: { value: validCategory.value } });
      fireEvent.change(typeInput, { target: { value: validCategory.type } });
      fireEvent.click(submitFormButton);
      // this it to avoid ther act warning due to the resetForm() call.
      await act(async () => {
        await Promise.resolve();
      });

      expect(categoryNameInput).toHaveValue('');
      expect(typeInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(iconInput).toHaveValue('');
    });

    it('should set selected category to null', async () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      const submitFormButton = screen.getByText('Add Category');

      fireEvent.change(categoryNameInput, { target: { value: validCategory.value } });
      fireEvent.change(typeInput, { target: { value: validCategory.type } });
      fireEvent.click(submitFormButton);
      // this it to avoid ther act warning due to the resetForm() call.
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockedSetSelectedCategory).toBeCalled();
      expect(mockedSetSelectedCategory).toBeCalledWith(null);
    });


  });

  describe('Update a Category', () => {
    it('should', () => {
      // (useUser as jest.Mock).mockReturnValue([true, false]);
      // render(
      //   <RecoilRoot>
      //     <BrowserRouter>
      //       <AddCategoryForm />
      //     </BrowserRouter>
      //   </RecoilRoot>
      // );

      expect(2).toBe(2);
    });
  });
});