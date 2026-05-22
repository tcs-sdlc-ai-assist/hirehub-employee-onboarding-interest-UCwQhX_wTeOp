/**
 * Validation utility functions for HireHub forms.
 * Each validator returns an error message string (empty string if valid).
 */

const ALLOWED_DEPARTMENTS = [
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

/**
 * Validates a full name field.
 * @param {string} name - The full name to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'Full Name is required.';
  }
  if (name.trim().length > 100) {
    return 'Full Name must be 100 characters or fewer.';
  }
  if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    return 'Full Name must contain only letters and spaces.';
  }
  return '';
}

/**
 * Validates an email address field.
 * @param {string} email - The email to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateEmail(email) {
  if (typeof email !== 'string' || email.trim().length === 0) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Invalid email address.';
  }
  return '';
}

/**
 * Validates a mobile number field.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateMobile(mobile) {
  if (typeof mobile !== 'string' || mobile.trim().length === 0) {
    return 'Mobile number is required.';
  }
  if (!/^\d{10}$/.test(mobile.trim())) {
    return 'Mobile number must be 10 digits.';
  }
  return '';
}

/**
 * Validates a department selection.
 * @param {string} department - The department to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateDepartment(department) {
  if (typeof department !== 'string' || department.trim().length === 0) {
    return 'Department is required.';
  }
  if (!ALLOWED_DEPARTMENTS.includes(department.trim())) {
    return 'Please select a valid department.';
  }
  return '';
}

export { ALLOWED_DEPARTMENTS };