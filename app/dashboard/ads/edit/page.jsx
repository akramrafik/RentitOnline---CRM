'use client';
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import LocationAutoCompleteSelect from "@/components/partials/LocationSearch";
import EmirateSelectDropdown from "@/components/partials/EmiratesSelect";
import TextEditor from "@/components/partials/TextEditor";
import Select from "@/components/ui/Select"; // Assuming you're using a custom Select component
import DropZone from "@/components/partials/froms/DropZone";

const EditAd = () => {
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState('');
  const [selectedEmirate, setSelectedEmirate] = useState('');

  const { register, handleSubmit, setValue, watch  } = useForm();

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      description,
      images: data.images || [], // from DropZone
    video: data.video || null, // if you have video too
    };
    console.log('form data', finalData);
  };

  const handleEmirateChange = (selected) => {
    const emirateId = selected?.id || '';
    setSelectedEmirate(emirateId);
    setValue("emirate", emirateId);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 -mx-6 px-6 pb-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300">Edit Ad</h2>
          <Button type="submit" text="Save" className="btn-dark" />
        </div>

        {/* Name (Full Width) */}
        <div className="mb-4">
          <Textinput
            name="name"
            label="Title"
            type="text"
            register={register}
          />
        </div>

        {/* Description (Full Width) */}
        <div className="mb-4">
          <TextEditor value={description} onChange={setDescription} />
        </div>

        {/* Emirates, Location, Full Address */}
        <div className="flex gap-4 mb-4">
          <div className="w-[30%]">
            <EmirateSelectDropdown
              register={register}
              name="emirate"
              validation={{ required: "Emirate is required" }}
              onChange={handleEmirateChange}
            />
          </div>
          <div className="w-[35%]">
            <label className="form-label mb-1 block">Select Location</label>
            <LocationAutoCompleteSelect />
          </div>
          <div className="w-[35%]">
            <Textinput
              name="address"
              label="Full Address"
              type="text"
              register={register}
            />
          </div>
        </div>

        {/* Phone, WhatsApp, Price, Per Month */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Textinput name="phone" label="Phone" type="text" register={register} />
          <Textinput name="whatsapp" label="WhatsApp" type="text" register={register} />
          <Textinput name="price" label="Price" type="number" register={register} />
          <Textinput name="perMonth" label="Per Month" type="text" register={register} />
        </div>

        {/* Property Info Label */}
        <div className="text-lg font-semibold mb-2 mt-6">Property Info</div>

        {/* Bathroom Type, Room Type, Tenant Type */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Select name="bathroomType" label="Bathroom Type" register={register} options={[{ label: "Shared", value: "shared" }, { label: "Private", value: "private" }]} />
          <Select name="roomType" label="Room Type" register={register} options={[{ label: "Studio", value: "studio" }, { label: "1BHK", value: "1bhk" }]} />
          <Select name="tenantType" label="Tenant Type" register={register} options={[{ label: "Family", value: "family" }, { label: "Bachelors", value: "bachelors" }]} />
        </div>

        {/* Furnishing, Property Size */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Select name="furnishing" label="Furnishing" register={register} options={[{ label: "Furnished", value: "furnished" }, { label: "Unfurnished", value: "unfurnished" }]} />
          <Textinput name="propertySize" label="Property Size (sqft)" type="text" register={register} />
        </div>

        {/* Minimum Notice Period, Number of Tenants */}
        <div className="grid grid-cols-2 gap-4">
          <Textinput name="noticePeriod" label="Minimum Notice Period (Months)" type="number" register={register} />
          <Textinput name="tenantsCount" label="Number of Tenants" type="number" register={register} />
        </div>
        {/* Preferred Nationality */}
<div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Preferred Nationality</h3>
  <div className="grid grid-cols-4 gap-4">
    {["Indian", "Pakistani", "Filipino", "Nepali", "Bangladeshi", "Sri Lankan", "Arab", "African", "Western", "Chinese", "Other"].map((label, index) => (
      <label key={index} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={label}
          {...register("preferredNationality")}
        />
        {label}
      </label>
    ))}
  </div>
</div>

{/* Amenities */}
<div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
  <div className="grid grid-cols-4 gap-4">
    {["WiFi", "Parking", "AC", "Laundry", "Gym", "Swimming Pool", "Cleaning", "Furnished", "Balcony", "Elevator", "Security", "CCTV"].map((label, index) => (
      <label key={index} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={label}
          {...register("amenities")}
        />
        {label}
      </label>
    ))}
  </div>
</div>
{/* File Upload (Images) */}
<div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
  <DropZone
    onFilesChange={(files) => setValue("images", files)}
  />
  {/* <div className="mt-2 grid grid-cols-4 gap-4">
    {(watch("images") || []).map((file, i) => (
      <div key={i} className="text-sm truncate">
       {file.name}
      </div>
    ))}
  </div> */}
</div>

{/* Video Upload */}
<div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
  <input
    type="file"
    accept="video/*"
    onChange={(e) => setValue("video", e.target.files?.[0])}
  />
  <div className="mt-2">
    {watch("video") && (
      <div className="text-sm truncate">
        🎬 {watch("video").name}
      </div>
    )}
  </div>
</div>

      </form>
    </Card>
  );
};

export default EditAd;
