import { RecoilRoot } from 'recoil';
import { BrowserRouter, Router } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useUser } from 'state/hooks/user';
import ResetPassword from './ResetPassword';
import FirebaseAuthService from 'services/FirebaseAuthService';

const mockedNav = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNav
  };
});

jest.mock('state/hooks/firebaseHooks', () => {
  return {
    useUser: jest.fn()
  };
});

jest.mock('assets/functions/FirebaseAuthService', () => {
  return {
    sendPasswordReset: jest.fn()
  };
});

//global variables
const validEmail = 'email@example.com';
const invalidEmail = 'invalid..email@[ 123.123.123.123 ]';

describe('User already Loggedin', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([true, false]);
  });

  it('should render /home', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </RecoilRoot>
    );

    expect(mockedNav).toBeCalled();
    expect(mockedNav).toBeCalledWith('/home');
  });
});

describe('Reset Form', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });
  
  it('should call sendPasswordReset() for valid email', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const buttonSubmit = screen.getByRole('submit');

    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.click(buttonSubmit);

    expect(FirebaseAuthService.sendPasswordReset).toBeCalled();
    expect(FirebaseAuthService.sendPasswordReset).toBeCalledWith(validEmail);
  });

  it('should render /Emailsent for valid email', async () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </RecoilRoot>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const buttonSubmit = screen.getByRole('submit');

    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.click(buttonSubmit);
    await act(async () => {
      Promise.resolve();
    });

    expect(mockedNav).toBeCalled();
    expect(mockedNav).toBeCalledWith('/resetpassword/emailsent');
  });

  it('should show alert for empty email', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    const buttonSubmit = screen.getByText('Submit');

    fireEvent.click(buttonSubmit);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Input required! Please enter your email.');
  });

  it('should show alert for invalid email', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    const emailInput = screen.getByPlaceholderText('youremail@domain.com');
    const buttonSubmit = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: invalidEmail } });
    fireEvent.click(buttonSubmit);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Email not valid');
  });
});

describe('Links to Login and Register Page', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue([false, false]);
  });

  it('should render Login when link is clicked', () => {
    const history = createMemoryHistory({ initialEntries: ['/resetpassword'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <ResetPassword />
        </RecoilRoot>
      </Router>
    );
    const linkLogin = screen.getByText('Click here to Login');

    fireEvent.click(linkLogin);

    expect(history.location.pathname).toBe('/');
  });

  it('should render Register when link is clicked', () => {
    const history = createMemoryHistory({ initialEntries: ['/resetpassword'] });
    render(
      <Router location={history.location} navigator={history}>
        <RecoilRoot>
          <ResetPassword />
        </RecoilRoot>
      </Router>
    );
    const linkRegister = screen.getByText('Register now');

    fireEvent.click(linkRegister);
    
    expect(history.location.pathname).toBe('/register');
  });
});

