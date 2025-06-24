import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    //padding: "1px",
    //borderRadius: "6px",
    borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
    boxShadow: state.isFocused ? "#e2e8f0" : "#e2e8f0",
    outline: "000",
    "&:hover": {
      borderColor: "#596678",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  singleValue: (provided) => ({
    ...provided,
    outline: "none",
  }),
  container: (provided) => ({
    ...provided,
    outline: "none",
  }),
};

const ReactSelect = ({
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
      options={options}        // Passing the options dynamically
      validation={validation}
      value={value}            // Setting the value of the selected option
      onChange={onChange}      // Handling the change event
      isMulti={isMulti}        // Supporting multiple selection if needed
       className={`${
              error ? " has-error" : " "
            } react-select `}
      classNamePrefix="select"
      styles={customStyles}
      placeholder={placeholder || "Select an option"}  // Default placeholder text
    />
    {error && (
        <div className="text-danger-500 text-sm mt-1">
          {error.message}
        </div>
      )}
      </div>
  );
};

export default ReactSelect;

