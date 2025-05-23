import React, { useEffect, useState, } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getPlan, updatePlan } from "@/lib/api";
import { toast } from "react-toastify";

const EditPlan = ({ id, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    caption: "",
    ad_cost: "",
    status: "0",
  });

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const response = await getPlan();
        const plan = response.data.find((p) => p.id === id);
        setSelectedPlan(plan);
        setFormData({
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
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption.value,
    }));
  };

  const submit = async () => {
    try {
      const data = {
        name: formData.title,
        tag: formData.tag,
        caption: formData.caption,
        ad_cost: formData.ad_cost,
        status: formData.status,
      };
      console.log(data);
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-4"
    >
      <Textinput
        label="Title"
        // name="title"
        value={formData.title}
        onChange={handleChange}
      />
      <Textinput
        label="Tag"
        // name="tag"
        value={formData.tag}
        onChange={handleChange}
      />
      <Textinput
        label="Caption"
        // name="caption"
        value={formData.caption}
        onChange={handleChange}
      />
      <Textinput
        label="Price Per Ad"
        // name="ad_cost"
        value={formData.ad_cost}
        onChange={handleChange}
      />
      <ReactSelect
        label="Status"
        placeholder="Status"
        value={{
          label: formData.status === "1" ? "Active" : "Inactive",
          value: formData.status,
        }}
        options={statusOptions}
        onChange={handleSelectChange}
      />
      
      <button type="submit" className="btn btn-primary">
        Save Plan
      </button>
    </form>
  );
};

EditPlan.displayName = "EditPlan";
export default EditPlan;
