import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getPlan, updatePlan } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditPlan = ({ id, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      tag: "",
      caption: "",
      ad_cost: "",
      status: "0",
    },
  });

  const status = watch("status"); // watch current status value to sync ReactSelect

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const response = await getPlan();
        const plan = response.data.find((p) => p.id === id);
        setSelectedPlan(plan);
        reset({
          title: plan.name || "",
          tag: plan.tag || "",
          caption: plan.caption || "",
          ad_cost: plan.ad_cost || "",
          status: String(plan.status),
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
        name: formData.title,
        tag: formData.tag,
        caption: formData.caption,
        ad_cost: formData.ad_cost,
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
    return <div>Loading plan data...</div>;
  }

  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput label="Title" name="title" register={register} />
      <Textinput label="Tag" name="tag" register={register} />
      <Textinput label="Caption" name="caption" register={register} />
      <Textinput label="Price Per Ad" name="ad_cost" register={register} />

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

EditPlan.displayName = "EditPlan";
export default EditPlan;
