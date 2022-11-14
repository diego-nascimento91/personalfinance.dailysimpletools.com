import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useUser } from 'assets/state/hooks/firebaseHooks';
import FirebaseAuthService from 'assets/functions/FirebaseAuthService';
import Login from './Login';

// mock of useUser to set to true (user loggedin) or false (user not loggedin)
jest.mock('assets/state/hooks/firebaseHooks');

// mock of the FirebaseAuthService to check if it was called and to return error
jest.mock('assets/functions/FirebaseAuthService');

// mock of the useNavigate to check change of page
const mockedNavegacao = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavegacao,
}));

// global variables
const validEmail = 'email@example.com';
const invalidEmail = 'invalid..email@[ 123.123.123.123 ]';
const validPassword = 'password123';
const invalidPassword = '123';

describe('Login', () => {
  describe('Not LoggedIn', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([false, false]);
    });

    it('should continue in /login', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </RecoilRoot>
      );

      expect(mockedNavegacao).not.toBeCalled();
    });
  });

  describe('Successful login (with Email and Password or with Google)', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([true, false]);
    });

    it('should navigate to /home', () => {
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

  describe('Login with Email and Password Form', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([false, false]);
    });

    it('should call logInWithEmailAndPassword for valid email and password', () => {
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

      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: validPassword } });
      fireEvent.click(submitButton);

      expect(FirebaseAuthService.logInWithEmailAndPassword).toBeCalled();
      expect(FirebaseAuthService.logInWithEmailAndPassword).toBeCalledWith(validEmail, validPassword);
    });

    it('should show an alert for email input empty', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </RecoilRoot>
      );
      const passwordInput = screen.getByPlaceholderText('password');
      const submitButton = screen.getByText('Login');

      fireEvent.change(passwordInput, { target: { value: validPassword } });
      fireEvent.click(submitButton);

      const emailAlert = screen.getByRole('alert');
      expect(emailAlert.textContent).toBe('Input required! Please enter your email.');
    });

    it('should show an alert for invalid email', () => {
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

      fireEvent.change(passwordInput, { target: { value: validPassword } });
      fireEvent.change(emailInput, { target: { value: invalidEmail } });
      fireEvent.click(submitButton);

      const emailAlert = screen.getByRole('alert');
      expect(emailAlert.textContent).toBe('Email not valid. Please enter an email in the format personal_info@domain.com.');
    });

    it('should show an alert for password input empty', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </RecoilRoot>
      );
      const emailInput = screen.getByPlaceholderText('youremail@domain.com');
      const submitButton = screen.getByText('Login');

      fireEvent.change(emailInput, { target: { value: 'myemail@domain.com' } });
      fireEvent.click(submitButton);

      const alert = screen.getByRole('alert');
      expect(alert.textContent).toBe('Input required! Please choose a password.');
    });

    it('should show an alert for invalid password', () => {
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

      fireEvent.change(emailInput, { target: { value: validEmail } });
      fireEvent.change(passwordInput, { target: { value: invalidPassword } });
      fireEvent.click(submitButton);

      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Password not valid');
    });

    it('should show an alert for incorrect email or password (failed login)', async () => {
      (FirebaseAuthService.logInWithEmailAndPassword as jest.Mock).mockReturnValueOnce(new Error);
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

      fireEvent.change(userEmail, { target: { value: validEmail } });
      fireEvent.change(userPassword, { target: { value: validPassword } });
      fireEvent.click(loginButton);

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toBe('Email/ password incorrect. Check your information and try again.');
    });
  });

  describe('Login with Google', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue([false, false]);
    });

    it('should call signInWithGoogle when button clicked', () => {
      render(
        <RecoilRoot>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </RecoilRoot>
      );
      const googleButton = screen.getByText('Login with Google');

      fireEvent.click(googleButton);

      expect(FirebaseAuthService.signInWithGoogle).toBeCalled();
    });
  });
});

describe('Links to Register and Reset Password', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });

  it('should render ResetPassword when link is clicked', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <Login />
        </RecoilRoot>
      </Router>
    );
    const forgotLink = screen.getByText('Forgot password');

    fireEvent.click(forgotLink);

    expect(history.location.pathname).toBe('/resetpassword');
  });

  it('should render Register when link is clicked', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <Login />
        </RecoilRoot>
      </Router>
    );
    const linkRegister = screen.getByText('Register now');

    fireEvent.click(linkRegister);

    expect(history.location.pathname).toBe('/register');
  });
});


