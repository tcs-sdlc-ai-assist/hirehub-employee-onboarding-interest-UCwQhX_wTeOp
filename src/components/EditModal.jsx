import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';
import { updateSubmission, isEmailDuplicate } from '../utils/storage';

function EditModal({ submission, onSave, onClose }) {
  const [formData, setFormData] = useState({
    fullName: submission.fullName || '',
    email: submission.email || '',
    mobile: submission.mobile || '',
    department: submission.department || '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobile: '',
    department: '',
  });

  const [submitError, setSubmitError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.mobile && !newErrors.department;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const updates = {
        fullName: formData.fullName.trim(),
        mobile: formData.mobile.trim(),
        department: formData.department.trim(),
      };

      const result = updateSubmission(submission.id, updates);

      if (result) {
        if (onSave) {
          onSave(result);
        }
      } else {
        setSubmitError('Submission not found. It may have been deleted.');
      }
    } catch (err) {
      console.error('Failed to update submission:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }, [formData, submission.id, validateForm, onSave]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <button
          className="modal-close"
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="modal-card-title">Edit Submission</h2>

        {submitError && (
          <div className="error-banner">{submitError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="edit-fullName" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-fullName"
              name="fullName"
              className={`form-input${errors.fullName ? ' input-error' : ''}`}
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.fullName && (
              <p className="form-error">{errors.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="edit-email"
              name="email"
              className="form-input"
              value={formData.email}
              readOnly
              disabled
              style={{ backgroundColor: 'var(--color-gray-100)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-mobile" className="form-label">
              Mobile Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="edit-mobile"
              name="mobile"
              className={`form-input${errors.mobile ? ' input-error' : ''}`}
              placeholder="Enter 10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.mobile && (
              <p className="form-error">{errors.mobile}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-department" className="form-label">
              Department of Interest <span className="required">*</span>
            </label>
            <select
              id="edit-department"
              name="department"
              className={`form-select${errors.department ? ' input-error' : ''}`}
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select a department</option>
              {ALLOWED_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="form-error">{errors.department}</p>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditModal;