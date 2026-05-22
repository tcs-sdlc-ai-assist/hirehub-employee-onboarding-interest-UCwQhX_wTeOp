import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import * as storage from '../utils/storage';
import * as auth from '../utils/auth';

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  deleteSubmission: vi.fn(),
  updateSubmission: vi.fn(),
  isEmailDuplicate: vi.fn(),
}));

vi.mock('../utils/auth', () => ({
  logoutAdmin: vi.fn(),
}));

const mockSubmissions = [
  {
    id: 'id1',
    fullName: 'Alice Smith',
    email: 'alice@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'id2',
    fullName: 'Bob Johnson',
    email: 'bob@example.com',
    mobile: '9876543210',
    department: 'Marketing',
    submittedAt: '2024-02-20T14:00:00.000Z',
  },
  {
    id: 'id3',
    fullName: 'Carol White',
    email: 'carol@example.com',
    mobile: '5551234567',
    department: 'Engineering',
    submittedAt: '2024-03-10T09:00:00.000Z',
  },
];

const renderDashboard = (onLogout = vi.fn()) => {
  return render(
    <MemoryRouter>
      <AdminDashboard onLogout={onLogout} />
    </MemoryRouter>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    storage.getSubmissions.mockReset();
    storage.deleteSubmission.mockReset();
    storage.updateSubmission.mockReset();
    storage.isEmailDuplicate.mockReset();
    auth.logoutAdmin.mockReset();
    storage.getSubmissions.mockReturnValue([...mockSubmissions]);
    storage.deleteSubmission.mockReturnValue(true);
    storage.isEmailDuplicate.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('renders dashboard title and logout button', () => {
    it('renders the Admin Dashboard title', () => {
      renderDashboard();

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('renders the Logout button', () => {
      renderDashboard();

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton).toBeInTheDocument();
    });

    it('calls logoutAdmin and onLogout when Logout is clicked', async () => {
      const onLogout = vi.fn();
      renderDashboard(onLogout);

      const user = userEvent.setup();
      const logoutButton = screen.getByRole('button', { name: 'Logout' });

      await user.click(logoutButton);

      expect(auth.logoutAdmin).toHaveBeenCalledTimes(1);
      expect(onLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('displays correct stat cards', () => {
    it('displays total submissions count', () => {
      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays unique departments count', () => {
      renderDashboard();

      expect(screen.getByText('Departments')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays latest submission date', () => {
      renderDashboard();

      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
      expect(screen.getByText('Mar 10, 2024 9:00 AM')).toBeInTheDocument();
    });

    it('displays N/A for latest submission when no submissions exist', () => {
      storage.getSubmissions.mockReturnValue([]);

      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('displays 0 departments when no submissions exist', () => {
      storage.getSubmissions.mockReturnValue([]);

      renderDashboard();

      expect(screen.getByText('Departments')).toBeInTheDocument();
      const statCards = screen.getAllByText('0');
      expect(statCards.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('renders submission table with data', () => {
    it('renders the Submissions table title', () => {
      renderDashboard();

      expect(screen.getByText('Submissions')).toBeInTheDocument();
    });

    it('renders all submission names in the table', () => {
      renderDashboard();

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('Carol White')).toBeInTheDocument();
    });

    it('renders all submission emails in the table', () => {
      renderDashboard();

      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('carol@example.com')).toBeInTheDocument();
    });

    it('renders department badges', () => {
      renderDashboard();

      const engineeringBadges = screen.getAllByText('Engineering');
      expect(engineeringBadges.length).toBe(2);
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });

    it('renders empty state when no submissions exist', () => {
      storage.getSubmissions.mockReturnValue([]);

      renderDashboard();

      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
      expect(screen.getByText('Candidate submissions will appear here once received.')).toBeInTheDocument();
    });

    it('renders Edit and Delete buttons for each submission', () => {
      renderDashboard();

      const editButtons = screen.getAllByRole('button', { name: 'Edit' });
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe('edit button opens modal', () => {
    it('opens the edit modal when Edit button is clicked', async () => {
      renderDashboard();

      const user = userEvent.setup();
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });

      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Alice Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('alice@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });

    it('closes the edit modal when Cancel is clicked', async () => {
      renderDashboard();

      const user = userEvent.setup();
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });

      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('closes the edit modal when close button is clicked', async () => {
      renderDashboard();

      const user = userEvent.setup();
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });

      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('saves changes and closes modal on successful update', async () => {
      storage.updateSubmission.mockReturnValue({
        id: 'id1',
        fullName: 'Alice Updated',
        email: 'alice@example.com',
        mobile: '1234567890',
        department: 'Engineering',
        submittedAt: '2024-01-15T10:30:00.000Z',
      });

      const updatedSubmissions = [
        {
          id: 'id1',
          fullName: 'Alice Updated',
          email: 'alice@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-15T10:30:00.000Z',
        },
        mockSubmissions[1],
        mockSubmissions[2],
      ];

      renderDashboard();

      const user = userEvent.setup();
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });

      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const nameInput = screen.getByDisplayValue('Alice Smith');
      await user.clear(nameInput);
      await user.type(nameInput, 'Alice Updated');

      storage.getSubmissions.mockReturnValue(updatedSubmissions);

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      expect(storage.updateSubmission).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });
  });

  describe('delete button removes submission after confirmation', () => {
    it('deletes submission when user confirms', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const afterDeleteSubmissions = [mockSubmissions[1], mockSubmissions[2]];

      renderDashboard();

      const user = userEvent.setup();
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

      await user.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete the submission from "Alice Smith"?'
      );
      expect(storage.deleteSubmission).toHaveBeenCalledWith('id1');

      storage.getSubmissions.mockReturnValue(afterDeleteSubmissions);

      expect(storage.getSubmissions).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('does not delete submission when user cancels confirmation', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      renderDashboard();

      const user = userEvent.setup();
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

      await user.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(storage.deleteSubmission).not.toHaveBeenCalled();

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });

    it('reloads submissions after successful deletion', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      storage.deleteSubmission.mockReturnValue(true);

      const callCountBefore = storage.getSubmissions.mock.calls.length;

      renderDashboard();

      const callCountAfterRender = storage.getSubmissions.mock.calls.length;

      const user = userEvent.setup();
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

      storage.getSubmissions.mockReturnValue([mockSubmissions[1], mockSubmissions[2]]);

      await user.click(deleteButtons[0]);

      expect(storage.deleteSubmission).toHaveBeenCalledWith('id1');
      expect(storage.getSubmissions.mock.calls.length).toBeGreaterThan(callCountAfterRender);

      confirmSpy.mockRestore();
    });

    it('does not reload submissions when deletion fails', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      storage.deleteSubmission.mockReturnValue(false);

      renderDashboard();

      const callCountAfterRender = storage.getSubmissions.mock.calls.length;

      const user = userEvent.setup();
      const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

      await user.click(deleteButtons[0]);

      expect(storage.deleteSubmission).toHaveBeenCalledWith('id1');
      expect(storage.getSubmissions.mock.calls.length).toBe(callCountAfterRender);

      confirmSpy.mockRestore();
    });
  });
});