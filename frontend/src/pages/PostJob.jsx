import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJob } from '../redux/slices/jobSlice';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSend, FiBriefcase, FiMapPin, FiDollarSign, FiUsers, FiEdit3 } from 'react-icons/fi';

const INITIAL_FORM = {
  title: '', company: '', location: '', type: 'Full-time',
  description: '', requirements: '', salary: '', vacancies: 1,
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export default function PostJob() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.jobs);
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      return toast.error('Please fill in all required fields');
    }

    const result = await dispatch(createJob({
      ...form,
      requirements: form.requirements
        ? form.requirements.split('\n').filter(Boolean).map((r) => r.trim())
        : [],
      vacancies: Number(form.vacancies),
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Job posted!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Failed to post job');
    }
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <Header
        title="Post a New Job"
        subtitle="Fill in the details to attract the best talent"
        onBack={() => navigate(-1)}
      />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 -mt-6 relative z-10 pb-12">
        <div className="card-static p-6 sm:p-8 animate-fade-in">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Job Title" required name="title" value={form.title} onChange={handleChange} icon={FiEdit3} placeholder="e.g. Frontend Developer" />
              <FormField label="Company" required name="company" value={form.company} onChange={handleChange} icon={FiBriefcase} placeholder="Company name" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Location" required name="location" value={form.location} onChange={handleChange} icon={FiMapPin} placeholder="e.g. New York, NY" />
              <SelectField label="Job Type" name="type" value={form.type} onChange={handleChange} options={JOB_TYPES} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Salary" name="salary" value={form.salary} onChange={handleChange} icon={FiDollarSign} placeholder="e.g. $50k - $70k" />
              <FormField label="Vacancies" name="vacancies" type="number" value={form.vacancies} onChange={handleChange} icon={FiUsers} min={1} />
            </div>
            <TextAreaField label="Description" required name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the role, responsibilities, and what you're looking for..." />
            <TextAreaField label="Requirements (one per line)" name="requirements" value={form.requirements} onChange={handleChange} rows={4} placeholder={"Bachelor's degree in Computer Science\nStrong problem-solving skills"} />
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
                {loading ? <div className="loading-spinner-sm" /> : <><FiSend size={16} /> Post Job</>}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Header({ title, subtitle, onBack }) {
  return (
    <div className="bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" aria-hidden />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-14">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-white transition-colors mb-4 group">
          <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>
        <h1 className="heading-serif text-3xl text-white">{title}</h1>
        <p className="text-ink-400 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function FormField({ label, required, name, value, onChange, icon: Icon, placeholder, type = 'text', min }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />}
        <input id={name} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} min={min} className="input-field pl-10" />
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

function TextAreaField({ label, required, name, value, onChange, rows, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className="input-field resize-none" />
    </div>
  );
}
