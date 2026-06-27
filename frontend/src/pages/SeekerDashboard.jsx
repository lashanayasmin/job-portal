import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchMyApplications } from '../redux/slices/applicationSlice';
import Spinner from '../components/Spinner';
import { getResumeUrl } from '../utils/resume';
import { toast } from 'react-toastify';
import {
  FiUser, FiMail, FiPhone, FiBriefcase, FiFileText, FiUpload,
  FiEye, FiCheck, FiClock, FiEdit2, FiSave, FiX, FiCalendar,
  FiAward, FiBookOpen,
} from 'react-icons/fi';

const STATUS_MAP = {
  pending: 'badge-yellow',
  reviewed: 'badge-blue',
  shortlisted: 'badge-green',
  rejected: 'badge-red',
};

const STATS_CONFIG = [
  { key: 'total', label: 'Applications', icon: FiFileText, bg: 'bg-brand-50', color: 'text-brand-600' },
  { key: 'shortlisted', label: 'Shortlisted', icon: FiAward, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { key: 'pending', label: 'Pending', icon: FiClock, bg: 'bg-amber-50', color: 'text-amber-600' },
];

export default function SeekerDashboard() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { myApplications, loading: appsLoading } = useSelector((state) => state.applications);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: '', skills: '', experience: '', education: '' });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.profile?.phone || '',
        skills: (user.profile?.skills || []).join(', '),
        experience: user.profile?.experience || '',
        education: user.profile?.education || '',
      });
    }
    dispatch(fetchMyApplications());
  }, [dispatch, user]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('phone', form.phone);
    formData.append('skills', form.skills.split(',').map((s) => s.trim()).filter(Boolean));
    formData.append('experience', form.experience);
    formData.append('education', form.education);
    if (resume) formData.append('resume', resume);

    const result = await dispatch(updateProfile(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated!');
      setEditing(false);
      setResume(null);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  if (!user) return <Spinner />;

  const stats = {
    total: myApplications.length,
    shortlisted: myApplications.filter((a) => a.status === 'shortlisted').length,
    pending: myApplications.filter((a) => a.status === 'pending').length,
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <Header />
      <StatsRow stats={stats} />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <ProfileCard
            user={user}
            editing={editing}
            setEditing={setEditing}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            resume={resume}
            setResume={setResume}
            loading={loading}
          />
          <ApplicationsPanel applications={myApplications} loading={appsLoading} />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-14">
        <h1 className="heading-serif text-3xl text-white">My Dashboard</h1>
        <p className="text-ink-400 text-sm mt-1">Track your applications and manage your profile</p>
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 -mt-6 relative z-10 mb-8">
      <div className="grid grid-cols-3 gap-4">
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

function ProfileCard({ user, editing, setEditing, form, handleChange, handleSubmit, resume, setResume, loading }) {
  return (
    <div className="card-static p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-ink-900 flex items-center gap-2">
          <FiUser size={18} className="text-brand-600" />
          My Profile
        </h2>
        <button onClick={() => setEditing((prev) => !prev)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
            editing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
          }`}>
          {editing ? <><FiX size={14} /> Cancel</> : <><FiEdit2 size={14} /> Edit</>}
        </button>
      </div>

      {editing ? (
        <EditProfileForm form={form} onChange={handleChange} onSubmit={handleSubmit} resume={resume} setResume={setResume} loading={loading} user={user} />
      ) : (
        <ViewProfile user={user} />
      )}
    </div>
  );
}

function ViewProfile({ user }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-amber-100">
        <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-ink-800">{user.name}</h3>
          <p className="text-xs text-ink-400 inline-flex items-center gap-1 mt-0.5">
            <FiMail size={11} /> {user.email}
          </p>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-ink-600">
          <FiPhone size={14} className="text-ink-300 shrink-0" />
          <span>{user.profile?.phone || <span className="text-ink-300 italic">Not set</span>}</span>
        </div>
        <SkillsSection skills={user.profile?.skills} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-ink-500 mb-1 flex items-center gap-1.5">
              <FiBookOpen size={12} /> Education
            </p>
            <p className="text-ink-600 text-sm">{user.profile?.education || <span className="text-ink-300 italic">Not set</span>}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-ink-500 mb-1 flex items-center gap-1.5">
              <FiBriefcase size={12} /> Experience
            </p>
            <p className="text-ink-600 text-sm">{user.profile?.experience || <span className="text-ink-300 italic">Not set</span>}</p>
          </div>
        </div>
        {user.profile?.resume && (
          <a href={getResumeUrl(user.profile.resume)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium">
            <FiFileText size={14} /> View Resume
          </a>
        )}
      </div>
    </div>
  );
}

function SkillsSection({ skills }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-500 mb-1.5 flex items-center gap-1.5">
        <FiAward size={12} /> Skills
      </p>
      {skills?.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, i) => (
            <span key={i} className="text-xs font-medium px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg">{skill}</span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ink-300 italic">Not set</p>
      )}
    </div>
  );
}

function EditProfileForm({ form, onChange, onSubmit, resume, setResume, loading, user }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} icon={FiPhone} />
      <FormField label="Skills (comma separated)" name="skills" value={form.skills} onChange={onChange} placeholder="React, Node.js, MongoDB" />
      <TextAreaField label="Education" name="education" value={form.education} onChange={onChange} rows={2} />
      <TextAreaField label="Experience" name="experience" value={form.experience} onChange={onChange} rows={2} />
      <ResumeUpload resume={resume} setResume={setResume} user={user} />
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
        {loading ? <div className="loading-spinner-sm" /> : <><FiSave size={14} /> Save Profile</>}
      </button>
    </form>
  );
}

function FormField({ label, name, value, onChange, icon: Icon, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-ink-600 mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" size={14} />}
        <input id={name} type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="input-field pl-9 text-sm" />
      </div>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, rows }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-ink-600 mb-1">{label}</label>
      <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="input-field text-sm resize-none" />
    </div>
  );
}

function ResumeUpload({ resume, setResume, user }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">Resume (PDF)</label>
      <label className="flex items-center gap-3 px-4 py-3 bg-cream-50 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all text-sm group">
        <FiUpload className="text-ink-300 group-hover:text-brand-500 transition-colors shrink-0" size={16} />
        <span className="text-ink-600 truncate flex-1">{resume ? resume.name : 'Upload new resume'}</span>
        <input type="file" accept=".pdf,application/pdf" onChange={(e) => setResume(e.target.files[0])} className="sr-only" />
      </label>
      {user.profile?.resume && (
        <a href={getResumeUrl(user.profile.resume)} target="_blank" rel="noopener noreferrer"
          className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 mt-1.5">
          <FiEye size={12} /> View current resume
        </a>
      )}
    </div>
  );
}

function ApplicationsPanel({ applications, loading }) {
  return (
    <div className="card-static p-6">
      <h2 className="text-lg font-bold text-ink-900 mb-6 flex items-center gap-2">
        <FiFileText size={18} className="text-brand-600" />
        My Applications
      </h2>

      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="text-2xl text-ink-300" />
          </div>
          <p className="text-ink-500 text-sm font-medium">No applications yet</p>
          <p className="text-xs text-ink-400 mt-1">Start browsing jobs and apply!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-hide">
          {applications.map((app) => (
            <ApplicationCard key={app._id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app }) {
  const badgeClass = STATUS_MAP[app.status] || 'badge-gray';
  return (
    <div className="border border-amber-100 rounded-xl p-4 hover:border-brand-200 hover:bg-cream-50 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink-800 text-sm truncate">{app.job?.title}</h3>
          <p className="text-xs text-ink-400 inline-flex items-center gap-1 mt-0.5">
            <FiBriefcase size={11} /> {app.job?.company}
          </p>
        </div>
        <span className={badgeClass}>{app.status}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-ink-400 mt-2 pt-2 border-t border-amber-50">
        <span className="inline-flex items-center gap-1">
          <FiCalendar size={11} /> {new Date(app.createdAt).toLocaleDateString()}
        </span>
        <a href={getResumeUrl(app.resume)} target="_blank" rel="noopener noreferrer"
          className="text-brand-600 hover:underline inline-flex items-center gap-1 ml-auto font-medium">
          <FiEye size={11} /> Resume
        </a>
      </div>
    </div>
  );
}
