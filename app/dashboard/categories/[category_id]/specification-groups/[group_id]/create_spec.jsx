'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createSpecification } from '@/lib/api';
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
  { label: 'Text', value: 1 },
  { label: 'Checkbox', value: 2 },
  { label: 'Dropdown', value: 4 },
  { label: 'Radio Button', value: 5 },
  { label: 'Web Link', value: 6 },
  { label: 'Dropdown - From Table', value: 7 },
];

const CreateSpec = ({ groupId, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      status: null,
      type: null,
      in_quick_view: null,
      in_filter: null,
      is_mandatory: null,
      icon: null,
    },
  });

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('status', data.status.value);
      formData.append('type', data.type.value);
      formData.append('in_quick_view', data.in_quick_view.value);
      formData.append('in_filter', data.in_filter.value);
      formData.append('is_mandatory', data.is_mandatory.value);
      if (data.icon?.[0]) {
        formData.append('icon', data.icon[0]);
      }

      const response = await createSpecification(groupId, formData);

      if (response.status) {
        toast.success(response.message || 'Specification created successfully');
        reset();
        onClose();
      }
    } catch (error) {
      if (error.response?.status === 422 && error.response.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: messages[0],
          });
        });
      } else {
        toast.error('An unexpected error occurred');
        console.error(error);
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

  const iconFile = watch('icon');

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

      <div>
        <label className="form-label">Icon</label>
        <input
          type="file"
          accept="image/*"
          {...register('icon')}
          onChange={(e) => {
            if (e.target.files[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]));
            } else {
              setPreview(null);
            }
          }}
          className="form-input mt-1 block w-full"
        />
        {errors?.icon && (
          <p className="text-danger-500 text-sm mt-1">{errors.icon.message}</p>
        )}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-16 h-16 object-contain mt-2 border"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitLoading}>
          {submitLoading ? 'Creating...' : 'Create Specification'}
        </button>
      </div>
    </form>
  );
};

export default CreateSpec;
