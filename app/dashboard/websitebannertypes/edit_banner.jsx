import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getAllBannerTypes } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditBanner = ({ id, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      status: "0",
      view_mode: "",
      columns: "", 
      position: "",
      
    },
  });

  const status = watch("status"); // watch current status value to sync ReactSelect

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const response = await getAllBannerTypes();
        const banner = response.data.find((b) => b.id === id);
        setSelectedPlan(banner);
        reset({
          name: banner.name || "",
          status: String(banner.status),
          view_mode: banner.view_mode || "",
          columns: banner.columns || "",
          position: banner.position || "",
         
        });
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    try {
      const data = {
        name: formData.name,
        columns: formData.columns,
        view_mode: formData.view_mode,
        position: formData.position,
        status: formData.status,
      };
      await updatePlan(id, data);
      toast.success("Plan updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to update plan:", error);
      toast.error("Update failed");
    }
  };

  if (loading || !selectedPlan) {
    return <div>Loading Banner data...</div>;
  }

  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput label="Title" name="name" register={register} />
      <Textinput label="Columns" name="columns" register={register} />
      <Textinput label="View Mode" name="view_mode" register={register} />
      <Textinput label="Position" name="position" register={register} />

      <ReactSelect
        label="Status"
        placeholder="Status"
        value={statusOptions.find((opt) => opt.value === status) || null}
        options={statusOptions}
        onChange={(selected) => setValue("status", selected.value)}
      />

      <button type="submit" className="btn btn-primary bg-primary-500">
        Save Plan
      </button>
    </form>
  );
};

EditBanner.displayName = "EditPlan";
export default EditBanner;
