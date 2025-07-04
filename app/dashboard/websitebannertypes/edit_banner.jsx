import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getBannerId, updateBannerType } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditBanner = ({ banner_type_id, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); 

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      status: "0",
      view_mode: "",
      columns: "", 
      position: "",
    },
  });

  // Watch fields for controlled selects
  const status = watch("status");
  const view_mode = watch("view_mode");

  // Options for selects
  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  const viewModeOptions = [
    { label: "Vertical", value: "1" },
    { label: "Horizontal", value: "2" },
  ];

  // Fetch banner data on mount or banner_type_id change
useEffect(() => {
  if (!banner_type_id) return;

  const mapViewModeStringToValue = (mode) => {
    if (!mode) return "";
    if (mode.toLowerCase() === "horizontal") return "2";
    if (mode.toLowerCase() === "vertical") return "1";
    return "";
  };

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await getBannerId(banner_type_id);
      const banner = response.data;

      setSelectedPlan(banner);
      reset({
        name: banner.name || "",
        status: String(banner.status),
        view_mode: mapViewModeStringToValue(banner.view_mode),
        columns: banner.columns || "",
        position: banner.position || "",
      });
    } catch (error) {
      console.error("Error fetching banner type:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPlan();
}, [banner_type_id, reset]);


  // Submit handler
  const onSubmit = async (formData) => {
     setSubmitting(true);
     console.log("Form data submitted:", formData); 
    try {
      const data = {
        name: formData.name,
        columns: formData.columns,
        view_mode: formData.view_mode,
        position: formData.position,
        status: formData.status,
      };

      await updateBannerType(banner_type_id, data);
      toast.success("Banner updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;

        // Set backend validation errors to react-hook-form
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages.join(" "),
          });
        });
      } else {
        toast.error("Update failed");
        console.error("Failed to update banner:", error);
      }
    }finally{
        setSubmitting(false);
      }
  };

  if (loading || !selectedPlan) {
    return <div>Loading Banner data...</div>;
  }

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
        value={viewModeOptions.find((opt) => opt.value === view_mode) || null}
        options={viewModeOptions}
        onChange={(selected) => setValue("view_mode", selected?.value ?? "")}
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

      <button type="submit" className="btn btn-primary bg-primary-500" disabled={submitting}>
       {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

EditBanner.displayName = "EditBanner";

export default EditBanner;
