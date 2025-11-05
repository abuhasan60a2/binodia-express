export default function CategoryBadge({ label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'group relative inline-flex items-center rounded-full border text-sm transition-all duration-200',
        'pr-8 pl-3 py-1.5', // reserve space on the right to avoid text overlap/bounce
        active
          ? 'bg-emerald-900 text-white border-emerald-900 font-semibold hover:bg-emerald-800'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
      ].join(' ')}
    >
      <span className="truncate">{label}</span>
      <span
        aria-hidden
        className={[
          'absolute right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full',
          active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600',
          'transition-transform duration-200 group-hover:translate-x-0',
        ].join(' ')}
      >
        {active ? '✓' : '＋'}
      </span>
    </button>
  );
}


