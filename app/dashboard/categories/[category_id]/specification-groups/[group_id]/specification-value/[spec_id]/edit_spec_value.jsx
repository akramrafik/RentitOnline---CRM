'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { showSingleSpecificationValue, updateSpecificationValue } from '@/lib/api';
import Textinput from '@/components/ui/Textinput';

const EditSpecValue = ({ specId, valueId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      value: '',
      description: '',
      icon: '',
    },
  });

  useEffect(() => {
  if (!specId || !valueId) return;

  const fetchValue = async () => {
    setLoading(true);
    try {
      const res = await showSingleSpecificationValue(specId, valueId);
      console.log("response :", res);

      const val = res.data; // correct

      if (val) {
        reset({
          value: val.value || '',
          description: val.description || '',
          icon: val.icon || '',
        });
        setIconPreview(val.icon || null);
      }
    } catch (err) {
      console.error('Failed to load value:', err);
      toast.error('Failed to fetch value data.');
    } finally {
      setLoading(false);
    }
  };

  fetchValue();
}, [specId, valueId, reset]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result);
      setValue('icon', reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const payload = {
        value: formData.value,
        description: formData.description,
        icon: formData.icon,
      };

      const response = await updateSpecificationValue(specId,valueId, payload);

      if (response.status) {
        toast.success(response.message || 'Specification value updated successfully');
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

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        label="Value"
        name="value"
        placeholder="Enter value"
        register={register}
        validation={{ required: 'Value is required' }}
        error={errors?.value}
      />

      <Textinput
        label="Description"
        name="description"
        placeholder="Optional description"
        register={register}
        error={errors?.description}
      />

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

export default EditSpecValue;
