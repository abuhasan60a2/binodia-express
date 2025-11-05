export default function QuantityStepper({ value, onChange, min = 1, className = '' }) {
  const dec = () => onChange(Math.max(min, Number(value) - 1));
  const inc = () => onChange(Number(value) + 1);

  return (
    <div className={["inline-flex items-stretch rounded-lg overflow-hidden border border-gray-300", className].filter(Boolean).join(' ')} role="group" aria-label="Quantity selector">
      <button
        type="button"
        onClick={dec}
        aria-label="Decrease quantity"
        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        −
      </button>
      <input
        aria-label="Quantity"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^0-9]/g, ''));
          onChange(Math.max(min, n || min));
        }}
        className="w-12 text-center outline-none px-2 py-2"
      />
      <button
        type="button"
        onClick={inc}
        aria-label="Increase quantity"
        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        +
      </button>
    </div>
  );
}


