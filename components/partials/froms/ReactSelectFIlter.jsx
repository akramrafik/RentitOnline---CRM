import React from "react";
import Select from "react-select";

// Custom styles
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    minHeight: '2.25rem',
    borderRadius: '0.3rem',
    borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
    '&:hover': {
      borderColor: '#333',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 0.75rem',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
  ...base,
  color: '#1e293b',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
}),
  menu: (base) => ({
    ...base,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#e0f2fe'
      : 'white',
    color: state.isSelected ? 'white' : '#0f172a',
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
  }),
};

// Custom component to remove the separator
const customComponents = {
  IndicatorSeparator: () => null,
};

const ReactSelectFilter = ({
  options,
  value,
  validation,
  onChange,
  placeholder,
  isMulti = false,
  error,
  ...props
}) => {
  return (
    <div>
      <Select
        {...props}
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        className={`${error ? " has-error" : ""} react-select`}
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder={placeholder || "Select an option"}
        components={customComponents} // 👈 Add this line
      />
      {error && (
        <div className="text-danger-500 text-sm mt-1">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default ReactSelectFilter;
