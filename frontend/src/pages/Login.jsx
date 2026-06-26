import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiBriefcase, FiZap } from 'react-icons/fi';

const LOGIN_STATS = [
  { value: '500+', label: 'Companies' },
  { value: '2K+', label: 'Jobs' },
  { value: '5K+', label: 'Hired' },
];

const INITIAL_FORM = { email: '', password: '' };

export default function Login() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
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
    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex pt-16 lg:pt-20 bg-cream-50">
      <Panel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <h1 className="heading-serif text-3xl text-ink-900">Sign In</h1>
            <p className="text-ink-400 text-sm mt-1">Access your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              icon={FiMail}
            />

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="loading-spinner-sm" />
              ) : (
                <>
                  Sign In <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, type, placeholder, value, onChange, icon: Icon }) {
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
          autoComplete={name === 'password' ? 'current-password' : 'email'}
        />
      </div>
    </div>
  );
}

function Panel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden items-center justify-center p-12">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-md">
        <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-500/10">
          <FiBriefcase className="text-brand-400 text-2xl" />
        </div>
        <p className="heading-serif text-4xl text-white mb-4 leading-tight">Welcome back</p>
        <p className="text-ink-400 leading-relaxed text-sm">
          Continue your journey. Sign in to track applications and connect with employers.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-4">
          {LOGIN_STATS.map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <p className="text-xl font-bold text-white heading-serif">{stat.value}</p>
              <p className="text-xs text-ink-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
