import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import FirebaseAuthService from 'assets/functions/FirebaseAuthService';
import Register from './Register';
import { useUser } from 'assets/state/hooks/firebaseHooks';

jest.mock('assets/state/hooks/firebaseHooks', () => {
  return {
    useUser: jest.fn()
  };
});

jest.mock('assets/functions/FirebaseAuthService', () => {
  return {
    createNewUserWithEmailAndPassword: jest.fn()
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

// global variables
const validName = 'Name';
const validEmail = 'email@example.com';
const invalidEmail = 'invalid..email@[ 123.123.123.123 ]';
const validPassword = 'password123';
const invalidPassword = '123';

describe('Register', () => {
  describe('Successfull Register', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([true, false]);
    });
    
    it('should render page /home when loggedin', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      expect(mockedNavegacao).toBeCalled();
      expect(mockedNavegacao).toBeCalledWith('/home');
    });
  });

  describe('Register Form', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([false, false]);
    });

    it('should call createNewUserWithEmailAndPassword() for valid inputs', () => {
      window.alert = jest.fn();
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: validPassword }
      });
      fireEvent.click(submitButton);

      expect(FirebaseAuthService.createNewUserWithEmailAndPassword).toBeCalled();
      expect(FirebaseAuthService.createNewUserWithEmailAndPassword).toBeCalledWith(validName, validEmail, validPassword);
    });

    it('should show an alert for empty name', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: validPassword } });
      fireEvent.click(submitButton);

      const emailAlert = screen.getByRole('alert');
      expect(emailAlert.textContent).toBe('Input required! Please enter your name.');
    });

    it('should show an alert for empty email', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.change(passwordInput, { target: { value: validPassword } });
      fireEvent.click(submitButton);

      const emailAlert = screen.getByRole('alert');
      expect(emailAlert.textContent).toBe('Input required! Please enter your email.');
    });

    it('should show an alert for invalid email', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.change(emailInput, { target: { value: invalidEmail } });
      fireEvent.change(passwordInput, { target: { value: validPassword } });
      fireEvent.click(submitButton);

      const emailAlert = screen.getByRole('alert');
      expect(emailAlert.textContent).toBe('Email not valid. Please enter an email in the format personal_info@domain.com.');
    });

    it('should show an alert for empty password', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </RecoilRoot>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.click(submitButton);

      const alerts = screen.getByRole('alert');
      expect(alerts.textContent).toBe('Input required! Please choose a password.');
    });

    it('should show an alert for invalid password', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: invalidPassword } });
      fireEvent.click(submitButton);

      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Password not valid');
    });

    it('should show an alert for incorrect email or password (failed register)', async () => {
      (FirebaseAuthService.createNewUserWithEmailAndPassword as jest.Mock).mockReturnValue(new Error('email-already-in-use'));
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: validPassword }
      });
      fireEvent.click(submitButton);

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain('Email already in use');
    });

    it('should show an alert for unknown error', async () => {
      (FirebaseAuthService.createNewUserWithEmailAndPassword as jest.Mock).mockReturnValue(new Error);
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      const inputName = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Submit');

      fireEvent.change(inputName, { target: { value: validName } });
      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: validPassword }
      });
      fireEvent.click(submitButton);

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain('Signup failed');
    });
  });
});

describe('Link to Login Page', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });

  it('should render Login page when link is clicked', () => {
    const history = createMemoryHistory({ initialEntries: ['/resetpassword'] });
    render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );
    const linkLogin = screen.getByText('Click here to Login');

    fireEvent.click(linkLogin);

    expect(history.location.pathname).toBe('/');
  });
});