import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import Register from './Register';
import { useUser } from 'assets/state/hooks/useUser';
import { createMemoryHistory } from 'history';
import { registerWithEmailAndPassword } from 'assets/functions/firebase/authRegisterForm';

jest.mock('assets/state/hooks/useUser', () => {
  return {
    useUser: jest.fn()
  };
});

jest.mock('assets/functions/firebase/registerWithEmailAndPassword', () => {
  return {
    registerWithEmailAndPassword: jest.fn()
  };
});

const mockedNavegacao = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNavegacao,
  };
});

describe('the behavior of loading page with user loggedin', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([true, false]);
  });
  test('page home should be rendered', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(mockedNavegacao).toBeCalled();
    expect(mockedNavegacao).toBeCalledWith('/home');
  });
});

describe('The behavior of the Register form with email and password', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });
  test('An alert should be provided in case of name input empty', () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const inputName = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Submit');
    // Act
    expect(inputName).toBeInTheDocument();
    fireEvent.change(emailInput, {
      target: {
        value: 'validemail@domain.com'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: 'password123'
      }
    });
    fireEvent.click(submitButton);
    // Assert
    const emailAlert = screen.getByRole('alert');
    expect(emailAlert.textContent).toBe('Input required! Please enter your name.');
  });

  test('An alert should be provided in case of email input empty', () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const inputName = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Submit');
    // Act
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(inputName, {
      target: {
        value: 'My Name'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: 'password123'
      }
    });
    fireEvent.click(submitButton);
    // Assert
    const emailAlert = screen.getByRole('alert');
    expect(emailAlert.textContent).toBe('Input required! Please enter your email.');
  });

  test('An alert should be provided in case of password input empty', () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </RecoilRoot>
    );
    // Act
    const inputName = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Submit');

    // Act
    expect(passwordInput).toBeInTheDocument();
    fireEvent.change(emailInput, {
      target: {
        value: 'myemail@domain.com'
      }
    });
    fireEvent.change(inputName, {
      target: {
        value: 'My Name'
      }
    });
    fireEvent.click(submitButton);

    // Assert
    const alerts = screen.getByRole('alert');
    expect(alerts.textContent).toBe('Input required! Please choose a password.');
  });

  test('An alert should be povided with invalid emails', () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const inputName = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Submit');

    // Act
    act(() => {
      fireEvent.change(inputName, {
        target: {
          value: 'My Name'
        }
      });
      fireEvent.change(emailInput, {
        target: {
          value: 'invalid..email@[123.123.123.123]'
        }
      });
      fireEvent.change(passwordInput, {
        target: {
          value: 'validpassword123'
        }
      });
      fireEvent.click(submitButton);
    });

    // Assert
    const emailAlert = screen.queryAllByRole('alert');
    expect(emailAlert.length).toBe(1);
    expect(emailAlert[0].textContent).toBe('Email not valid. Please enter an email in the format personal_info@domain.com.');
    // await act(async () => {
    //   Promise.resolve();
    // });
  });

  test('An alert should be provided for invalid passwords', () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const inputName = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Submit');

    // Act
    fireEvent.change(inputName, {
      target: {
        value: 'My Name'
      }
    });
    fireEvent.change(emailInput, {
      target: {
        value: 'validemail@domain.com'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    });
    fireEvent.click(submitButton);

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Password not valid. Your password should contain at least 6 chacteres e may contain letters, numbers and the characters @ # $ % & *');
  });

  test('An alert should be provided for incorrect email or password (failed register)', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    (registerWithEmailAndPassword as jest.Mock).mockReturnValue('auth/email-already-in-use');
    const inputName = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Submit');

    // Act
    fireEvent.change(inputName, {
      target: {
        value: 'My Name'
      }
    });
    fireEvent.change(emailInput, {
      target: {
        value: 'validemail@domain.com'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: '123123#'
      }
    });

    //Act
    fireEvent.click(submitButton);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('Email already in use. Return to Login page or check your information and try again.');
    await act(async () => {
      Promise.resolve();
    });
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
        <Register />
      </Router>
    );
    // Act
    const linkLogin = screen.getByText('Click here to Login');
    fireEvent.click(linkLogin);
    // Assert
    expect(history.location.pathname).toBe('/');
  });
});


