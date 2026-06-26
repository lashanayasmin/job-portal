import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Browse Jobs' },
];

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-warm-md' : 'bg-transparent'
      }`}
      role="navigation"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl font-bold heading-serif text-ink-900 group-hover:text-brand-600 transition-colors">
              JobPortal
            </span>
            <span className="hidden sm:inline text-xs text-ink-300 italic font-medium">
              &mdash; find work you love
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'text-brand-600' : 'text-ink-500 hover:text-ink-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-amber-200">
                <span className="text-sm font-medium text-ink-700 hidden lg:inline">{user.name}</span>
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-ink-400 hover:text-brand-600 transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary !py-2 !px-4 !text-xs">
                  Get Started <FiArrowRight size={14} className="inline" />
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-amber-200 text-ink-600 hover:bg-amber-50 transition-all"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && <MobileMenu user={user} handleLogout={handleLogout} isActive={isActive} />}
    </nav>
  );
}

function MobileMenu({ user, handleLogout, isActive }) {
  return (
    <div className="md:hidden border-t border-amber-100 bg-white shadow-warm-lg animate-fade-in">
      <div className="px-5 py-4 space-y-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(link.to) ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-amber-50'
            }`}
          >
            {link.label}
          </Link>
        ))}

        {user && (
          <Link
            to="/dashboard"
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/dashboard') ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-amber-50'
            }`}
          >
            Dashboard
          </Link>
        )}

        <hr className="my-3 border-amber-100" />

        {user ? (
          <div className="space-y-2 px-2">
            <div className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-ink-800">{user.name}</p>
                <p className="text-xs text-ink-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2 px-2 pt-1">
            <Link
              to="/login"
              className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium text-ink-600 border border-amber-200 hover:bg-amber-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
