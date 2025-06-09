import React, { useState } from "react";
import { toast } from "react-toastify";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { updateAdStatus } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "0", label: "Under Review", color: "orange" },
  { value: "1", label: "Live", color: "green" },
  { value: "2", label: "Draft", color: "gray" },
  { value: "3", label: "Payment Pending", color: "amber" },
  { value: "4", label: "Rejected", color: "red" },
  { value: "5", label: "DLD Failed", color: "pink" },
  { value: "6", label: "Expired", color: "slate" },
];

const TAILWIND_COLORS = {
  orange: "#f97316",
  green: "#22c55e",
  gray: "#9ca3af",
  amber: "#f59e0b",
  red: "#ef4444",
  pink: "#ec4899",
  slate: "#64748b",
};

const StatusCell = ({ adId, statusLabel, onStatusChange }) => {
  const selectedOption =
    STATUS_OPTIONS.find((opt) => opt.label === statusLabel) || STATUS_OPTIONS[0];
  const [currentOption, setCurrentOption] = useState(selectedOption);

  // Custom styles that reflect the selected status color
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "30px",
      height: "30px",
      width: "120px",
      fontSize: "14px",
      padding: "0 4px",
      borderColor: TAILWIND_COLORS[currentOption.color],
      boxShadow: state.isFocused
        ? `0 0 0 1px ${TAILWIND_COLORS[currentOption.color]}`
        : "none",
      "&:hover": {
        borderColor: TAILWIND_COLORS[currentOption.color],
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: "0 4px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 4px",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "6px 10px",
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? TAILWIND_COLORS[currentOption.color]
        : state.isFocused
        ? "#f9fafb"
        : "#fff",
      color: state.isSelected ? "#fff" : "#111827",
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const handleStatusChange = async (selected) => {
    try {
      await updateAdStatus(adId, selected.value);
      setCurrentOption(selected);
      toast.success(`Ad ${adId} status updated to ${selected.label}`);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <ReactSelect
      options={STATUS_OPTIONS}
      value={currentOption}
      onChange={handleStatusChange}
      isSearchable={false}
      styles={customStyles}
      classNamePrefix="react-select"
      getOptionLabel={(e) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: TAILWIND_COLORS[e.color] }}
          />
          <span className="text-sm font-medium">{e.label}</span>
        </div>
      )}
      formatOptionLabel={(e) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: TAILWIND_COLORS[e.color] }}
          />
          <span className="text-sm font-medium">{e.label}</span>
        </div>
      )}
    />
  );
};

export default StatusCell;
