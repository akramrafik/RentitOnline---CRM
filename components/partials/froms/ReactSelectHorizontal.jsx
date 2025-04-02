import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Select from "react-select"; // Import react-select
//import "react-select/dist/react-select.css"; 

const SelectGroup = ({
  label,
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  msgTooltip,
  description,
  hasicon,
  onChange,
  merged,
  options,
  onFocus,
  placeholder,
  prepend,
  append,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div
      className={` ${horizontal ? "flex" : ""} ${merged ? "merged" : ""} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel} ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
          }`}
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-stretch inputGroup 
        ${append ? "has-append" : ""}
        ${prepend ? "has-prepend" : ""}
        ${error ? "is-invalid" : ""}  ${validate ? "is-valid" : ""}
        ${horizontal ? "flex-1" : ""}`}
      >
        {/* prepend */}
        {prepend && (
          <span className="flex-none input-group-addon">
            <div className="input-group-text h-full prepend-slot">{prepend}</div>
          </span>
        )}

        <div className="flex-1">
          <div
            className={`relative fromGroup2
            ${error ? "has-error" : ""} 
            ${validate ? "is-valid" : ""}`}
          >
            {/* React Select */}
            <Select
             // {...register(name)}
              {...rest}
              id={id}
              value={options ? options.find(option => option.value === value) : null} 
              options={options}
              onChange={(selectedOption) => {
                onChange(selectedOption);
              }}
              className={`${
                error ? " has-error" : " "
              }  block w-full focus:outline-none ${className}`}
              placeholder={placeholder}
              isDisabled={disabled}
              isReadOnly={readonly}
              onFocus={onFocus}
            />

            {/* Icon */}
            <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
              {hasicon && (
                <span
                  className="cursor-pointer text-secondary-500"
                  onClick={handleOpen}
                >
                  {open && (
                    <Icon icon="heroicons-outline:eye" />
                  )}
                  {!open && (
                    <Icon icon="heroicons-outline:eye-off" />
                  )}
                </span>
              )}

              {error && (
                <span className="text-danger-500">
                  <Icon icon="heroicons-outline:information-circle" />
                </span>
              )}
              {validate && (
                <span className="text-success-500">
                  <Icon icon="bi:check-lg" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* append */}
        {append && (
          <span className="flex-none input-group-addon right">
            <div className="input-group-text h-full append-slot">{append}</div>
          </span>
        )}
      </div>

      {/* error and success message */}
      {error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? "inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
              : "text-danger-500 block text-sm"
          }`}
        >
          {error.message}
        </div>
      )}

      {/* validated and success message */}
      {validate && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? "inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded"
              : "text-success-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}

      {/* only description */}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

export default SelectGroup;
