import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployerJobs, deleteJob } from '../redux/slices/jobSlice';
import { fetchJobApplications, updateApplicationStatus } from '../redux/slices/applicationSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiBriefcase, FiUsers,
  FiCheck, FiX, FiSearch, FiFileText, FiClock, FiMapPin,
} from 'react-icons/fi';

const STATS_CONFIG = [
  { key: 'totalJobs', label: 'Total Jobs', icon: FiBriefcase, bg: 'bg-brand-50', color: 'text-brand-600' },
  { key: 'applications', label: 'Applications', icon: FiUsers, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { key: 'active', label: 'Active', icon: FiClock, bg: 'bg-amber-50', color: 'text-amber-600' },
  { key: 'shortlisted', label: 'Shortlisted', icon: FiCheck, bg: 'bg-purple-50', color: 'text-purple-600' },
];

const STATUS_BADGE = {
  pending: 'badge-yellow',
  reviewed: 'badge-blue',
  shortlisted: 'badge-green',
  rejected: 'badge-red',
};

const STATUS_ACTIONS = ['pending', 'reviewed'];

export default function EmployerDashboard() {
  const dispatch = useDispatch();
  const { employerJobs, loading } = useSelector((state) => state.jobs);
  const { jobApplications } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewing, setViewing] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    const result = await dispatch(deleteJob(id));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Job deleted');
      if (selectedJob === id) {
        setSelectedJob(null);
        setViewing(false);
      }
    }
  }, [dispatch, selectedJob]);

  const viewApplicants = useCallback(async (jobId) => {
    setSelectedJob(jobId);
    setViewing(true);
    await dispatch(fetchJobApplications(jobId));
  }, [dispatch]);

  const handleStatus = useCallback(async (appId, status) => {
    await dispatch(updateApplicationStatus({ id: appId, status }));
    toast.success(`Application ${status}`);
  }, [dispatch]);

  if (loading && employerJobs.length === 0) return <Spinner text="Loading dashboard..." />;

  const stats = {
    totalJobs: employerJobs.length,
    applications: jobApplications.length,
    active: employerJobs.filter((j) => j.type === 'Full-time').length,
    shortlisted: jobApplications.filter((a) => a.status === 'shortlisted').length,
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <Header user={user} />
      <StatsGrid stats={stats} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pb-12">
        <div className="grid lg:grid-cols-5 gap-6">
          <JobsList
            jobs={employerJobs}
            selectedJob={selectedJob}
            onSelect={viewApplicants}
            onDelete={handleDelete}
          />
          <ApplicantsSection
            viewing={viewing}
            applications={jobApplications}
            onStatusChange={handleStatus}
          />
        </div>
      </div>
    </div>
  );
}

function Header({ user }) {
  return (
    <div className="bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="heading-serif text-3xl text-white">Employer Dashboard</h1>
            <p className="text-ink-400 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link to="/post-job"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-cream-50 transition-all shadow-warm-md shrink-0 hover:-translate-y-0.5">
            <FiPlus size={16} /> Post a Job
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 -mt-6 relative z-10 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS_CONFIG.map((cfg) => {
          const Icon = cfg.icon;
          return (
            <div key={cfg.key} className="card-static p-4 sm:p-5 hover:shadow-warm-md transition-all">
              <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={cfg.color} size={18} />
              </div>
              <p className="text-2xl font-bold text-ink-900">{stats[cfg.key]}</p>
              <p className="text-xs text-ink-400 mt-0.5 font-medium">{cfg.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JobsList({ jobs, selectedJob, onSelect, onDelete }) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
        <FiBriefcase size={18} className="text-brand-600" />
        Your Jobs
        <span className="text-sm font-normal text-ink-400">({jobs.length})</span>
      </h2>

      {jobs.length === 0 ? (
        <div className="card-static p-10 text-center">
          <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="text-2xl text-ink-300" />
          </div>
          <p className="text-ink-500 text-sm font-medium mb-4">No jobs posted yet</p>
          <Link to="/post-job" className="btn-primary text-sm !px-5 !py-2.5">Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id}
              className={`card p-4 cursor-pointer group transition-all ${
                selectedJob === job._id ? 'ring-2 ring-brand-500 shadow-warm-md' : ''
              }`}
              onClick={() => onSelect(job._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(job._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-800 truncate group-hover:text-brand-600 transition-colors">{job.title}</h3>
                  <p className="text-xs text-ink-400 inline-flex items-center gap-1.5 mt-0.5">
                    <FiMapPin size={11} /> {job.location}
                  </p>
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                  <Link to={`/edit-job/${job._id}`} onClick={(e) => e.stopPropagation()}
                    className="icon-btn">
                    <FiEdit2 size={14} />
                  </Link>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(job._id); }}
                    className="icon-btn hover:text-red-500 hover:bg-red-50">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="badge-warm text-xs">{job.type}</span>
                <span className="text-xs text-ink-400">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicantsSection({ viewing, applications, onStatusChange }) {
  return (
    <div className="lg:col-span-3">
      <h2 className="text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
        <FiUsers size={18} className="text-brand-600" />
        Applicants
        {viewing && <span className="text-sm font-normal text-ink-400">({applications.length})</span>}
      </h2>

      {!viewing ? (
        <div className="card-static p-16 text-center">
          <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiSearch className="text-2xl text-ink-300" />
          </div>
          <h3 className="text-lg font-semibold text-ink-600 mb-1">Select a Job</h3>
          <p className="text-sm text-ink-400">Choose a job from the left to view applicants</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card-static p-12 text-center">
          <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiFileText className="text-2xl text-ink-300" />
          </div>
          <h3 className="text-lg font-semibold text-ink-600 mb-1">No Applications Yet</h3>
          <p className="text-sm text-ink-400">No one has applied to this position yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicantCard key={app._id} app={app} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicantCard({ app, onStatusChange }) {
  const badgeClass = STATUS_BADGE[app.status] || 'badge-gray';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {app.seeker?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-ink-800">{app.seeker?.name}</h3>
            <p className="text-xs text-ink-400">{app.seeker?.email}</p>
          </div>
        </div>
        <span className={badgeClass}>{app.status}</span>
      </div>

      {app.seeker?.profile?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {app.seeker.profile.skills.map((skill, i) => (
            <span key={i} className="text-xs font-medium px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs pt-3 border-t border-amber-100">
        <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium">
          <FiEye size={14} /> View Resume
        </a>
        <span className="text-amber-200 hidden sm:inline">|</span>
        <span className="text-ink-400 inline-flex items-center gap-1">
          <FiClock size={12} /> Applied {new Date(app.createdAt).toLocaleDateString()}
        </span>
        {STATUS_ACTIONS.includes(app.status) && (
          <div className="flex gap-1 sm:ml-auto">
            <button onClick={() => onStatusChange(app._id, 'shortlisted')}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all" title="Shortlist">
              <FiCheck size={14} />
            </button>
            <button onClick={() => onStatusChange(app._id, 'rejected')}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all" title="Reject">
              <FiX size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
