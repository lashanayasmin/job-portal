import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob, updateJob, clearCurrentJob } from '../redux/slices/jobSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { FiArrowLeft, FiSave, FiBriefcase, FiMapPin, FiDollarSign, FiUsers, FiEdit3 } from 'react-icons/fi';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJob, loading } = useSelector((state) => state.jobs);
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    description: '', requirements: '', salary: '', vacancies: 1,
  });

  useEffect(() => {
    dispatch(fetchJob(id));
    return () => dispatch(clearCurrentJob());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob) {
      setForm({
        title: currentJob.title || '',
        company: currentJob.company || '',
        location: currentJob.location || '',
        type: currentJob.type || 'Full-time',
        description: currentJob.description || '',
        requirements: (currentJob.requirements || []).join('\n'),
        salary: currentJob.salary || '',
        vacancies: currentJob.vacancies || 1,
      });
    }
  }, [currentJob]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      return toast.error('Please fill in all required fields');
    }

    const result = await dispatch(updateJob({
      id,
      jobData: {
        ...form,
        requirements: form.requirements
          ? form.requirements.split('\n').filter(Boolean).map((r) => r.trim())
          : [],
        vacancies: Number(form.vacancies),
      },
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Job updated!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Failed to update job');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50 flex items-center justify-center">
        <Spinner text="Loading job..." />
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <div className="bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-14">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-white transition-colors mb-4 group">
            <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="heading-serif text-3xl text-white">Edit Job</h1>
          <p className="text-ink-400 text-sm mt-1">Update your job listing</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 -mt-6 relative z-10 pb-12">
        <div className="card-static p-6 sm:p-8 animate-fade-in">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Job Title" required name="title" value={form.title} onChange={handleChange} icon={FiEdit3} />
              <FormField label="Company" required name="company" value={form.company} onChange={handleChange} icon={FiBriefcase} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Location" required name="location" value={form.location} onChange={handleChange} icon={FiMapPin} />
              <SelectField label="Job Type" name="type" value={form.type} onChange={handleChange} options={JOB_TYPES} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Salary" name="salary" value={form.salary} onChange={handleChange} icon={FiDollarSign} />
              <FormField label="Vacancies" name="vacancies" type="number" value={form.vacancies} onChange={handleChange} icon={FiUsers} min={1} />
            </div>
            <TextAreaField label="Description" required name="description" value={form.description} onChange={handleChange} rows={5} />
            <TextAreaField label="Requirements (one per line)" name="requirements" value={form.requirements} onChange={handleChange} rows={4} />
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
                {loading ? <div className="loading-spinner-sm" /> : <><FiSave size={16} /> Save Changes</>}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, name, value, onChange, icon: Icon, type = 'text', min }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />}
        <input id={name} type={type} name={name} value={value} onChange={onChange} min={min} className="input-field pl-10" />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className="input-field bg-white appearance-none cursor-pointer">
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function TextAreaField({ label, required, name, value, onChange, rows }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="input-field resize-none" />
    </div>
  );
}
