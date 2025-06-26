"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { createReferralProgram } from "@/lib/api";

const CreateReferralPage = () => {
  const [statusValue, setStatusValue] = useState();
  const [typeValue, setTypeValue] = useState();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      headline: "",
      description: "",
      hiw: [""],
      eligibility: [""],
      status: 0,
      type: "",
    },
  });

  const { fields: hiwFields, append: appendHiw, remove: removeHiw } = useFieldArray({
    control,
    name: "hiw",
  });

  const {
    fields: eligibilityFields,
    append: appendEligibility,
    remove: removeEligibility,
  } = useFieldArray({
    control,
    name: "eligibility",
  });

  // Initialize with one field each
  useEffect(() => {
    if (hiwFields.length === 0) appendHiw("");
    if (eligibilityFields.length === 0) appendEligibility("");
  }, [hiwFields.length, eligibilityFields.length]);

  const handleTypeChange = useCallback((selected) => {
    setTypeValue(selected);
    setValue("type", selected?.value);
    if (selected?.value) clearErrors("type");
  }, [setValue, clearErrors]);

  const handleStatusChange = useCallback((selected) => {
    setStatusValue(selected);
    setValue("status", selected?.value);
  }, [setValue]);

  const onSubmit = async (data) => {
    if (!data.type) {
  setError("type", { type: "manual", message: "Type is required" });
  return;
}
   try{
    const response = await createReferralProgram(data)
    toast.success("Referral program created successfully")
    reset();
    setTypeValue(null);
    setStatusValue(null);
    console.log("API response:", response);
   }catch(err){
    toast.error("Failed to create referral program")
   }
  };

  return (
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
            placeholder="e.g. Invite friends and earn credits"
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

          {/* How It Works */}
          <div className="space-y-3">
            <label className="font-medium">How It Works</label>
            {hiwFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <span className="w-6">{index + 1}.</span>
                <div className="flex-1">
                  <input
                    {...register(`hiw.${index}`, {
                      required: "Step is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-1"
                    placeholder={`Step ${index + 1}`}
                  />
                  {errors.hiw?.[index] && (
                    <p className="text-danger-500 text-sm mt-1">
                      {errors.hiw[index]?.message}
                    </p>
                  )}
                </div>
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

          {/* Eligibility */}
          <div className="space-y-3">
            <label className="font-medium">Eligibility</label>
            {eligibilityFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <span className="w-6">{index + 1}.</span>
                <div className="flex-1">
                  <input
                    {...register(`eligibility.${index}`, {
                      required: "Eligibility is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-1"
                    placeholder={`Eligibility point ${index + 1}`}
                  />
                  {errors.eligibility?.[index] && (
                    <p className="text-danger-500 text-sm mt-1">
                      {errors.eligibility[index]?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    index === eligibilityFields.length - 1
                      ? appendEligibility("")
                      : eligibilityFields.length > 1 && removeEligibility(index)
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
    { label: "Place Ad", value: "place_ad" },
    { label: "Register", value: "register" },
  ]}
  value={typeValue}
  onChange={handleTypeChange}
  placeholder="Select Type"
/>

<input
  type="hidden"
  {...register("type", { required: "Type is required" })}
/>

{errors.type?.message && (
  <p className="text-danger-500 text-sm">{errors.type.message}</p>
)}


          {/* Status */}
          <ReactSelect
            options={[
              { label: "Active", value: 1 },
              { label: "Inactive", value: 0 },
            ]}
            value={statusValue}
            onChange={handleStatusChange}
            placeholder="Select Status"
          />
        </div>

        <div className="ltr:text-right rtl:text-left mt-4">
          <button className="btn btn-dark" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Card>
    </form>
  );
};

export default CreateReferralPage;
