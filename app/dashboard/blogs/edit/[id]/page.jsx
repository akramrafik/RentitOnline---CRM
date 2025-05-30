'use client';
import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { getBlogById, updateBlog } from "@/lib/api"; 
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';

const EditBlog = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params?.id;

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      tag: "",
      post_details: "",
      ad_cost: "",
      status: "0",
      image1: "",
      image2: "",
      category: "",
      permalink: "",
      slug: "",
      description: "",
      meta_title: "",
      meta_description: "",
    },
  });

  const status = watch("status");

  useEffect(() => {
    if (!id) return;

    const fetchBlogById = async () => {
      setLoading(true);
      try {
        const response = await getBlogById({ blog_id: id });
        const blog = response.data.data;
        console.log("blog selected", blog.title);
        reset({
          title: blog.title || "",
          tag: blog.tag || "",
          post_details: blog.post_details || blog.caption || "", 
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
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogById();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    try {
      const data = {
        title: formData.title,
        tag: formData.tag,
        post_details: formData.post_details, 
        ad_cost: formData.ad_cost,
        status: formData.status,
        image1: formData.image1,
        image2: formData.image2,
        category_id: formData.category,
        permalink: formData.permalink,
        slug: formData.slug,
        description: formData.description,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
      };

      await updateBlog(id, data); // * CHANGED: call updateBlog API function with id and data
      toast.success("Blog updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to update blog:", error);
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <div>Loading blog data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    
    <div className="grid xl:grid-cols-1 grid-cols-1 gap-5">
    <Card>
    <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 -mx-6 px-6 pb-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300">Edit Blog</h2>
            <Button type="submit" text="Save" className="btn-dark" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 my-8 gap-5 mr-24">
                      <div className="flex justify-between items-center col-span-1 md:col-span-2">
                        <h4 className="text-base text-slate-800 dark:text-slate-300">Blog information</h4>
                        <Switch
  checked={status === "1"}
  onChange={(value) => setValue("status", value ? "1" : "0")}
  className={`${status === "1" ? "bg-green-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
>
  <span
    className={`${status === "1" ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
  />
</Switch>
                      </div>
                    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Textinput label="Blog Title" name="title" register={register} />
  <Textinput label="Permalink" name="permalink" register={register} />
  <Textarea name="post_details"  register={register} label="Post Details" rows="1" horizontal className="w-full max-w-[350px]" />
  {/* <Textinput label="Post Details" name="post_details" register={register} /> */}
  <Textinput label="Category" name="category" register={register} />
  <Textinput label="Tag" name="tag" register={register} />
  <Textinput label="Image 1 URL" name="image1" register={register} />
  <Textinput label="Image 2 URL" name="image2" register={register} />
  <Textinput label="Meta Title" name="slug" register={register} />
  <Textinput label="Description" name="description" register={register} />
  <Textinput label="Meta Title" name="meta_title" register={register} />
  <Textinput label="Meta Description" name="meta_description" register={register} />
  </div>
  {/* For status, better to use select or radio buttons */}
  <label className="block font-medium text-gray-700">Status</label>
  <select {...register("status")} className="input input-bordered w-full max-w-xs">
    <option value="0">Inactive</option>
    <option value="1">Active</option>
  </select>
  </Card>
  </div>
</form>

  );
};

export default EditBlog;