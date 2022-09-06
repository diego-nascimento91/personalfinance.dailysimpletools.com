import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import Login from './Login';
import { useUser } from 'assets/state/hooks/useUser';
import { createMemoryHistory } from 'history';

jest.mock('assets/state/hooks/useUser', () => {
  return {
    useUser: jest.fn()
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

describe('The behavior of the Login form with email and password', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });
  test('An alert should be provided in case of email input empty', () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Login');

    // Act
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(passwordInput, {
      target: {
        value: 'password123'
      }
    });
    fireEvent.click(submitButton);

    // Assert
    const emailAlert = screen.getByRole('alert');
    expect(emailAlert.textContent).toBe('Input required! Please enter your email.');
    // await act(async () => {
    //   Promise.resolve();
    // });
  });

  test('An alert should be provided in case of password input empty', () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Login');

    // Act
    act(() => {
      expect(passwordInput).toBeInTheDocument();
      fireEvent.change(emailInput, {
        target: {
          value: 'myemail@domain.com'
        }
      });
      fireEvent.click(submitButton);
    });

    // Assert
    const alerts = screen.getByRole('alert');
    expect(alerts.textContent).toBe('Input required! Please choose a password.');
    // await act(async () => {
    //   Promise.resolve();
    // });
  });

  test('An alert should be povided with invalid emails', () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Login');

    // Act
    act(() => {
      fireEvent.change(passwordInput, {
        target: {
          value: 'validpassword123'
        }
      });
      fireEvent.change(emailInput, {
        target: {
          value: 'invalid..email@[123.123.123.123]'
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

  test('An alert should be provided for passwords with less than 6 characteres', () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Login');

    // Act
    act(() => {
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
    });

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Password not valid. Your password should contain at least 6 chacteres e may contain letters, numbers and the characters @ # $ % & *');
    // await act(async () => {
    //   Promise.resolve();
    // });
  });

  test('No invalid alert should be provided with valid emails or passwords', async () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const submitButton = screen.getByText('Login');

    // Act
    fireEvent.change(emailInput, {
      target: {
        value: 'email@example.com'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: 'validpassword123!@#$%&*'
      }
    });
    fireEvent.click(submitButton);
    await act(async () => {
      Promise.resolve();
    });

    // Assert
    const alert = await screen.findByRole('alert');

    expect(alert.textContent).not.toContain('Input Required');
    expect(alert.textContent).not.toContain('Email not valid');
    expect(alert.textContent).not.toContain('Password not valid');

  });

  test('An alert should be provided for incorrect email or password (failed login)', async () => {
    // Arrange
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    const userEmail = screen.getByPlaceholderText('youremail@domain.com');
    const userPassword = screen.getByPlaceholderText('password');
    const loginButton = screen.getByText('Login');

    //Act
    fireEvent.change(userEmail, {
      target: {
        value: 'emailvalidbutnotregisterd@anyemail.domain'
      }
    });
    fireEvent.change(userPassword, {
      target: {
        value: 'password123'
      }
    });
    fireEvent.click(loginButton);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('Email/ password incorrect. Check your information and try again.');
    await act(async () => {
      Promise.resolve();
    });
  });
});

describe('successful login', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([true, false]);
  });
  test('If loggin is succesfull,"/home" should be called', async () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </RecoilRoot>
    );
    expect(mockedNavegacao).toBeCalled();
    expect(mockedNavegacao).toBeCalledWith('/home');
  });
});

describe('The behavior of the links to reset password and to register', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });

  test('page ResetPassword should be rendered when link is clicked', () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <Login />
        </RecoilRoot>
      </Router>
    );
    // Act
    const forgotLink = screen.getByText('Forgot password');
    fireEvent.click(forgotLink);
    // Assert
    expect(history.location.pathname).toBe('/resetpassword');
  });

  test('page Register should be rendered when link is clicked', () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <Login />
        </RecoilRoot>
      </Router>
    );
    // Act
    const forgotLink = screen.getByText('Register now');
    fireEvent.click(forgotLink);
    // Assert
    expect(history.location.pathname).toBe('/register');
  });
});


