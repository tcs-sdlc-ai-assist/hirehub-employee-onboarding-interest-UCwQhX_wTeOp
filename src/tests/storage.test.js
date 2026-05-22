import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from '../utils/storage';

describe('storage', () => {
  let store;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
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

  describe('getSubmissions', () => {
    it('returns empty array when localStorage is empty', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when valid data exists', () => {
      const submissions = [
        {
          id: 'abc123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(submissions);

      const result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
    });

    it('handles corrupted JSON gracefully and resets to empty array', () => {
      store['hirehub_submissions'] = '{not valid json!!!';

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      expect(localStorage.setItem).toHaveBeenCalledWith('hirehub_submissions', '[]');
      consoleSpy.mockRestore();
    });

    it('handles non-array data gracefully and resets to empty array', () => {
      store['hirehub_submissions'] = JSON.stringify({ not: 'an array' });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      expect(localStorage.setItem).toHaveBeenCalledWith('hirehub_submissions', '[]');
      consoleSpy.mockRestore();
    });
  });

  describe('saveSubmissions', () => {
    it('persists data correctly to localStorage', () => {
      const submissions = [
        {
          id: 'abc123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '9876543210',
          department: 'Marketing',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveSubmissions(submissions);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'hirehub_submissions',
        JSON.stringify(submissions)
      );
      expect(store['hirehub_submissions']).toBe(JSON.stringify(submissions));
    });

    it('handles localStorage errors gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => saveSubmissions([{ id: '1' }])).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  describe('addSubmission', () => {
    it('creates entry with ID and timestamp', () => {
      const submission = {
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        mobile: '5551234567',
        department: 'Engineering',
      };

      const result = addSubmission(submission);

      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);
      expect(result.submittedAt).toBeDefined();
      expect(typeof result.submittedAt).toBe('string');
      expect(result.fullName).toBe('Alice Smith');
      expect(result.email).toBe('alice@example.com');
      expect(result.mobile).toBe('5551234567');
      expect(result.department).toBe('Engineering');
    });

    it('appends to existing submissions', () => {
      const existing = [
        {
          id: 'existing1',
          fullName: 'Bob',
          email: 'bob@example.com',
          mobile: '1111111111',
          department: 'Sales',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      addSubmission({
        fullName: 'Carol',
        email: 'carol@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(2);
      expect(saved[0].id).toBe('existing1');
      expect(saved[1].fullName).toBe('Carol');
    });
  });

  describe('updateSubmission', () => {
    it('modifies the correct entry', () => {
      const submissions = [
        {
          id: 'id1',
          fullName: 'Dave',
          email: 'dave@example.com',
          mobile: '3333333333',
          department: 'Finance',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'id2',
          fullName: 'Eve',
          email: 'eve@example.com',
          mobile: '4444444444',
          department: 'Legal',
          submittedAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(submissions);

      const result = updateSubmission('id1', {
        fullName: 'David',
        department: 'Operations',
      });

      expect(result).not.toBeNull();
      expect(result.id).toBe('id1');
      expect(result.fullName).toBe('David');
      expect(result.department).toBe('Operations');
      expect(result.email).toBe('dave@example.com');

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved[0].fullName).toBe('David');
      expect(saved[1].fullName).toBe('Eve');
    });

    it('returns null when submission is not found', () => {
      store['hirehub_submissions'] = JSON.stringify([]);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = updateSubmission('nonexistent', { fullName: 'Ghost' });

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('deleteSubmission', () => {
    it('removes the correct entry', () => {
      const submissions = [
        {
          id: 'id1',
          fullName: 'Frank',
          email: 'frank@example.com',
          mobile: '5555555555',
          department: 'Support',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'id2',
          fullName: 'Grace',
          email: 'grace@example.com',
          mobile: '6666666666',
          department: 'Product',
          submittedAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(submissions);

      const result = deleteSubmission('id1');

      expect(result).toBe(true);

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('id2');
    });

    it('returns false when submission is not found', () => {
      store['hirehub_submissions'] = JSON.stringify([]);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = deleteSubmission('nonexistent');

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('isEmailDuplicate', () => {
    beforeEach(() => {
      const submissions = [
        {
          id: 'id1',
          fullName: 'Hank',
          email: 'hank@example.com',
          mobile: '7777777777',
          department: 'Engineering',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'id2',
          fullName: 'Ivy',
          email: 'ivy@example.com',
          mobile: '8888888888',
          department: 'Marketing',
          submittedAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(submissions);
    });

    it('detects existing emails', () => {
      expect(isEmailDuplicate('hank@example.com')).toBe(true);
    });

    it('detects existing emails case-insensitively', () => {
      expect(isEmailDuplicate('HANK@EXAMPLE.COM')).toBe(true);
    });

    it('returns false for non-existing emails', () => {
      expect(isEmailDuplicate('unknown@example.com')).toBe(false);
    });

    it('excludes a specific ID from the duplicate check', () => {
      expect(isEmailDuplicate('hank@example.com', 'id1')).toBe(false);
    });

    it('still detects duplicate when excludeId does not match', () => {
      expect(isEmailDuplicate('hank@example.com', 'id2')).toBe(true);
    });
  });
});