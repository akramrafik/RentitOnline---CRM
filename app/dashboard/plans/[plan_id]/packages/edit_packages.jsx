import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getPlanPackages } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditPackage = ({ id, onSuccess }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      price: "",
      featured_days: "",
      duration: "",
      ad_count: "",
      refreshment_count: "",
      vat_percentage: "",
      status: "0",
    },
  });

  const status = watch("status");

  useEffect(() => {
    if (!id) return;
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await getPlanPackages(id);
        const targetedPackage = response.data.find((p) => p.id === id);
        console.log(targetedPackage)
        setSelectedPackage(targetedPackage);
        console.log(selectedPlan);
        reset({
          price: plan.price || "",
          featured_days: plan.featured_days || "",
          duration: plan.duration || "",
          ad_count: plan.ad_count || "",
          refreshment_count: plan.refreshment_count || "",
          vat_percentage: plan.vat_percentage || "",
          status: String(plan.status),
        });
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [id, reset]);

//   const onSubmit = async (formData) => {
//     try {
//       const data = {
//         price: formData.price,
//         featured_days: formData.featured_days,
//         duration: formData.duration,
//         ad_count: formData.ad_count,
//         refreshment_count: formData.refreshment_count,
//         vat_percentage: formData.vat_percentage,
//         status: formData.status,
//       };
//       await updatePlan(id, data);
//       toast.success("Plan updated successfully");
//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error("Failed to update plan:", error);
//       toast.error("Update failed");
//     }
//   };

  if (loading || !selectedPlan) {
    return <div>Loading plan data...</div>;
  }

  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  return (
    // onSubmit={handleSubmit(onSubmit)}
    <form  className="space-y-4"> 
    <ReactSelect
        label="Status"
        placeholder="Status"
        value={statusOptions.find((opt) => opt.value === status) || null}
        options={statusOptions}
        onChange={(selected) => setValue("status", selected.value)}
      />
      <Textinput label="Price" name="price" register={register} />
      <Textinput label="Featured Days" name="featured_days" register={register} />
      <Textinput label="Duration" name="duration" register={register} />
      <Textinput label="Ad Count" name="ad_count" register={register} />
      <Textinput label="Refreshment Count" name="refreshment_count" register={register} />
      <Textinput label="Vat Percentage" name="vat_percentage" register={register} />

      <button type="submit" className="btn btn-primary bg-primary-500">
        Save Plan
      </button>
    </form>
  );
};

EditPackage.displayName = "Edit Package";
export default EditPackage;
