'use client'
import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import { getAllBlogs } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditPlan = ({ id, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
  title:  "",
  tag:  "",
  caption:  "",
  ad_cost: "", 
  status: "0", 
  image1:  "",
  image2:  "",
  category: "",
  permalink:  "",
  slug: "",
  description:  "",
  meta_title:  "",
  meta_description:  "",
}

  });

  const status = watch("status")

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const response = await getAllBlogs();
        const blog = response.data.find((b) => b.id === id);
        setSelectedPlan(blog);
        reset({
  title: blog.title || "", 
  tag: blog.tag || "",
  caption: blog.post_details || "",
  ad_cost: blog.ad_cost || "",
  status: String(blog.status ?? "0"),
  image1: blog.image1 || "",
  image2: blog.image2 || "",
  category: String(blog.category?.id ?? ""),
  permalink: blog.permalink || "",
  slug: String(blog.slug ?? ""),
  description: blog.description || "",
  meta_title: blog.meta_title || "",
  meta_description: blog.meta_description || "",
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
  title: formData.title,
  tag: formData.tag,
  post_details: formData.caption,
  ad_cost: formData.ad_cost,
  status: formData.status,
  image1: formData.image1,
  image2: formData.image2,
  category_id: formData.category, // assuming backend expects just the ID
  permalink: formData.permalink,
  slug: formData.slug,
  description: formData.description,
  meta_title: formData.meta_title,
  meta_description: formData.meta_description,
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

  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput label="Blog Title" name="title" register={register} />
      <Textinput label="Blog Permalink" name="permalink" register={register} />
      <Textinput label="Post Details" name="post_details" register={register} />
      <Textinput label="Category" name="=" register={register} />
      <Textinput label="Tag" name="tag" register={register} />
      <Textinput label="Meta Title" name="meta_title" register={register} />
      <Textinput label="Meta Description" name="meta_description" register={register} />

      {/* <ReactSelect
        label="Status"
        placeholder="Status"
        value={statusOptions.find((opt) => opt.value === status) || null}
        options={statusOptions}
        onChange={(selected) => setValue("status", selected.value)}
      /> */}

      <button type="submit" className="btn btn-primary bg-primary-500">
        Save Plan
      </button>
    </form>
  );
};

EditPlan.displayName = "EditPlan";
export default EditPlan;
