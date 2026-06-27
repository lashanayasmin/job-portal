import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/slices/jobSlice';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import {
  FiSearch, FiTrendingUp, FiShield, FiArrowRight,
  FiCheck, FiBriefcase, FiUsers, FiAward, FiZap,
} from 'react-icons/fi';

const STATS = [
  { value: '500+', label: 'Companies' },
  { value: '2,000+', label: 'Job listings' },
  { value: '5,000+', label: 'Hired grads' },
];

const FEATURES = [
  { icon: FiSearch, title: 'Smart matching', desc: 'Find roles that fit your skills and ambitions with our intelligent search engine.' },
  { icon: FiTrendingUp, title: 'Track progress', desc: 'Keep tabs on your applications and know exactly where you stand at all times.' },
  { icon: FiShield, title: 'Simple apply', desc: 'Upload your resume and apply in seconds. No fuss, no clutter, no hassle.' },
];

const EMPLOYER_BENEFITS = [
  'Reach thousands of qualified fresh graduates ready to work',
  'Smart filtering and streamlined application management',
  'Real-time updates and seamless team communication',
];

const JOB_PREVIEWS = [
  { title: 'Frontend Developer', company: 'TechCorp', type: 'Full-time', salary: '$60k-80k' },
  { title: 'Junior Designer', company: 'Studio Co', type: 'Full-time', salary: '$45k-55k' },
  { title: 'Data Analyst', company: 'DataFlow', type: 'Internship', salary: '$30k-40k' },
];

const EMPLOYER_PREVIEWS = [
  { title: 'Senior Developer', apps: 12, status: 'Active' },
  { title: 'UX Designer', apps: 8, status: 'Active' },
  { title: 'Product Manager', apps: 15, status: 'Active' },
];

const FOOTER_LINKS = {
  'Quick links': ['Browse Jobs', 'For Employers', 'About', 'Contact'],
  Support: ['Help', 'Privacy', 'Terms', 'FAQ'],
};

export default function Home() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs({}));
  }, [dispatch]);

  return (
    <div className="pt-16 lg:pt-20">
      <HeroSection />
      <FeaturesSection />
      <JobsSection jobs={jobs} loading={loading} />
      <EmployerSection />
      <FooterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream-100">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-200/40 rounded-full blur-[80px]" aria-hidden />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[100px]" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 uppercase tracking-[0.15em] mb-6 bg-brand-50 px-4 py-1.5 rounded-full">
              <FiZap size={12} />
              For fresh graduates
            </span>

            <h1 className="heading-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink-900 leading-[1.08] tracking-tight mb-6">
              Your career
              <br />
              <span className="text-brand-600 italic">starts here</span>
            </h1>

            <p className="text-lg text-ink-500 leading-relaxed max-w-md mb-8">
              The friendly place for fresh graduates to discover opportunities,
              connect with companies, and kickstart their career.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/jobs"
                className="btn-primary inline-flex items-center gap-2 group text-base !px-7 !py-3.5"
              >
                <FiSearch size={18} />
                Explore jobs
                <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signup"
                className="btn-secondary inline-flex items-center gap-2 text-base !px-7 !py-3.5"
              >
                Join for free
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-left">
                  <p className="text-2xl font-bold text-ink-900 heading-serif">{stat.value}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative animate-fade-in">
            <div className="w-full aspect-[4/5] bg-gradient-to-br from-brand-200 to-brand-100 rounded-[2.5rem] overflow-hidden shadow-warm-xl">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="space-y-4 w-full">
                  {JOB_PREVIEWS.map((item) => (
                    <div
                      key={item.title}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-warm-md border border-white/60 flex items-center justify-between hover:bg-white/95 transition-all cursor-default"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                        <p className="text-xs text-ink-400">{item.company}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-brand-600">{item.type}</span>
                        <p className="text-xs text-ink-400">{item.salary}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-warm-md border border-dashed border-brand-300 text-center">
                    <p className="text-sm text-ink-500 flex items-center justify-center gap-2">
                      <FiUsers size={14} className="text-brand-600" />
                      <span><span className="font-semibold text-brand-600">500+</span> opportunities waiting</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-cream-50 border border-amber-100 hover:border-brand-200 transition-all hover:-translate-y-1 hover:shadow-warm-md group cursor-default"
              >
                <div className="w-11 h-11 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                  <Icon className="text-brand-600" size={20} />
                </div>
                <h3 className="heading-serif text-lg text-ink-900 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JobsSection({ jobs, loading }) {
  return (
    <section className="py-16 md:py-24 bg-cream-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-[0.15em]">Fresh opportunities</span>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink-900 mt-2">Recent openings</h2>
            <p className="text-ink-400 mt-1 text-sm">Handpicked for fresh graduates like you</p>
          </div>
          <Link
            to="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-brand-600 transition-colors group"
          >
            See all
            <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <Spinner text="Finding opportunities..." />
        ) : jobs.length === 0 ? (
          <div className="card-static p-16 text-center">
            <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiBriefcase className="text-2xl text-ink-300" />
            </div>
            <p className="text-ink-500 text-lg font-medium">No jobs posted yet</p>
            <p className="text-ink-400 text-sm mt-1">Check back soon — new opportunities arriving daily</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.slice(0, 6).map((job, i) => (
              <div key={job._id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/jobs" className="btn-outline inline-flex items-center gap-2">
            See all jobs <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmployerSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-[0.15em]">For employers</span>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink-900 mt-2 mb-6">
              Hire fresh talent,
              <br />
              <span className="text-brand-600 italic">the easy way</span>
            </h2>
            <p className="text-ink-500 leading-relaxed mb-8 max-w-md">
              Post jobs, review applications, and find the perfect fresh graduates
              to grow your team. Simple, effective, and friendly.
            </p>
            <ul className="space-y-3 mb-8">
              {EMPLOYER_BENEFITS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                    <FiCheck className="text-brand-600" size={11} />
                  </div>
                  <span className="text-sm text-ink-600">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="btn-primary inline-flex items-center gap-2 group !px-7 !py-3.5"
            >
              Start hiring
              <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="hidden lg:block relative animate-fade-in">
            <div className="relative bg-gradient-to-br from-amber-100 to-cream-200 rounded-[2.5rem] p-8 shadow-warm-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <div className="w-3 h-3 rounded-full bg-amber-300" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="space-y-3">
                {EMPLOYER_PREVIEWS.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-amber-50 hover:shadow-warm-md transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink-800">{item.title}</p>
                      <p className="text-xs text-ink-400">{item.apps} applicants</p>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{item.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-amber-100">
                <p className="text-xs text-ink-400 text-center">Employer dashboard preview</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full bg-brand-100/50 rounded-[2.5rem] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-ink-950">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <span className="text-2xl font-bold heading-serif text-white">JobPortal</span>
            <p className="text-ink-400 text-sm leading-relaxed max-w-sm mt-3">
              The professional platform for fresh graduates to launch
              their careers and connect with top employers.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-ink-500 cursor-default">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-500">&copy; 2024 JobPortal. Made with care for fresh graduates.</p>
        </div>
      </div>
    </footer>
  );
}
