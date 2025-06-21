import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getCustomersById, updateCustomer } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { message } from "@/constant/data";

const EditCustomer = ({ id, onSuccess }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
 const [submitting, setSubmitting] = useState(false);


  const { register, handleSubmit, reset, setValue, watch,formState: { errors }, setError, } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      status: "0",
      register_date: ""
    },
  });

  const status = watch("status")

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const response = await getCustomersById(id);
        const CustomerData = response.data;
        setSelectedCustomer(CustomerData);
        console.log(CustomerData)
        const {
  first_name,
  last_name,
  mobile,
  email,
  status,
  register_date,
} = CustomerData;

reset({
  first_name: first_name || "",
  last_name: last_name || "",
  mobile: mobile || "",
  email: email || "",
  status: String(status ?? "0"),
  register_date: register_date
    ? format(new Date(register_date), "yyyy-MM-dd HH:mm")
    : "",
});
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
     await updateCustomer({ customer_id: id, formData });
      toast.success("Customer updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
     if(
        error?.response.data?.error && typeof error.response.data.error === "object"
     ){
       const serverErrors = error.response.data.errors;
       Object.entries(serverErrors).forEach(([field,messages]) => {
         setError(field, { type: "server", message: messages[0] });
       });
     }else{
        toast.error("Update failed");
     }
    }finally{
        setSubmitting(false);
    }
  };
  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  if (loading || !selectedCustomer) {
    return <div>Loading plan data...</div>;
  }

 return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput 
      label="First Name" 
      name="first_name" 
      register={register} 
        validation={{ required: "First name is required" }}
        error={errors.first_name}
      />
      <Textinput 
      label="Last Name" 
      name="last_name" 
      register={register} 
         validation={{ required: "Last name is required" }}
        error={errors.last_name}
      />
      <Textinput
        label="Mobile"
        name="mobile"
        register={register}
        type="tel"
        inputMode="numeric"
        validation={{
          required: "Mobile number is required",
          pattern: {
            value: /^[0-9]{9}$/,
            message: "Mobile must be exactly 9 digits",
          },
        }}
        error={errors.mobile}
      />
      <Textinput
      label="Email"
      name="email"
      register={register} 
        type="email"
        validation={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
          },
        }}
        error={errors.email}
      />
      <Textinput
        label="Register Date"
        name="register_date"
        register={register}
        readOnly
      />

      <ReactSelect
        label="Status"
        placeholder="Select status"
        value={statusOptions.find((opt) => opt.value === status) || null}
        options={statusOptions}
        onChange={(selected) => setValue("status", selected.value)}
      />

      <button type="submit" className="btn btn-primary bg-primary-500" disabled={submitting}>
  {submitting ? "Saving..." : "Save Customer"}
</button>
    </form>
  );
};

export default EditCustomer;
