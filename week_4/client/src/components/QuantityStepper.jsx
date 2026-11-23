// CONTROLLED COMPONENT
// --------------------
// This component has NO state of its own. It does not remember the number.
// The PARENT (TourCard) owns the state and passes it down as props:
//   value    -> what to display (data flows DOWN)
//   onChange -> a function to call when the user clicks (events flow UP)
//
// So the flow is:  click "+"  ->  onChange(value + 1)  ->  parent's setSeats runs
//                  ->  parent re-renders  ->  new `value` comes back down as a prop.
// The parent is the single source of truth, and this component just shows it.
function QuantityStepper({ value, onChange, min = 1, max = 10, label = 'Seats' }) {
  const buttonClass =
    'grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-lg font-semibold leading-none transition hover:border-ink-soft disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex items-center gap-3">
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted">{label}</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => onChange(value - 1)}
          disabled={value <= min} // can't go below the minimum
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          &minus;
        </button>

        {/* aria-live: screen readers announce the new number */}
        <output className="w-6 text-center text-sm font-bold" aria-live="polite">
          {value}
        </output>

        <button
          type="button"
          className={buttonClass}
          onClick={() => onChange(value + 1)}
          disabled={value >= max} // can't go above the maximum
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantityStepper;
