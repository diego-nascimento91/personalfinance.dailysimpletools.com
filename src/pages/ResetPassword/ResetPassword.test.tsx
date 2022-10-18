import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useUser } from 'assets/state/hooks/firebaseHooks';
import ResetPassword from './ResetPassword';

const mockedNav = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNav
  };
});
jest.mock('assets/state/hooks/useUser', () => {
  return {
    useUser: jest.fn()
  };
});
jest.mock('assets/functions/firebase/sendPasswordReset', () => {
  return {
    sendPasswordReset: jest.fn()
  };
});

describe('Render page with user already loggedin', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([true, false]);
  });
  test('home should render with user already loggedin', () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </RecoilRoot>
    );
    // Act
    // Assert
    expect(mockedNav).toBeCalled();
    expect(mockedNav).toBeCalledWith('/home');
  });
});

describe('Reset form behavior', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
    // (sendPasswordReset as jest.Mock).mockReturnValue(true);
  });

  test('An alert should be rendered for empty email', () => {
    //Arrange
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    //Act
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const buttonSubmit = screen.getByText('Submit');
    fireEvent.click(buttonSubmit);
    const alert = screen.getByRole('alert');
    //Assert
    expect(emailInput).toBeInTheDocument();
    expect(alert.textContent).toBe('Input required! Please enter your email.');
  });

  test('An alert should be rendered for invalid email', () => {
    //Arrange
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    //Act
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    fireEvent.change(emailInput, {
      target: {
        value: 'novalidemail'
      }
    });
    const buttonSubmit = screen.getByText('Submit');
    fireEvent.click(buttonSubmit);
    const alert = screen.getByRole('alert');
    //Assert
    expect(emailInput).toBeInTheDocument();
    expect(alert.textContent).toBe('Email not valid. Please enter an email in the format personal_info@domain.com.');
  });

  test('/Emailsent should be rendered for valid email', async () => {
    //Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </RecoilRoot>
    );
    //Act
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    fireEvent.change(emailInput, {
      target: {
        value: 'validemail@domain.com'
      }
    });
    const buttonSubmit = screen.getByRole('submit');
    expect(buttonSubmit).toBeInTheDocument();
    fireEvent.click(buttonSubmit);
    await act(async () => {
      Promise.resolve();
    });

    //Assert
    expect(mockedNav).toBeCalled();
    expect(mockedNav).toBeCalledWith('/resetpassword/emailsent');
  });
});

describe('The behavior of the links to reset password and to register', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });

  test('page Login should be rendered when link is clicked', () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ['/resetpassword'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <ResetPassword />
        </RecoilRoot>
      </Router>
    );
    // Act
    const linkLogin = screen.getByText('Click here to Login');
    fireEvent.click(linkLogin);
    // Assert
    expect(history.location.pathname).toBe('/');
  });

  test('page Register should be rendered when link is clicked', () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ['/resetpassword'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <ResetPassword />
        </RecoilRoot>
      </Router>
    );
    // Act
    const linkRegister = screen.getByText('Register now');
    fireEvent.click(linkRegister);
    // Assert
    expect(history.location.pathname).toBe('/register');
  });
});

