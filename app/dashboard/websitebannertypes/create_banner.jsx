import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { createBannerType } from "@/lib/api"; 
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateBanner = ({ onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      status: "0",
      view_mode: "",
      columns: "",
      position: "",
    },
  });

  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  const viewModeOptions = [
  { label: "Vertical", value: 1 },
  { label: "Horizontal", value: 2 },
];

  const status = watch("status");
  const view_mode = watch("view_mode");

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const data = {
        name: formData.name,
        columns: formData.columns,
        view_mode: formData.view_mode,
        position: formData.position,
        status: formData.status,
      };

      await createBannerType(data); 
      toast.success("Banner created successfully");
      reset(); 
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages.join(" "),
          });
        });
      } else {
        toast.error("Creation failed");
        console.error("Failed to create banner:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        label="Title"
        name="name"
        register={register}
        error={errors?.name}
      />

      <Textinput
        label="Columns"
        name="columns"
        register={register}
        error={errors?.columns}
      />

      <ReactSelect
  label="View Mode"
  placeholder="Select View Mode"
  options={viewModeOptions}
  value={viewModeOptions.find(opt => opt.value === view_mode) || null}
  onChange={(selected) => setValue("view_mode", selected ? Number(selected.value) : null)}
  error={errors?.view_mode}
/>


      <Textinput
        label="Position"
        name="position"
        register={register}
        error={errors?.position}
      />

      <ReactSelect
        label="Status"
        placeholder="Select Status"
        value={statusOptions.find((opt) => opt.value === status) || null}
        options={statusOptions}
        onChange={(selected) => setValue("status", selected?.value ?? "")}
        error={errors?.status}
      />

      <button
        type="submit"
        className="btn btn-primary bg-primary-500"
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Create"}
      </button>
    </form>
  );
};

CreateBanner.displayName = "CreateBanner";

export default CreateBanner;
