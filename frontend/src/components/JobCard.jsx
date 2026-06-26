import { Link } from 'react-router-dom';
import { FiMapPin, FiArrowRight, FiClock } from 'react-icons/fi';

const TYPE_STYLES = {
  'Full-time': { class: 'badge-warm' },
  'Part-time': { class: 'badge-blue' },
  'Internship': { class: 'badge-green' },
  'Contract': { class: 'badge-yellow' },
  'Remote': { class: 'badge-gray' },
};

function getTimeAgo(dateString) {
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function JobCard({ job }) {
  const style = TYPE_STYLES[job.type] || { class: 'badge-gray' };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card p-6 block group h-full flex flex-col relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-1 h-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden
      />

      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="heading-serif text-xl text-ink-900 group-hover:text-brand-600 transition-colors leading-tight truncate">
            {job.title}
          </h3>
          <p className="text-sm text-ink-400 mt-0.5">{job.company}</p>
        </div>
        <span className={`${style.class} shrink-0 ml-3`}>{job.type}</span>
      </div>

      <p className="text-sm text-ink-500 leading-relaxed mb-5 line-clamp-2 flex-1">
        {job.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-amber-100">
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <FiMapPin size={13} aria-hidden />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiClock size={13} aria-hidden />
            {getTimeAgo(job.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-brand-600">{job.salary}</span>
          <span
            className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center
                       text-brand-600 group-hover:bg-brand-600 group-hover:text-white
                       group-hover:rotate-0 transition-all duration-300"
          >
            <FiArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
