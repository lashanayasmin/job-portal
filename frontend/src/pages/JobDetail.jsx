import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../redux/slices/jobSlice';
import { applyJob } from '../redux/slices/applicationSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {
  FiMapPin, FiClock, FiBriefcase, FiDollarSign, FiUsers,
  FiFileText, FiArrowLeft, FiUpload, FiCheck, FiCalendar, FiHome,
} from 'react-icons/fi';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function JobDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchJob(id));
  }, [dispatch, id]);

  const resetResume = useCallback(() => setResume(null), []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error('Please upload your resume (PDF)');

    const formData = new FormData();
    formData.append('resume', resume);
    setApplying(true);

    const result = await dispatch(applyJob({ jobId: id, formData }));
    setApplying(false);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Application submitted!');
      resetResume();
    } else {
      toast.error(result.payload || 'Failed to apply');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50 flex items-center justify-center">
        <Spinner text="Loading job details..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="text-3xl text-ink-300" />
          </div>
          <h2 className="heading-serif text-2xl text-ink-900 mb-2">Job not found</h2>
          <p className="text-ink-400 mb-6">This listing may have been removed.</p>
          <button onClick={() => navigate('/jobs')} className="btn-primary">
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-ink-600 transition-colors mb-6 group"
        >
          <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to listings
        </button>

        <div className="card-static p-6 sm:p-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
                <FiBriefcase size={28} />
              </div>
              <div>
                <h1 className="heading-serif text-2xl text-ink-900">{job.title}</h1>
                <p className="text-ink-400 inline-flex items-center gap-1.5 mt-0.5 text-sm">
                  <FiHome size={14} /> {job.company}
                </p>
              </div>
            </div>
            <span className="badge-warm shrink-0 self-start">{job.type}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-ink-500 mb-8">
            <InfoTile icon={FiMapPin} label={job.location} />
            <InfoTile icon={FiDollarSign} label={job.salary} />
            <InfoTile icon={FiUsers} label={`${job.vacancies} vacancy(ies)`} />
            <InfoTile icon={FiCalendar} label={formatDate(job.createdAt)} />
          </div>

          <Section title="Description" text={job.description} />

          {job.requirements?.length > 0 && (
            <Section title="Requirements">
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-500 text-sm">
                    <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <FiCheck className="text-brand-600" size={10} />
                    </div>
                    {req}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {user?.role === 'seeker' && (
            <ApplySection
              resume={resume}
              setResume={setResume}
              applying={applying}
              onSubmit={handleApply}
            />
          )}

          {!user && (
            <div className="border-t border-amber-100 pt-6 text-center">
              <p className="text-ink-400 mb-4">Sign in to apply for this position</p>
              <button onClick={() => navigate('/login')} className="btn-primary">
                Sign In to Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 p-3 bg-cream-50 rounded-xl">
      <Icon className="text-ink-300 shrink-0" size={16} aria-hidden />
      <span className="truncate">{label}</span>
    </div>
  );
}

function Section({ title, children, text }) {
  return (
    <div className="mb-8">
      <h2 className="heading-serif text-lg text-ink-900 mb-3">{title}</h2>
      {text && <p className="text-ink-500 whitespace-pre-line leading-relaxed">{text}</p>}
      {children}
    </div>
  );
}

function ApplySection({ resume, setResume, applying, onSubmit }) {
  return (
    <div className="border-t border-amber-100 pt-6">
      <h2 className="heading-serif text-lg text-ink-900 mb-4">Apply for this position</h2>
      <form onSubmit={onSubmit} className="sm:flex items-center gap-4">
        <label
          className="flex items-center gap-3 px-5 py-3.5 bg-cream-50 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all duration-200 mb-3 sm:mb-0 flex-1 group"
        >
          <FiUpload className="text-ink-300 group-hover:text-brand-500 transition-colors shrink-0" size={18} aria-hidden />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-ink-600 block truncate">
              {resume ? resume.name : 'Upload Resume (PDF)'}
            </span>
            {!resume && <span className="text-xs text-ink-400">Max 5MB</span>}
          </div>
          {resume && (
            <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
              <FiCheck className="text-brand-600" size={14} />
            </div>
          )}
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="sr-only"
          />
        </label>
        <button
          type="submit"
          disabled={applying}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shrink-0"
        >
          {applying ? (
            <div className="loading-spinner-sm" />
          ) : (
            <>
              Submit <FiFileText size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
