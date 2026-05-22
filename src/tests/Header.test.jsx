import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import * as auth from '../utils/auth';

vi.mock('../utils/auth', () => ({
  isAdminAuthenticated: vi.fn(),
  logoutAdmin: vi.fn(),
}));

const renderHeader = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Header />
    </MemoryRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    auth.isAdminAuthenticated.mockReturnValue(false);
    auth.logoutAdmin.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logo', () => {
    it('renders HireHub logo linking to /', () => {
      renderHeader();

      const logo = screen.getByRole('link', { name: 'HireHub' });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
    });
  });

  describe('navigation links', () => {
    it('renders Home navigation link', () => {
      renderHeader();

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders Apply navigation link', () => {
      renderHeader();

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      expect(applyLink).toBeInTheDocument();
      expect(applyLink).toHaveAttribute('href', '/apply');
    });

    it('renders Admin navigation link', () => {
      renderHeader();

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      expect(adminLink).toBeInTheDocument();
      expect(adminLink).toHaveAttribute('href', '/admin');
    });
  });

  describe('authentication state', () => {
    it('shows Login button when not authenticated', () => {
      auth.isAdminAuthenticated.mockReturnValue(false);

      renderHeader();

      const loginButton = screen.getByRole('button', { name: 'Login' });
      expect(loginButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    });

    it('shows Logout button when authenticated', () => {
      auth.isAdminAuthenticated.mockReturnValue(true);

      renderHeader();

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    });

    it('logout clears session and updates UI', async () => {
      auth.isAdminAuthenticated.mockReturnValue(true);

      renderHeader();

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton).toBeInTheDocument();

      auth.isAdminAuthenticated.mockReturnValue(false);

      const user = userEvent.setup();
      await user.click(logoutButton);

      expect(auth.logoutAdmin).toHaveBeenCalledTimes(1);

      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    });
  });

  describe('mobile menu toggle', () => {
    it('renders the menu toggle button', () => {
      renderHeader();

      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles menu open and closed on click', async () => {
      renderHeader();

      const user = userEvent.setup();
      const toggleButton = screen.getByLabelText('Open menu');

      await user.click(toggleButton);

      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

      await user.click(screen.getByLabelText('Close menu'));

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });
  });
});