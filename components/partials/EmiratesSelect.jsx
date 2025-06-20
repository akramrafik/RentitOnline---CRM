'use client';

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { reportByEmirte } from "@/lib/api";

const EmirateSelectDropdown = ({
  name = "emirate",
  error,
  onChange,
  defaultValue,
}) => {
  const [emirates, setEmirates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmirates = async () => {
      try {
        const response = await reportByEmirte();
        setEmirates(response?.data?.emirates || []);
      } catch (err) {
        console.error("Failed to fetch emirates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmirates();
  }, []);

  const options = emirates.map((e) => ({
    value: e.slug,
    label: e.name,
    id: e.id,
  }));
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


  return (
    <div className="formGroup">
      {loading ? (
        <div className="text-gray-400 text-sm">Loading emirates...</div>
      ) : (
        <Select
        styles={customStyles}
          name={name}
          options={options}
          defaultValue={options.find((opt) => opt.value === defaultValue)}
          onChange={(selected) => {
            if (selected) onChange?.(selected); // pass full object
          }}
          classNamePrefix="react-select"
          placeholder="Choose Emirate"
          isClearable
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default EmirateSelectDropdown;
