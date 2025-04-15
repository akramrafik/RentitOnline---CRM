import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "3px",
    borderRadius: "6px",
    borderColor: state.isFocused ? "black" : "#ddd",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    outline: "none", 
    "&:hover": {
      borderColor: "black",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  // Add a focus state to remove outline if present in some browsers
  singleValue: (provided) => ({
    ...provided,
    outline: "none", 
  }),
  // Customizing the focus state itself
  container: (provided) => ({
    ...provided,
    outline: "none",  // Ensure no outline on container
  }),
};


const ReactSelect = (props) => {
  return (
    <div>
      <Select
        {...props} 
        className="react-select"
        classNamePrefix="select"
        styles={customStyles}
      />
    </div>
  );
};

export default ReactSelect;
