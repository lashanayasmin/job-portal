import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck, FiBriefcase } from 'react-icons/fi';

const BENEFITS = [
  'Browse hundreds of job listings',
  'Apply with one click',
  'Track your applications',
  'Connect with top employers',
];

const ROLES = [
  { value: 'seeker', label: 'Job Seeker' },
  { value: 'employer', label: 'Employer' },
];

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'seeker',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    dispatch(register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    }));
  };

  return (
    <div className="min-h-screen flex pt-16 lg:pt-20 bg-cream-50">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute top-40 -right-20 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-md">
          <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-500/10">
            <FiBriefcase className="text-brand-400 text-2xl" />
          </div>
          <p className="heading-serif text-4xl text-white mb-4 leading-tight">Start your journey</p>
          <p className="text-ink-400 leading-relaxed text-sm mb-10">
            Join thousands of fresh graduates who found their dream jobs through our platform.
          </p>
          <ul className="space-y-4">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-500/15 rounded-full flex items-center justify-center shrink-0">
                  <FiCheck className="text-brand-400" size={12} />
                </div>
                <span className="text-sm text-ink-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <h1 className="heading-serif text-3xl text-ink-900">Create Account</h1>
            <p className="text-ink-400 text-sm mt-1">Start your career journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              icon={FiUser}
              autoComplete="name"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              icon={FiMail}
              autoComplete="email"
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Min 6 chars"
                value={form.password}
                onChange={handleChange}
                icon={FiLock}
                autoComplete="new-password"
              />
              <InputField
                label="Confirm"
                name="confirmPassword"
                type="password"
                placeholder="Confirm"
                value={form.confirmPassword}
                onChange={handleChange}
                icon={FiLock}
              />
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-ink-700 mb-2">I am a</legend>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      form.role === role.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-amber-200 bg-white text-ink-500 hover:border-amber-300 hover:bg-cream-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{role.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="loading-spinner-sm" />
              ) : (
                <>
                  Create Account <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, type, placeholder, value, onChange, icon: Icon, autoComplete }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field pl-10"
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );
}
