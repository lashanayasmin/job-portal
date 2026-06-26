export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="loading-spinner"></div>
      <p className="text-sm font-medium text-ink-400 animate-pulse-soft">{text}</p>
    </div>
  );
}
