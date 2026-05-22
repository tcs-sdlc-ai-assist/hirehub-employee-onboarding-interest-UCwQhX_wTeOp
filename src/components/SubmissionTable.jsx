import { useCallback } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

function getDepartmentBadgeClass(department) {
  const normalized = department.toLowerCase().replace(/\s+/g, '-');
  const validBadges = [
    'engineering',
    'marketing',
    'sales',
    'hr',
    'human-resources',
    'finance',
    'operations',
    'design',
    'product',
    'legal',
    'support',
  ];
  if (validBadges.includes(normalized)) {
    return `badge badge-${normalized}`;
  }
  return 'badge badge-default';
}

function SubmissionTable({ submissions, onEdit, onDelete }) {
  const handleDelete = useCallback((submission) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the submission from "${submission.fullName}"?`
    );
    if (confirmed && onDelete) {
      onDelete(submission.id);
    }
  }, [onDelete]);

  const handleEdit = useCallback((submission) => {
    if (onEdit) {
      onEdit(submission);
    }
  }, [onEdit]);

  if (!submissions || submissions.length === 0) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Submissions</h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No submissions yet.</h3>
          <p className="empty-state-text">
            Candidate submissions will appear here once received.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Submissions</h2>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Submitted On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={submission.id}>
                <td>{index + 1}</td>
                <td>{submission.fullName}</td>
                <td>{submission.email}</td>
                <td>{submission.mobile}</td>
                <td>
                  <span className={getDepartmentBadgeClass(submission.department)}>
                    {submission.department}
                  </span>
                </td>
                <td>
                  {submission.submittedAt
                    ? dayjs(submission.submittedAt).format('MMM D, YYYY h:mm A')
                    : '—'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEdit(submission)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(submission)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;