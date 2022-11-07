import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import PasswordReseted from './PasswordReseted';
import { createMemoryHistory } from 'history';

describe('Password Reseted behavior', () => {
  test('should contain alert of email sent', () => {
    render(
      <BrowserRouter>
        <PasswordReseted />
      </BrowserRouter>
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('sent to your email');
  });

  test('should render page Login when clicked in the link', () => {
    const history = createMemoryHistory({initialEntries: ['/resetpassword/emailsent']});
    render(
      <Router navigator={history} location={history.location}>
        <PasswordReseted />
      </Router>
    );
    const linkLogin = screen.getByText('Click here');
    fireEvent.click(linkLogin);
    expect(history.location.pathname).toBe('/');
  });
});