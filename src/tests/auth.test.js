import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../utils/auth';

describe('auth', () => {
  let store;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn((key) => (key in store ? store[key] : null)),
      setItem: vi.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loginAdmin', () => {
    it('returns true and sets sessionStorage for correct credentials', () => {
      const result = loginAdmin('admin', 'admin');

      expect(result).toBe(true);
      expect(sessionStorage.setItem).toHaveBeenCalledWith('hirehub_admin_auth', 'true');
      expect(store['hirehub_admin_auth']).toBe('true');
    });

    it('returns false for incorrect username', () => {
      const result = loginAdmin('wronguser', 'admin');

      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(store['hirehub_admin_auth']).toBeUndefined();
    });

    it('returns false for incorrect password', () => {
      const result = loginAdmin('admin', 'wrongpass');

      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(store['hirehub_admin_auth']).toBeUndefined();
    });

    it('returns false for both incorrect username and password', () => {
      const result = loginAdmin('wronguser', 'wrongpass');

      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('returns false for empty credentials', () => {
      const result = loginAdmin('', '');

      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('handles sessionStorage errors gracefully', () => {
      sessionStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = loginAdmin('admin', 'admin');

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('logoutAdmin', () => {
    it('removes the session key from sessionStorage', () => {
      store['hirehub_admin_auth'] = 'true';

      logoutAdmin();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('hirehub_admin_auth');
      expect(store['hirehub_admin_auth']).toBeUndefined();
    });

    it('does not throw when session key does not exist', () => {
      expect(() => logoutAdmin()).not.toThrow();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('hirehub_admin_auth');
    });

    it('handles sessionStorage errors gracefully', () => {
      sessionStorage.removeItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => logoutAdmin()).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  describe('isAdminAuthenticated', () => {
    it('returns true when session is active', () => {
      store['hirehub_admin_auth'] = 'true';

      const result = isAdminAuthenticated();

      expect(result).toBe(true);
      expect(sessionStorage.getItem).toHaveBeenCalledWith('hirehub_admin_auth');
    });

    it('returns false when session key does not exist', () => {
      const result = isAdminAuthenticated();

      expect(result).toBe(false);
      expect(sessionStorage.getItem).toHaveBeenCalledWith('hirehub_admin_auth');
    });

    it('returns false when session value is not "true"', () => {
      store['hirehub_admin_auth'] = 'false';

      const result = isAdminAuthenticated();

      expect(result).toBe(false);
    });

    it('returns false when session value is an arbitrary string', () => {
      store['hirehub_admin_auth'] = 'something';

      const result = isAdminAuthenticated();

      expect(result).toBe(false);
    });

    it('handles sessionStorage errors gracefully and returns false', () => {
      sessionStorage.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = isAdminAuthenticated();

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });

    it('returns correct state after login and logout sequence', () => {
      expect(isAdminAuthenticated()).toBe(false);

      loginAdmin('admin', 'admin');
      expect(isAdminAuthenticated()).toBe(true);

      logoutAdmin();
      expect(isAdminAuthenticated()).toBe(false);
    });
  });
});