"use client";
import React from "react";
import Textinput from "@/components/ui/Textinput";
import SelectGroup from "@/components/partials/froms/ReactSelectHorizontal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation"
import * as yup from "yup";
import InputGroup from "@/components/ui/InputGroup";
const FormValidationSchema = yup
  .object({
    AgentName: yup.string().required("Agent name is required"),
    Position : yup.string().required("Position is required"),
    number: yup.number().required().positive(),
    betweenNumber: yup
      .number()
      .required("The Number between field is required")
      .positive()
      .min(1)
      .max(10),

    alphabetic: yup
      .string()
      .required()
      .matches(/^[a-zA-Z]+$/, "Must only consist of alphabetic characters"),
    length: yup.string().required("The Min Character field is required").min(3),

    password: yup.string().required().min(8),
    url: yup.string().required("The URL field is required").url(),
    message: yup.string().required("The Message field is required"),
  })
  .required();

const AgentEdit = () => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    //console.log(data);
  };

  return (
    <div className="">
      <Card title="Agent Edit">
      <form
  onSubmit={handleSubmit(onSubmit)}
  className="grid grid-cols-6 gap-4"
>
  <div className="lg:col-span-12 grid grid-cols-2 gap-5 ">
    <Textinput
      label="Agent Name"
      id="agent_name"
      type="text"
      placeholder="Agent name"
      horizontal
    />
    <Textinput
      label="Employee ID"
      id="employee_id"
      type="text"
      placeholder="Employee ID"
      horizontal
    />
    <Textinput
      label="Email ID"
      id="email_id"
      type="email"
      placeholder="Email ID"
      horizontal
    />
    <Textinput
      label="Phone Number"
      id="phone"
      type="number"
      placeholder="Phone Number"
      horizontal
    />
    <Textinput
      label="Password"
      id="agent_name"
      type="text"
      placeholder="Agent name"
      horizontal
      // register={register}
      // error={errors.AgentName}
    />
  </div>

  <div className="lg:col-span-3 grid grid-cols-1 gap-5">
    
  <SelectGroup
      label="Category"
      horizontal
      // register={register}
      // error={errors.Position}
    />
    <SelectGroup
      label="Position"
      horizontal
      // register={register}
      // error={errors.Position}
    />
  </div>

  <div className="lg:col-span-12 col-span-1">
    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
      {/* Uncomment this button for the "Back" functionality */}
      <button onClick={() => router.back()} className="btn btn-dark text-center px-4 py-2 md:px-6 md:py-3">
        Back
      </button>
      <button className="btn btn-dark text-center px-4 py-2 md:px-6 md:py-3">
        Submit
      </button>
    </div>
  </div>
</form>
</Card>
 </div>
  );
};

export default AgentEdit;
