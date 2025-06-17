import React, { useState } from "react";
import ReactSelect from "react-select";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { mapPlan } from "@/lib/api"; // Make sure this path is correct
import { toast } from "react-toastify";

const PlanMappingForm = ({ adId, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [duration, setDuration] = useState("");

  const handleSave = async () => {
    if (!selectedPlan || !duration) {
      toast.error("Please select plan and duration.");
      return;
    }

    try {
      await mapPlan({
        ad_id: adId,
        plan_id: selectedPlan.value,
        duration: duration,
      });
      toast.success("Plan mapped successfully.");
      onClose(); // Close the modal
    } catch (error) {
      toast.error("Failed to map plan.");
    }
  };

  const plan_options = [
    { value: "1", label: "Basic" },
    { value: "7", label: "Standard" },
    { value: "13", label: "Premium" },
  ];

  return (
    <div className="grid gap-3">
      <ReactSelect
        options={plan_options}
        placeholder="Choose Plan"
        value={selectedPlan}
        onChange={setSelectedPlan}
      />
      <Textinput
        type="number"
        placeholder="Duration in Number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default PlanMappingForm;
