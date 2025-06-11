import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const Spinner = () => (
  <ArrowPathIcon
    className="w-5 h-5 text-gray-500 animate-spin"
    aria-hidden="true"
  />
);

export default Spinner;
