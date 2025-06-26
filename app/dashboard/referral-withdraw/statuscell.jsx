import React, { useState } from "react";
import { toast } from "react-toastify";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { changeWithdrawStatus } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "0", label: "Pending", color: "orange" },
  { value: "1", label: "Completed", color: "green" },
  { value: "2", label: "Rejected", color: "red" },
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

const StatusCell = ({ referral_id, statusLabel, onStatusChange }) => {
  const selectedOption =
    STATUS_OPTIONS.find((opt) => opt.label === statusLabel) || STATUS_OPTIONS[0];
  const [currentOption, setCurrentOption] = useState(selectedOption);

  // Custom styles that reflect the selected status color
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "30px",
      height: "30px",
      minWidth: "120px",
      fontSize: "13px",
      padding: "0 4px",
      width: "auto",
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

  const handleReferralStatus = async (selected) => {
  let res;
  try {
    res = await changeWithdrawStatus(referral_id, selected.value);
  } catch (err) {
    console.error("Request failed:", err);
    toast.error("An unexpected error occurred");
    return;
  }

  if (res?.status === true) {
    setCurrentOption(selected);
    toast.success(`Referral Id ${referral_id} status updated to ${selected.label}`);
    try {
      if (onStatusChange) onStatusChange(); // if this throws, catch below
    } catch (err) {
      console.error("onStatusChange failed:", err);
    }
  } else {
    toast.error(res?.message || "Failed to update status");
  }
};



  return (
   <ReactSelect
  options={STATUS_OPTIONS}
  value={currentOption}
  onChange={handleReferralStatus}
  isSearchable={false}
  styles={{
    ...customStyles,
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // make sure it floats above everything
    }),
  }}
  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
  classNamePrefix="react-select min-w-[120px]"
  getOptionLabel={(e) => (
    <div className="flex items-center gap-2">
      <span
        className={`w-5 h-2 rounded-full`}
        style={{ backgroundColor: TAILWIND_COLORS[e.color] }}
      />
      <span className="text-sm font-medium min-[120px]:">{e.label}</span>
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
