'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { showSingleSpec, updateSpecification } from '@/lib/api';
import Textinput from '@/components/ui/Textinput';
import ReactSelect from '@/components/partials/froms/ReactSelect';
import { toast } from 'react-toastify';

const yesNoOptions = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
];

const statusOptions = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 },
];

const typeOptions = [
  { label: 'Text Field', value: 1 },
  { label: 'Dropdown', value: 2 },
  { label: 'Multi Select', value: 3 },
];

const findOption = (options, value) =>
  options.find((opt) => opt.value === value) || null;

const EditSpec = ({ groupId, specId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null); // preview URL

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      status: null,
      type: null,
      in_quick_view: null,
      in_filter: null,
      is_mandatory: null,
      icon: '',
    },
  });

  useEffect(() => {
    if (!groupId || !specId) return;

    const fetchSpecification = async () => {
      setLoading(true);
      try {
        const res = await showSingleSpec(groupId, specId);
        const spec = res?.data;
        if (res.status && spec) {
          reset({
            name: spec.name || '',
            status: findOption(statusOptions, spec.status),
            type: findOption(typeOptions, spec.type),
            in_quick_view: findOption(yesNoOptions, spec.in_quick_view),
            in_filter: findOption(yesNoOptions, spec.in_filter),
            is_mandatory: findOption(yesNoOptions, spec.is_mandatory),
            icon: spec.icon || '',
          });
          setIconPreview(spec.icon || null);
        }
      } catch (err) {
        console.error('Failed to load specification:', err);
        toast.error('Failed to fetch specification data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecification();
  }, [groupId, specId, reset]);

  // Handle file input change
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate file type and size here
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    // Preview the image locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result);
      // You can either upload file here and get a URL, or store base64 as icon temporarily
      // For demo, store base64 in form state
      setValue('icon', reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const payload = {
        name: formData.name,
        status: formData.status.value,
        type: formData.type.value,
        in_quick_view: formData.in_quick_view.value,
        in_filter: formData.in_filter.value,
        is_mandatory: formData.is_mandatory.value,
        icon: formData.icon, // base64 or URL
      };

      const response = await updateSpecification(groupId, specId, payload);

      if (response.status) {
        toast.success(response.message || 'Specification updated successfully');
        onClose();
      }
    } catch (error) {
      if (error.response?.status === 422 && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: messages[0],
          });
        });
      } else {
        console.error('Submit failed:', error);
        toast.error('An unexpected error occurred');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSelect = (name, label, options, requiredMessage) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: requiredMessage }}
      render={({ field }) => (
        <ReactSelect
          {...field}
          label={label}
          options={options}
          placeholder="Select"
          error={errors?.[name]}
        />
      )}
    />
  );

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        label="Name"
        name="name"
        placeholder="Enter specification name"
        register={register}
        validation={{ required: 'Name is required' }}
        error={errors?.name}
      />

      {renderSelect('status', 'Status', statusOptions, 'Status is required')}
      {renderSelect('type', 'Type', typeOptions, 'Type is required')}
      {renderSelect('in_quick_view', 'In Quick View', yesNoOptions, 'Required')}
      {renderSelect('in_filter', 'In Filter', yesNoOptions, 'Required')}
      {renderSelect('is_mandatory', 'Is Mandatory', yesNoOptions, 'Required')}

      {/* File Upload for Icon */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-primary-50 file:text-primary-700
                     hover:file:bg-primary-100"
        />
        {iconPreview && (
          <img
            src={iconPreview}
            alt="Icon preview"
            className="w-16 h-16 object-contain mt-2 border rounded"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitLoading}>
          {submitLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditSpec;
