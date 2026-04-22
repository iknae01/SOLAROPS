interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function FilterDropdown({ label, value, onChange, options }: FilterDropdownProps) {
  return (
    <div>
      <label className="block text-sm text-[var(--solar-text-muted)] mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
