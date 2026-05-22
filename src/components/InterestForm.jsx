import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

function InterestForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showSuccess]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.mobile && !newErrors.department;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSubmitError('');
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    if (isEmailDuplicate(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'This email has already been submitted.' }));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = addSubmission({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        department: formData.department.trim(),
      });

      if (result) {
        setFormData({
          fullName: '',
          email: '',
          mobile: '',
          department: '',
        });
        setErrors({
          fullName: '',
          email: '',
          mobile: '',
          department: '',
        });
        setShowSuccess(true);
      } else {
        setSubmitError('Failed to save your submission. Please try again.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-card-title">Express Your Interest</h1>
        <p className="form-card-subtitle">
          Fill out the form below and our team will get back to you shortly.
        </p>

        {showSuccess && (
          <div className="success-banner">
            <p className="success-banner-title">✅ Submission Successful!</p>
            <p className="success-banner-text">
              Thank you for your interest. We will be in touch soon.
            </p>
          </div>
        )}

        {submitError && (
          <div className="error-banner">{submitError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-input${errors.fullName ? ' input-error' : ''}`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.fullName && (
              <p className="form-error">{errors.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input${errors.email ? ' input-error' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className={`form-input${errors.mobile ? ' input-error' : ''}`}
              placeholder="Enter your 10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.mobile && (
              <p className="form-error">{errors.mobile}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">
              Department of Interest <span className="required">*</span>
            </label>
            <select
              id="department"
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

          <button
            type="submit"
            className="form-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <p className="text-center mt-lg">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default InterestForm;