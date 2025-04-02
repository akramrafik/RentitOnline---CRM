import React from "react";
import Select from "react-select";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
  { value: "option5", label: "Option 5" },
  { value: "option6", label: "Option 6" },
  { value: "option7", label: "Option 7" },
  { value: "option8", label: "Option 8" },
  { value: "option9", label: "Option 9" },
  { value: "option10", label: "Option 10" },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "5px",
    borderRadius: "6px",
    borderColor: state.isFocused ? "black" : "#ddd", // Black border on focus
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    outline: "none",
    "&:hover": {
      borderColor: "black", // Black border on hover
    },
  }),
  indicatorSeparator: () => ({
    display: "none", // Hides the separator
  }),
};
const ReactSelect = () => {
  return (
      <div>
        <Select
          className="react-select"
          classNamePrefix="select"
          options={options}
          styles={customStyles}
          id="hh"
        />
      </div>
  );
};

export default ReactSelect;
