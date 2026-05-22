/**
 * localStorage CRUD utility module for candidate submissions.
 * All data is stored under the key 'hirehub_submissions'.
 */

import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const STORAGE_KEY = 'hirehub_submissions';

/**
 * Reads and parses submissions from localStorage.
 * Resets to empty array on parse failure or corrupted data.
 * @returns {Array<Object>} Array of submission objects.
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Corrupted submissions data (not an array), resetting.');
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed;
  } catch (e) {
    console.warn('Corrupted submissions data, resetting.', e);
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  }
}

/**
 * Writes the given submissions array to localStorage.
 * @param {Array<Object>} submissions - The submissions array to persist.
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions to localStorage.', e);
  }
}

/**
 * Adds a new submission. Generates a unique ID and submittedAt timestamp.
 * @param {Object} submission - The submission data (fullName, email, mobile, department).
 */
export function addSubmission(submission) {
  try {
    const submissions = getSubmissions();
    const newSubmission = {
      ...submission,
      id: nanoid(),
      submittedAt: dayjs().toISOString(),
    };
    submissions.push(newSubmission);
    saveSubmissions(submissions);
    return newSubmission;
  } catch (e) {
    console.error('Failed to add submission.', e);
    return null;
  }
}

/**
 * Updates an existing submission by ID, merging in the provided updates.
 * @param {string} id - The submission ID to update.
 * @param {Object} updates - An object with fields to merge into the submission.
 * @returns {Object|null} The updated submission, or null if not found.
 */
export function updateSubmission(id, updates) {
  try {
    const submissions = getSubmissions();
    const index = submissions.findIndex((s) => s.id === id);
    if (index === -1) {
      console.warn(`Submission with id "${id}" not found.`);
      return null;
    }
    submissions[index] = { ...submissions[index], ...updates };
    saveSubmissions(submissions);
    return submissions[index];
  } catch (e) {
    console.error('Failed to update submission.', e);
    return null;
  }
}

/**
 * Deletes a submission by ID.
 * @param {string} id - The submission ID to delete.
 * @returns {boolean} True if deleted, false if not found.
 */
export function deleteSubmission(id) {
  try {
    const submissions = getSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);
    if (filtered.length === submissions.length) {
      console.warn(`Submission with id "${id}" not found for deletion.`);
      return false;
    }
    saveSubmissions(filtered);
    return true;
  } catch (e) {
    console.error('Failed to delete submission.', e);
    return false;
  }
}

/**
 * Checks if an email already exists in submissions.
 * @param {string} email - The email to check.
 * @param {string} [excludeId] - Optional submission ID to exclude from the check (for edits).
 * @returns {boolean} True if a duplicate email exists.
 */
export function isEmailDuplicate(email, excludeId) {
  try {
    const submissions = getSubmissions();
    const normalizedEmail = email.trim().toLowerCase();
    return submissions.some(
      (s) => s.email.trim().toLowerCase() === normalizedEmail && s.id !== excludeId
    );
  } catch (e) {
    console.error('Failed to check email duplicate.', e);
    return false;
  }
}