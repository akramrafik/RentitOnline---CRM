'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { showSpecificationGroup, updateSpecificationGroup } from '@/lib/api';
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

// Helper to find option by value
const findOption = (options, value) => options.find((opt) => opt.value === value) || null;
const EditSpecGroup = ({ data, categoryId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      status: null,
      list_style: null,
      tabular_display: null,
      from_table: null,
      order_number: '',
    },
  });

  useEffect(() => {
    if (!data) return;

    const fetchGroup = async () => {
      setLoading(true);
      try {
        const res = await showSpecificationGroup(categoryId, data.id);
        const spec = res?.data;
        if (res.status && spec) {
          reset({
            name: spec.name || '',
            status: findOption(statusOptions, spec.status),
            list_style: findOption(yesNoOptions, spec.list_style),
            tabular_display: findOption(yesNoOptions, spec.tabular_display),
            from_table: findOption(yesNoOptions, spec.from_table),
            order_number: spec.order_number || '',
          });
        }
      } catch (err) {
        console.error('Failed to load specification group:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [categoryId, data, reset]);

  const onSubmit = async (formData) => {
  setSubmitLoading(true);
  try {
    const payload = {
      name: formData.name,
      status: formData.status.value,
      list_style: formData.list_style.value,
      tabular_display: formData.tabular_display.value,
      from_table: formData.from_table.value,
      order_number: formData.order_number !== '' ? Number(formData.order_number) : null,
    };

    const response = await updateSpecificationGroup(categoryId, data.id, payload);

    // ✅ Use dynamic success message from response
    if (response.status) {
      toast.success(response.message || 'Specification Group updated successfully');
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
    return (
      <div className="flex items-center justify-center h-40">
        Loading...
      </div>
    );
  }

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        label="Name"
        name="name"
        placeholder="Enter group name"
        register={register}
        validation={{ required: 'Name is required' }}
        error={errors?.name}
      />

      {renderSelect('status', 'Status', statusOptions, 'Status is required')}
      {renderSelect('list_style', 'List Style', yesNoOptions, 'List Style is required')}
      {renderSelect('tabular_display', 'Tabular Display', yesNoOptions, 'Tabular Display is required')}
      {renderSelect('from_table', 'From Table', yesNoOptions, 'From Table is required')}

      <Textinput
        label="Order Number"
        name="order_number"
        placeholder="Enter order number"
        register={register}
        validation={{}}
        error={errors?.order_number}
      />

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

export default EditSpecGroup;
