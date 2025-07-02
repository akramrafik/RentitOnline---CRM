'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createSpecificationValue } from '@/lib/api';
import Textinput from '@/components/ui/Textinput';

const CreateSpecValue = ({ specId, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      value: '',
      description: '',
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const form = new FormData();
      form.append('value', formData.value);
      form.append('description', formData.description || '');
      if (iconFile) {
        form.append('icon', iconFile);
      }

      const response = await createSpecificationValue(specId, form);

      if (response.status) {
        toast.success(response.message || 'Specification value created successfully');
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
        {errors?.icon && (
          <p className="text-sm text-red-500 mt-1">{errors.icon.message}</p>
        )}
        {iconPreview && (
          <img
            src={iconPreview}
            alt="Icon preview"
            className="w-16 h-16 object-contain mt-2 border rounded"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
          disabled={submitLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitLoading}>
          {submitLoading ? 'Saving...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CreateSpecValue;
