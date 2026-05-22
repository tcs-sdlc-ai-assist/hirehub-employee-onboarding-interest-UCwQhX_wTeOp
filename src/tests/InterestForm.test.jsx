import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InterestForm from '../components/InterestForm';
import * as storage from '../utils/storage';
import * as validators from '../utils/validators';

vi.mock('../utils/storage', () => ({
  addSubmission: vi.fn(),
  isEmailDuplicate: vi.fn(),
}));

const renderInterestForm = () => {
  return render(
    <MemoryRouter initialEntries={['/apply']}>
      <InterestForm />
    </MemoryRouter>
  );
};

describe('InterestForm', () => {
  beforeEach(() => {
    storage.addSubmission.mockReset();
    storage.isEmailDuplicate.mockReset();
    storage.addSubmission.mockReturnValue({
      id: 'test-id-123',
      fullName: 'John Doe',
      email: 'john@example.com',
      mobile: '1234567890',
      department: 'Engineering',
      submittedAt: '2024-01-01T00:00:00.000Z',
    });
    storage.isEmailDuplicate.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('renders all form fields', () => {
    it('renders the form title and subtitle', () => {
      renderInterestForm();

      expect(screen.getByText('Express Your Interest')).toBeInTheDocument();
      expect(screen.getByText('Fill out the form below and our team will get back to you shortly.')).toBeInTheDocument();
    });

    it('renders Full Name input field', () => {
      renderInterestForm();

      const fullNameInput = screen.getByLabelText(/Full Name/i);
      expect(fullNameInput).toBeInTheDocument();
      expect(fullNameInput).toHaveAttribute('type', 'text');
      expect(fullNameInput).toHaveAttribute('placeholder', 'Enter your full name');
    });

    it('renders Email input field', () => {
      renderInterestForm();

      const emailInput = screen.getByLabelText(/Email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address');
    });

    it('renders Mobile Number input field', () => {
      renderInterestForm();

      const mobileInput = screen.getByLabelText(/Mobile Number/i);
      expect(mobileInput).toBeInTheDocument();
      expect(mobileInput).toHaveAttribute('type', 'tel');
      expect(mobileInput).toHaveAttribute('placeholder', 'Enter your 10-digit mobile number');
    });

    it('renders Department of Interest select field', () => {
      renderInterestForm();

      const departmentSelect = screen.getByLabelText(/Department of Interest/i);
      expect(departmentSelect).toBeInTheDocument();
    });

    it('renders all department options', () => {
      renderInterestForm();

      const departmentSelect = screen.getByLabelText(/Department of Interest/i);
      expect(departmentSelect).toBeInTheDocument();

      validators.ALLOWED_DEPARTMENTS.forEach((dept) => {
        expect(screen.getByRole('option', { name: dept })).toBeInTheDocument();
      });
    });

    it('renders the Submit button', () => {
      renderInterestForm();

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders the Back to Home link', () => {
      renderInterestForm();

      const backLink = screen.getByRole('link', { name: /Back to Home/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });
  });

  describe('shows validation errors for empty required fields', () => {
    it('shows all validation errors when submitting empty form', async () => {
      renderInterestForm();

      const user = userEvent.setup();
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.click(submitButton);

      expect(screen.getByText('Full Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Mobile number is required.')).toBeInTheDocument();
      expect(screen.getByText('Department is required.')).toBeInTheDocument();
    });

    it('shows validation error for invalid email format', async () => {
      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'invalid-email');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
    });

    it('shows validation error for invalid mobile number', async () => {
      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '12345');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('Mobile number must be 10 digits.')).toBeInTheDocument();
    });

    it('shows validation error for name with special characters', async () => {
      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John@Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('Full Name must contain only letters and spaces.')).toBeInTheDocument();
    });

    it('clears field error when user starts typing', async () => {
      renderInterestForm();

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('Full Name is required.')).toBeInTheDocument();

      await user.type(screen.getByLabelText(/Full Name/i), 'J');

      expect(screen.queryByText('Full Name is required.')).not.toBeInTheDocument();
    });

    it('does not call addSubmission when validation fails', async () => {
      renderInterestForm();

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(storage.addSubmission).not.toHaveBeenCalled();
    });
  });

  describe('shows error for duplicate email', () => {
    it('shows duplicate email error when email already exists', async () => {
      storage.isEmailDuplicate.mockReturnValue(true);

      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
      expect(storage.addSubmission).not.toHaveBeenCalled();
    });
  });

  describe('successful submission clears form and shows success banner', () => {
    it('shows success banner and clears form on successful submission', async () => {
      storage.isEmailDuplicate.mockReturnValue(false);
      storage.addSubmission.mockReturnValue({
        id: 'test-id-123',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
        submittedAt: '2024-01-01T00:00:00.000Z',
      });

      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText(/Submission Successful/i)).toBeInTheDocument();
      expect(screen.getByText('Thank you for your interest. We will be in touch soon.')).toBeInTheDocument();

      expect(storage.addSubmission).toHaveBeenCalledTimes(1);
      expect(storage.addSubmission).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('');
      expect(screen.getByLabelText(/Mobile Number/i)).toHaveValue('');
      expect(screen.getByLabelText(/Department of Interest/i)).toHaveValue('');
    });

    it('shows error banner when addSubmission returns null', async () => {
      storage.isEmailDuplicate.mockReturnValue(false);
      storage.addSubmission.mockReturnValue(null);

      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('Failed to save your submission. Please try again.')).toBeInTheDocument();
      expect(screen.queryByText(/Submission Successful/i)).not.toBeInTheDocument();
    });

    it('shows error banner when addSubmission throws an error', async () => {
      storage.isEmailDuplicate.mockReturnValue(false);
      storage.addSubmission.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderInterestForm();

      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('success banner disappears after timeout', () => {
    it('success banner disappears after 4 seconds', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      storage.isEmailDuplicate.mockReturnValue(false);
      storage.addSubmission.mockReturnValue({
        id: 'test-id-123',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
        submittedAt: '2024-01-01T00:00:00.000Z',
      });

      renderInterestForm();

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText(/Submission Successful/i)).toBeInTheDocument();

      vi.advanceTimersByTime(4000);

      await waitFor(() => {
        expect(screen.queryByText(/Submission Successful/i)).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });
});