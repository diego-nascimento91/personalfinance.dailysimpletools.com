import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import PasswordReseted from './PasswordReseted';
import { createMemoryHistory } from 'history';

describe('Password Reseted', () => {
  it('should contain alert of email sent', () => {
    render(
      <BrowserRouter>
        <PasswordReseted />
      </BrowserRouter>
    );
    const alert = screen.getByRole('alert');

    expect(alert.textContent).toContain('sent to your email');
  });

  it('should render page Login when link clicked', () => {
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