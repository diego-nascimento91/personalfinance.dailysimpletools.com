import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { handleCreateDocFunction, handleFetchCategories, handleFetchOnlyUserCategories, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { ICategory } from 'assets/interfaces/interfaces';
import { useSelectedCategory } from 'assets/state/hooks/addCategoryHooks';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import AddCategoryForm from './AddCategoryForm';


// useUser and useCategories mock
const mockedSetCategories = jest.fn();
jest.mock('assets/state/hooks/firebaseHooks', () => ({
  useUser: () => [{ uid: 'userid' }],
  useCategories: () => [categories, mockedSetCategories]
}));

// useSelectedCategory and useUserCategories mock
const mockedSetUserCategories = jest.fn();
const mockedSetSelectedCategory = jest.fn();
jest.mock('assets/state/hooks/addCategoryHooks', () => ({
  useUserCategories: () => [userCategories, mockedSetUserCategories],
  useSelectedCategory: jest.fn()
}));

// handleDatabaseFunctions mock
jest.mock('assets/functions/handleDatabaseFunctions');

// <IconPreview /> mock
// eslint-disable-next-line react/display-name
jest.mock('./IconPreview/IconPreview', () => ({icon}: {icon: string}) => (
  <div>
    {
      icon !== '' 
        ? <img src={icon} alt="icon" />
        : null
    }
  </div>
));

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
      (useSelectedCategory as jest.Mock).mockReturnValue([null, mockedSetSelectedCategory]);
    });

    it('should have title Add a new Category', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const title = screen.getByText('Add a new Category');

      expect(title).toBeInTheDocument();
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

  describe('AddCategory Form Validation and Img Preview', () => {
    beforeEach(() => {
      (useSelectedCategory as jest.Mock).mockReturnValue([null, mockedSetSelectedCategory]);
    });

    it('should be required to have a category name', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');

      expect(categoryNameInput).toHaveAttribute('required');
    });

    it('should be required to have a category type', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const typeInput = screen.getByLabelText('Type:');

      expect(typeInput).toHaveAttribute('required');
    });

    it('should be required the form not to have the noValidate atribute', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const addCategoryForm = screen.getByTestId('addCategoryForm');

      expect(addCategoryForm).not.toHaveAttribute('noValidate');
    });

    it('should disable submit button for category name and type that already exist', () => {
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

      fireEvent.change(categoryNameInput, { target: { value: userCategories[0].value } });
      fireEvent.change(typeInput, { target: { value: userCategories[0].type } });

      expect(submitFormButton).toBeDisabled();
    });

    it('should alert user for category name and type that already exist', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      fireEvent.change(categoryNameInput, { target: { value: userCategories[0].value } });
      fireEvent.change(typeInput, { target: { value: userCategories[0].type } });

      const alertMessage = screen.getByRole('alert');
      expect(alertMessage.innerHTML).toContain('name already exists');
    });

    it('should render <IconPreview /> when link icon is provided', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const validIcon = './img-test.jpg';
      const iconInput = screen.getByLabelText('Icon:');
      fireEvent.change(iconInput, { target: { value: validIcon } });

      const img = screen.getByAltText('icon');
      expect(img).toBeInTheDocument();
    });

  });

  describe('Update Category', () => {
    beforeEach(() => {
      (useSelectedCategory as jest.Mock).mockReturnValue([userCategories[0], mockedSetSelectedCategory]);
    });

    it('should have title Edit Selected Category', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const title = screen.getByText('Edit Selected Category');

      expect(title).toBeInTheDocument();
    });

    it('should render the button Cancel Update Transaction', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const button = screen.getByText('Cancel Update Transaction');

      expect(button).toBeInTheDocument();
    });

    it('should fill out form with selected category', () => {
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

      expect(categoryNameInput).toHaveValue(userCategories[0].value);
      expect(typeInput).toHaveValue(userCategories[0].type);
      expect(descriptionInput).toHaveValue(userCategories[0].description);
      expect(iconInput).toHaveValue(userCategories[0].icon);
    });

    it('should reset form when Cancel button clicked', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const button = screen.getByText('Cancel Update Transaction');
      fireEvent.click(button);
      const categoryNameInput = screen.getByLabelText('How would like to call this Category?');
      const typeInput = screen.getByLabelText('Type:');
      const descriptionInput = screen.getByLabelText('Description:');
      const iconInput = screen.getByLabelText('Icon:');

      expect(categoryNameInput).toHaveValue('');
      expect(typeInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(iconInput).toHaveValue('');
    });

    it('should call handleUpdateDocFunction() when form submitted', async () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <AddCategoryForm />
          </BrowserRouter>
        </RecoilRoot>
      );

      const submitFormButton = screen.getByText('Update Category');
      fireEvent.click(submitFormButton);

      await waitFor (() => {
        expect(handleUpdateDocFunction).toBeCalled();
        expect(handleUpdateDocFunction).toBeCalledWith('categories', 'userid', userCategories[0]);
      });
    });
  });
});