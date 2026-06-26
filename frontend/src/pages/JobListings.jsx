import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { FiSearch, FiMapPin, FiBriefcase, FiSliders, FiX } from 'react-icons/fi';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export default function JobListings() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (type) params.type = type;
    if (location) params.location = location;
    dispatch(fetchJobs(params));
  }, [dispatch, search, type, location]);

  const clearFilters = () => {
    setSearch('');
    setType('');
    setLocation('');
  };

  const hasFilters = Boolean(search || type || location);

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <header className="bg-gradient-to-br from-ink-950 to-ink-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-14 md:py-16">
          <h1 className="heading-serif text-4xl md:text-5xl text-white mb-2">Browse Jobs</h1>
          <p className="text-ink-400">Find your next opportunity</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 -mt-6 relative z-10">
        <div className="card-static p-4 sm:p-5 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />
              <input
                type="search"
                placeholder="Search by title, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 bg-cream-50"
                aria-label="Search jobs"
              />
            </div>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`p-3 rounded-xl border transition-all ${
                showFilters || hasFilters
                  ? 'bg-brand-50 border-brand-200 text-brand-600'
                  : 'border-amber-200 text-ink-300 hover:bg-cream-50 hover:border-amber-300'
              }`}
              aria-label="Toggle filters"
            >
              <FiSliders size={18} />
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="p-3 rounded-xl border border-amber-200 text-ink-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                aria-label="Clear filters"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {showFilters && <FiltersPanel type={type} setType={setType} location={location} setLocation={setLocation} />}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
        {loading ? (
          <Spinner text="Searching jobs..." />
        ) : jobs.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ink-400">
                Showing <span className="font-semibold text-ink-700">{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                Actively hiring
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job, i) => (
                <div key={job._id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FiltersPanel({ type, setType, location, setLocation }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-100 animate-scale-in">
      <div className="relative">
        <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field pl-10 bg-cream-50"
          aria-label="Filter by location"
        />
      </div>
      <div className="relative">
        <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={16} aria-hidden />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field pl-10 appearance-none bg-cream-50 cursor-pointer"
          aria-label="Filter by job type"
        >
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="card-static p-16 text-center">
      <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FiSearch className="text-2xl text-ink-300" />
      </div>
      <h3 className="text-lg font-semibold text-ink-700 mb-1">No jobs found</h3>
      <p className="text-ink-400 text-sm">Try adjusting your search or filters</p>
      {hasFilters && (
        <button onClick={onClear} className="btn-secondary mt-6 text-sm !px-4 !py-2">
          Clear Filters
        </button>
      )}
    </div>
  );
}
