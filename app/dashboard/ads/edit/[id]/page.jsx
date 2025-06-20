'use client';
import React, { useEffect, useState, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textinput from '@/components/ui/Textinput';
import LocationAutoCompleteSelect from '@/components/partials/LocationSearch';
import EmirateSelectDropdown from '@/components/partials/EmiratesSelect';
import TextEditor from '@/components/partials/TextEditor';
import Select from '@/components/ui/Select';
import DropZone from '@/components/partials/froms/DropZone';
import { getAdById, editAd } from '@/lib/api';
import { MdClose } from 'react-icons/md';
import { Controller } from 'react-hook-form';

const BATHROOM_TYPES = [
  { label: 'Shared', value: 'shared' },
  { label: 'Private', value: 'private' },
];

const ROOM_TYPES = [
  { label: 'Studio', value: 'studio' },
  { label: '1BHK', value: '1bhk' },
];

const TENANT_TYPES = [
  { label: 'Family', value: 'family' },
  { label: 'Bachelors', value: 'bachelors' },
];

const FURNISHING_OPTIONS = [
  { label: 'Furnished', value: 'furnished' },
  { label: 'Unfurnished', value: 'unfurnished' },
];

const PRICE_DURATIONS = [
  { label: 'Per Hour', value: 'Hour' },
  { label: 'Per Day', value: 'Day' },
  { label: 'Per Week', value: 'Week' },
  { label: 'Per Month', value: 'Month' },
  { label: 'Per Year', value: 'Year' },
];

const CheckboxGrid = ({ options, name, register }) => (
  <div className="grid grid-cols-4 gap-4">
    {options.map((label, index) => (
      <label key={index} className="flex items-center gap-2">
        <input type="checkbox" value={label} {...register(name)} />
        {label}
      </label>
    ))}
  </div>
);

const EditAd = () => {
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [emirateId, setEmirateId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [emiratesList, setEmiratesList] = useState([]);


  const nationalityOptions = useMemo(() => [
    'Indian', 'Pakistani', 'Filipino', 'Nepali', 'Bangladeshi', 'Sri Lankan',
    'Arab', 'African', 'Western', 'Chinese', 'Other'
  ], []);

  const amenitiesOptions = useMemo(() => [
    'WiFi', 'Parking', 'AC', 'Laundry', 'Gym', 'Swimming Pool',
    'Cleaning', 'Furnished', 'Balcony', 'Elevator', 'Security', 'CCTV'
  ], []);

  const {
    control,register, handleSubmit, setValue, watch, reset,
    formState: { errors }
  } = useForm();

  const [description, setDescription] = useState('');

  useEffect(() => {
    setValue('description', description);
  }, [description, setValue]);

  useEffect(() => {
    if (selectedLocation?.name) {
      setValue('address', selectedLocation.city);
    } else {
      setValue('address', '');
    }
  }, [selectedLocation, setValue]);

  useEffect(() => {
  if (!id) return;
  const fetchAdDetails = async () => {
    try {
      const response = await getAdById({ ad_id: id });
      const ad = response?.data?.data;
      if (!ad) return;

      const fixedPrice = ad?.pricing?.fixed_price || '';
      const [priceAmount, priceDuration] = fixedPrice.split('/') || [];

      setDescription(ad.description || '');
      setExistingImages(ad.images || []);
      setUploadedFiles([]);

      const fullAddress = ad.location?.full_address || '';
      const extractedEmirate = fullAddress.split(' - ').pop()?.trim() || '';

      const emirateObj = {
  value: extractedEmirate.toLowerCase().replace(/\s+/g, '-'),
  label: extractedEmirate,
  id: null,
};


      // Set state for dropdowns
      setEmirateId(extractedEmirate);
      if (ad.location?.location) {
        setSelectedLocation({
          name: ad.location.location,
          city: ad.location.location,
        });
      }

      reset({
        emirate: emirateObj,
        name: ad.title || '',
         address: ad.location?.full_address || '',           
  full_address: ad.location?.location || '',          
  emirate: extractedEmirate || '',                    
        phone: ad.contact?.phone || '',
        whatsapp: ad.contact?.whatsapp || '',
        price: priceAmount || '',
        priceDuration: priceDuration || '',
        bathroomType: ad.bathroomType || '',
        roomType: ad.roomType || '',
        tenantType: ad.tenantType || '',
        furnishing: ad.furnishing || '',
        propertySize: ad.propertySize || '',
        noticePeriod: ad.noticePeriod || '',
        tenantsCount: ad.tenantsCount || '',
        preferredNationality: ad.preferredNationality || [],
        amenities: ad.amenities || [],
        images: ad.images || [],
        description: ad.description || '',
      });
      console.log('🚀 Resetting form with emirate:', extractedEmirate);
    } catch (error) {
      console.error('Error fetching ad details:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchAdDetails();
}, [id, reset]);

useEffect(() => {
  if (!id) return;

  const fetchEditAds = async () => {
    try {
      const response = await editAd({ ad_id: id }); 
      const editData = response?.data;
      const emirates = editData?.emirates || [];
      console.log(' Edit Ad data:', editData);
    } catch (error) {
      console.error('Error fetching edit ad:', error);
    }
  };

  fetchEditAds();
}, [id]);

  useEffect(() => {
    setValue('images', [...existingImages, ...uploadedFiles]);
  }, [existingImages, uploadedFiles, setValue]);

  const removeImage = (index, isExisting) => {
    const source = isExisting ? existingImages : uploadedFiles;
    const updated = [...source];
    updated.splice(index, 1);
    isExisting ? setExistingImages(updated) : setUploadedFiles(updated);
  };

  const onSubmit = (data) => {
    const fixed_price = `${data.price}/${data.priceDuration}`;
    const finalData = {
      ...data,
      pricing: { fixed_price },
      images: data.images || [],
    };
    console.log('Submit data:', finalData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mb-6 border-b px-6 pb-4">
          <h2 className="text-2xl font-semibold">Edit Ad</h2>
          <Button type="submit" text="Save" className="btn-dark" />
        </div>

        <Textinput name="name" label="Title" type="text" register={register} required />
        <label className="form-label mb-1 block mt-5">Description</label>
        <TextEditor name="description" value={description} onChange={setDescription} />

        <div className="flex gap-4 mb-4 mt-5">
          <div className="w-[30%]">
          <label className="form-label mb-1 block">Emirate</label>
            <Controller
  name="emirate"
  control={control}
  rules={{ required: 'Emirate is required' }}
  render={({ field, fieldState }) => (
    <EmirateSelectDropdown
      {...field}
      value={field.value} // pass whole object
      error={fieldState.error}
      onChange={(selected) => {
        field.onChange(selected);
        setEmirateId(selected?.id || '');
        setSelectedLocation(null);
        setValue('address', '');
      }}
    />
  )}
/>


          </div>
          <div className="w-[35%]">
          <label className="form-label mb-1 block">Select Location</label>
            <LocationAutoCompleteSelect
              emirateId={emirateId}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              name="address"
            />
          </div>
          <div className="w-[35%]">
            <Textinput name="full_address" label="Full Address" type="text" readonly={true} register={register} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <Textinput name="phone" label="Phone" type="text" register={register} />
          <Textinput name="whatsapp" label="WhatsApp" type="text" register={register} />
          <Textinput name="price" label="Price" type="number" register={register} />
          <Select name="priceDuration" label="Price Duration" register={register} options={PRICE_DURATIONS} />
        </div>

        <div className="text-lg font-semibold mb-2 mt-6">Property Info</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Select name="bathroomType" label="Bathroom Type" register={register} options={BATHROOM_TYPES} />
          <Select name="roomType" label="Room Type" register={register} options={ROOM_TYPES} />
          <Select name="tenantType" label="Tenant Type" register={register} options={TENANT_TYPES} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Select name="furnishing" label="Furnishing" register={register} options={FURNISHING_OPTIONS} />
          <Textinput name="propertySize" label="Property Size (sqft)" type="text" register={register} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Textinput name="noticePeriod" label="Minimum Notice Period (Months)" type="number" register={register} />
          <Textinput name="tenantsCount" label="Number of Tenants" type="number" register={register} />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Preferred Nationality</h3>
          <CheckboxGrid options={nationalityOptions} name="preferredNationality" register={register} />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Amenities</h3>
          <CheckboxGrid options={amenitiesOptions} name="amenities" register={register} />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
          <DropZone uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

          {existingImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Current Images</h4>
              <div className="grid grid-cols-10 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img.direct_url} alt={img.file_name} className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">New Uploaded Images</h4>
              <div className="grid grid-cols-10 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img src={file.preview} alt={file.name || `upload-${index}`} className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default EditAd;
