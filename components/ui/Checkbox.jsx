const Checkbox = ({
  id,
  disabled,
  label,
  value,
  name,
  onChange,
  error,
  activeClass = "ring-black-500  bg-slate-900 dark:bg-slate-700 dark:ring-slate-700 ",
}) => {
  return (
   <label
  className={`flex items-center ${
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
  }`}
  id={id}
>
  <input
    type="checkbox"
    className="hidden"
    name={name}
    checked={value}
    onChange={onChange}
    htmlFor={id}
    disabled={disabled}
  />
  <span
    className={`h-4 w-4 border flex-none rounded inline-flex ltr:mr-3 rtl:ml-3 relative transition-all duration-150
      ${
        value
          ? "bg-[#1476b4] border-[#1476b4] ring-2 ring-[#1476b4] ring-offset-2 dark:ring-offset-slate-800"
          : "bg-slate-100 border-slate-400 dark:bg-slate-600 dark:border-slate-600"
      }
    `}
  >
    {value && (
      <img
        src="/assets/images/icon/ck-white.svg"
        alt=""
        className="h-[10px] w-[10px] block m-auto"
      />
    )}
  </span>
  <span className="text-slate-500 dark:text-slate-400 text-sm leading-6 capitalize">
    {label}
  </span>
  {error && (
        <p className="text-red-500 text-xs ml-7">{error.message || error}</p>
      )}
</label>

  );
};

export default Checkbox;
