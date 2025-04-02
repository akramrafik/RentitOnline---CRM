"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import OptionsSelect from "@/components/partials/froms/Options";

const options = [
  {
    value: "option1",
    label: "Option 1",
  },
  {
    value: "option2",
    label: "Option 2",
  },
  {
    value: "option3",
    label: "Option 3",
  },
];
const SelectPage = () => {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleChange2 = (e) => {
    setValue2(e.target.value);
  };

  return (
    <div className=" space-y-5">
      <Card title="React Select">
        <ReactSelect />
      </Card>
      <Card title="React Select">
        <OptionsSelect />
      </Card>
    </div>
  );
};

export default SelectPage;
