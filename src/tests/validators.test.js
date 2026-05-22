import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
  ALLOWED_DEPARTMENTS,
} from '../utils/validators';

describe('validators', () => {
  describe('validateName', () => {
    it('returns error for empty string', () => {
      expect(validateName('')).toBe('Full Name is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateName('   ')).toBe('Full Name is required.');
    });

    it('returns error for undefined input', () => {
      expect(validateName(undefined)).toBe('Full Name is required.');
    });

    it('returns error for null input', () => {
      expect(validateName(null)).toBe('Full Name is required.');
    });

    it('returns error for non-string input', () => {
      expect(validateName(123)).toBe('Full Name is required.');
    });

    it('returns error for name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101);
      expect(validateName(longName)).toBe('Full Name must be 100 characters or fewer.');
    });

    it('returns empty string for name exactly 100 characters', () => {
      const name = 'A'.repeat(100);
      expect(validateName(name)).toBe('');
    });

    it('returns error for name containing numbers', () => {
      expect(validateName('John123')).toBe('Full Name must contain only letters and spaces.');
    });

    it('returns error for name containing special characters', () => {
      expect(validateName('John@Doe')).toBe('Full Name must contain only letters and spaces.');
    });

    it('returns empty string for valid name', () => {
      expect(validateName('John Doe')).toBe('');
    });

    it('returns empty string for valid name with multiple spaces', () => {
      expect(validateName('John Michael Doe')).toBe('');
    });

    it('returns empty string for single word name', () => {
      expect(validateName('Alice')).toBe('');
    });

    it('returns empty string for name with leading/trailing spaces (trimmed valid)', () => {
      expect(validateName('  John Doe  ')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('returns error for empty string', () => {
      expect(validateEmail('')).toBe('Email is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateEmail('   ')).toBe('Email is required.');
    });

    it('returns error for undefined input', () => {
      expect(validateEmail(undefined)).toBe('Email is required.');
    });

    it('returns error for null input', () => {
      expect(validateEmail(null)).toBe('Email is required.');
    });

    it('returns error for non-string input', () => {
      expect(validateEmail(42)).toBe('Email is required.');
    });

    it('returns error for email without @ symbol', () => {
      expect(validateEmail('johndoe.com')).toBe('Invalid email address.');
    });

    it('returns error for email without domain', () => {
      expect(validateEmail('john@')).toBe('Invalid email address.');
    });

    it('returns error for email without TLD', () => {
      expect(validateEmail('john@example')).toBe('Invalid email address.');
    });

    it('returns error for email with spaces', () => {
      expect(validateEmail('john doe@example.com')).toBe('Invalid email address.');
    });

    it('returns error for email with multiple @ symbols', () => {
      expect(validateEmail('john@@example.com')).toBe('Invalid email address.');
    });

    it('returns empty string for valid email', () => {
      expect(validateEmail('john@example.com')).toBe('');
    });

    it('returns empty string for valid email with subdomain', () => {
      expect(validateEmail('john@mail.example.com')).toBe('');
    });

    it('returns empty string for valid email with plus addressing', () => {
      expect(validateEmail('john+tag@example.com')).toBe('');
    });

    it('returns empty string for valid email with leading/trailing spaces (trimmed)', () => {
      expect(validateEmail('  john@example.com  ')).toBe('');
    });
  });

  describe('validateMobile', () => {
    it('returns error for empty string', () => {
      expect(validateMobile('')).toBe('Mobile number is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateMobile('   ')).toBe('Mobile number is required.');
    });

    it('returns error for undefined input', () => {
      expect(validateMobile(undefined)).toBe('Mobile number is required.');
    });

    it('returns error for null input', () => {
      expect(validateMobile(null)).toBe('Mobile number is required.');
    });

    it('returns error for non-string input', () => {
      expect(validateMobile(1234567890)).toBe('Mobile number is required.');
    });

    it('returns error for mobile number with fewer than 10 digits', () => {
      expect(validateMobile('123456789')).toBe('Mobile number must be 10 digits.');
    });

    it('returns error for mobile number with more than 10 digits', () => {
      expect(validateMobile('12345678901')).toBe('Mobile number must be 10 digits.');
    });

    it('returns error for mobile number containing letters', () => {
      expect(validateMobile('12345abcde')).toBe('Mobile number must be 10 digits.');
    });

    it('returns error for mobile number containing special characters', () => {
      expect(validateMobile('123-456-78')).toBe('Mobile number must be 10 digits.');
    });

    it('returns error for mobile number with spaces', () => {
      expect(validateMobile('123 456 78')).toBe('Mobile number must be 10 digits.');
    });

    it('returns empty string for valid 10-digit mobile number', () => {
      expect(validateMobile('1234567890')).toBe('');
    });

    it('returns empty string for valid mobile number with leading/trailing spaces (trimmed)', () => {
      expect(validateMobile('  1234567890  ')).toBe('');
    });
  });

  describe('validateDepartment', () => {
    it('returns error for empty string', () => {
      expect(validateDepartment('')).toBe('Department is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateDepartment('   ')).toBe('Department is required.');
    });

    it('returns error for undefined input', () => {
      expect(validateDepartment(undefined)).toBe('Department is required.');
    });

    it('returns error for null input', () => {
      expect(validateDepartment(null)).toBe('Department is required.');
    });

    it('returns error for non-string input', () => {
      expect(validateDepartment(123)).toBe('Department is required.');
    });

    it('returns error for invalid department name', () => {
      expect(validateDepartment('Accounting')).toBe('Please select a valid department.');
    });

    it('returns error for department with wrong casing', () => {
      expect(validateDepartment('engineering')).toBe('Please select a valid department.');
    });

    it('returns empty string for valid department Engineering', () => {
      expect(validateDepartment('Engineering')).toBe('');
    });

    it('returns empty string for valid department Marketing', () => {
      expect(validateDepartment('Marketing')).toBe('');
    });

    it('returns empty string for valid department Sales', () => {
      expect(validateDepartment('Sales')).toBe('');
    });

    it('returns empty string for valid department Human Resources', () => {
      expect(validateDepartment('Human Resources')).toBe('');
    });

    it('returns empty string for valid department Finance', () => {
      expect(validateDepartment('Finance')).toBe('');
    });

    it('returns empty string for valid department Operations', () => {
      expect(validateDepartment('Operations')).toBe('');
    });

    it('returns empty string for valid department Design', () => {
      expect(validateDepartment('Design')).toBe('');
    });

    it('returns empty string for valid department Product', () => {
      expect(validateDepartment('Product')).toBe('');
    });

    it('returns empty string for valid department Legal', () => {
      expect(validateDepartment('Legal')).toBe('');
    });

    it('returns empty string for valid department Support', () => {
      expect(validateDepartment('Support')).toBe('');
    });
  });

  describe('ALLOWED_DEPARTMENTS', () => {
    it('exports an array of 10 departments', () => {
      expect(Array.isArray(ALLOWED_DEPARTMENTS)).toBe(true);
      expect(ALLOWED_DEPARTMENTS).toHaveLength(10);
    });

    it('contains all expected department names', () => {
      const expected = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
        'Design',
        'Product',
        'Legal',
        'Support',
      ];
      expect(ALLOWED_DEPARTMENTS).toEqual(expected);
    });
  });
});