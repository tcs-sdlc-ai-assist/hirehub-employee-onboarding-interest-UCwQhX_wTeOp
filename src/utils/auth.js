/**
 * Session management utility for admin authentication.
 * Uses sessionStorage to maintain admin auth state (tab-scoped, cleared on close).
 * Credentials are hardcoded for demo purposes: admin / admin.
 */

const SESSION_KEY = 'hirehub_admin_auth';

/**
 * Validates admin credentials and sets session state on success.
 * @param {string} username - The admin username.
 * @param {string} password - The admin password.
 * @returns {boolean} True if credentials are valid and session was set, false otherwise.
 */
export function loginAdmin(username, password) {
  try {
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to set admin session.', e);
    return false;
  }
}

/**
 * Clears admin session state from sessionStorage.
 * @returns {void}
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear admin session.', e);
  }
}

/**
 * Checks whether the admin is currently authenticated.
 * @returns {boolean} True if admin session is active, false otherwise.
 */
export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {
    console.error('Failed to check admin session.', e);
    return false;
  }
}