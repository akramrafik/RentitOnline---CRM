import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const CompareFilter = ({
  filters,
  onChange,
  loading,
  categoryOptions = [],
  emirateOptions = [],
  locationOptions = [],
  onLocationInputChange,
  locationInput,
  setLocationInput,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
      {/* Category */}
      {loading ? <Skeleton height={38} /> : (
        <select
          className="w-full p-2 border rounded"
          value={filters.category || ""}
          onChange={(e) => onChange("category", e.target.value || null)}
        >
          <option value="">Select Category</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Emirate */}
      {loading ? <Skeleton height={38} /> : (
        <select
          className="w-full p-2 border rounded"
          value={filters.emirate || ""}
          onChange={(e) => onChange("emirate", e.target.value || null)}
        >
          <option value="">Select Emirate</option>
          {emirateOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Location */}
      {loading ? <Skeleton height={38} /> : (
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Choose location"
            value={locationInput}
            onChange={(e) => {
              const val = e.target.value;
              setLocationInput(val);
              onLocationInputChange(val);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            disabled={!filters.emirate}
          />
          {showSuggestions && locationOptions.length > 0 && (
            <div className="absolute z-10 bg-white border w-full mt-1 max-h-60 overflow-y-auto shadow">
              {locationOptions.map((loc) => (
                <div
                  key={loc.value}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    onChange("location", loc.value);
                    setLocationInput(loc.label);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="text-sm text-gray-500">{loc.city || "-"}</div>
                  <div className="font-medium">{loc.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompareFilter;
