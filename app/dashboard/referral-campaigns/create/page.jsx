"use client";

import React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import ReactSelect from "@/components/partials/froms/ReactSelect";

const CreateReferralPage = () => {
    const [statusValue, setStatusValue] = React.useState();
const [typeValue, setTypeValue] = React.useState();
  const methods = useForm({
    defaultValues: {
      name: "",
      headline: "",
      description: "",
      hiw: [""], 
      eligibility: [""],
      status: 0,
      type: ""
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields: hiwFields, append: appendHiw, remove: removeHiw } = useFieldArray({
    control,
    name: "hiw",
  });
  React.useEffect(() => {
  if (hiwFields.length === 0) {
    appendHiw("");
  }
}, []);

  const {
    fields: eligibilityFields,
    append: appendEligibility,
    remove: removeEligibility,
  } = useFieldArray({
    control,
    name: "eligibility",
  });

  React.useEffect(() => {
  if (eligibilityFields.length === 0) {
    appendEligibility("");
  }
}, []);
 const onSubmit = async (data) => {
  if (data.status === undefined || data.status === "") {
    toast.error("Status is required");
    return;
  }
  if (!data.type) {
    toast.error("Type is required");
    return;
  }
  console.log("Submitted:", data);
  toast.success("Referral program created (mock)");
};


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Create Referral Program">
          <div className="space-y-5">
            <Textinput
              label="Name*"
              type="text"
              placeholder="Type Referral Name"
              name="name"
              register={register}
              validation={{ required: "Name is required" }}
              error={errors.name}
            />

            <Textinput
              label="Headline"
              type="text"
              placeholder="Type Referral Headline"
              name="headline"
              register={register}
               validation={{
    required: "Headline is required",
    minLength: { value: 3, message: "Headline must be at least 3 characters" },
  }}
  error={errors.headline}
            />

            <Textarea
              label="Description"
              placeholder="Type here"
              name="description"
             register={register}
  validation={{
    required: "Description is required",
    minLength: { value: 10, message: "Description must be at least 10 characters" },
  }}
  error={errors.description}
            />

            {/* HOW IT WORKS section */}
            <div className="space-y-3">
              <label className="font-medium">How It Works</label>

             {hiwFields.map((field, index) => (
  <div key={field.id} className="flex items-center gap-3">
    <span className="w-6">{index + 1}.</span>
    <input
      {...register(`hiw.${index}`, {
        required: "Step is required",
        minLength: { value: 3, message: "Minimum 3 characters" },
      })}
      className="flex-1 border border-gray-300 rounded px-3 py-1"
      placeholder={`Step ${index + 1}`}
    />
    {errors.hiw && errors.hiw[index] && (
      <p className="text-danger-500 text-sm">{errors.hiw[index].message}</p>
    )}
    <button
      type="button"
      onClick={() =>
        index === hiwFields.length - 1
          ? appendHiw("")
          : hiwFields.length > 1 && removeHiw(index)
      }
      className="w-8 h-8 flex items-center justify-center border rounded bg-gray-100 hover:bg-gray-200"
    >
      {index === hiwFields.length - 1 ? "+" : "-"}
    </button>
  </div>
))}


            </div>

            {/* ELIGIBILITY section */}
            <div className="space-y-3">
              <label className="font-medium">Eligibility</label>

            {eligibilityFields.map((field, index) => (
  <div key={field.id} className="flex items-center gap-3">
    <span className="w-6">{index + 1}.</span>
    <input
      {...register(`eligibility.${index}`)}
      className="flex-1 border border-gray-300 rounded px-3 py-1"
      placeholder={`Eligibility point ${index + 1}`}
    />
    <button
      type="button"
      onClick={() =>
        index === eligibilityFields.length - 1
          ? appendEligibility("")
          : eligibilityFields.length > 1 && removeEligibility(index) // ✅ prevent removing last
      }
      className="w-8 h-8 flex items-center justify-center border rounded bg-gray-100 hover:bg-gray-200"
    >
      {index === eligibilityFields.length - 1 ? "+" : "-"}
    </button>
  </div>
))}

            </div>
            <ReactSelect
  options={[
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ]}
  value={statusValue}
  onChange={(selected) => {
    setStatusValue(selected);
    methods.setValue("status", selected.value);
  }}
  placeholder="Select Status"
/>

<ReactSelect
  options={[
    { label: "Place Ad", value: "place_ad" },
    { label: "Register", value: "register" },
  ]}
  value={typeValue}
  onChange={(selected) => {
    setTypeValue(selected);
    methods.setValue("type", selected.value);
  }}
  placeholder="Select Type"
/>

          </div>

          <div className="ltr:text-right rtl:text-left mt-4">
            <button className="btn btn-dark text-center">Submit</button>
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

export default CreateReferralPage;
