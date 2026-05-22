import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { logoutAdmin } from '../utils/auth';
import { getSubmissions, deleteSubmission } from '../utils/storage';
import SubmissionTable from './SubmissionTable';
import EditModal from './EditModal';

function AdminDashboard({ onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleLogout = useCallback(() => {
    logoutAdmin();
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  const handleEdit = useCallback((submission) => {
    setEditingSubmission(submission);
  }, []);

  const handleDelete = useCallback((id) => {
    const success = deleteSubmission(id);
    if (success) {
      loadSubmissions();
    }
  }, [loadSubmissions]);

  const handleSave = useCallback(() => {
    loadSubmissions();
    setEditingSubmission(null);
  }, [loadSubmissions]);

  const handleCloseModal = useCallback(() => {
    setEditingSubmission(null);
  }, []);

  const totalSubmissions = submissions.length;

  const uniqueDepartments = new Set(submissions.map((s) => s.department)).size;

  const latestSubmission = submissions.length > 0
    ? submissions.reduce((latest, current) => {
        if (!latest.submittedAt) return current;
        if (!current.submittedAt) return latest;
        return dayjs(current.submittedAt).isAfter(dayjs(latest.submittedAt))
          ? current
          : latest;
      }, submissions[0])
    : null;

  const latestDate = latestSubmission && latestSubmission.submittedAt
    ? dayjs(latestSubmission.submittedAt).format('MMM D, YYYY h:mm A')
    : 'N/A';

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button
          type="button"
          className="btn btn-primary header-btn-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-label">Total Submissions</div>
          <div className="stat-card-value">{totalSubmissions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Departments</div>
          <div className="stat-card-value">{uniqueDepartments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Latest Submission</div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-sm)' }}>
            {latestDate}
          </div>
        </div>
      </div>

      <SubmissionTable
        submissions={submissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

AdminDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;