import type { PatientView } from "../types";

interface ViewToggleProps {
  value: PatientView;
  onChange: (value: PatientView) => void;
}

export const ViewToggle = ({ value, onChange }: ViewToggleProps): JSX.Element => (
  <div
    className="view-toggle"
    role="tablist"
    aria-label="Patient view switcher"
  >
    {(["grid", "list"] as const).map((option) => (
      <button
        key={option}
        type="button"
        role="tab"
        aria-selected={value === option}
        className={value === option ? "toggle-pill active" : "toggle-pill"}
        onClick={() => onChange(option)}
      >
        {option === "grid" ? "Grid view" : "List view"}
      </button>
    ))}
  </div>
);
