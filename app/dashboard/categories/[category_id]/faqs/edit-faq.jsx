'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import ReactSelect from '@/components/partials/froms/ReactSelect';
import { updateFaqById, getFaqsById } from '@/lib/api';
import { toast } from 'react-toastify';

const statusOptions = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 },
];

// Helper to find option object by value
const findStatusOption = (value) =>
  statusOptions.find((opt) => opt.value === value) || null;

const EditFaq = ({ data, categoryId, onClose }) => {
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
      question: '',
      answer: '',
      status: null,
    },
  });

  useEffect(() => {
    if (!data) return;

    reset({
      question: data.question || '',
      answer: data.answer || '',
      status: findStatusOption(data.status),
    });
    setLoading(false);
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        status: formData.status.value,
      };

      const res = await updateFaqById(categoryId, data.id, payload);
console.log("res:",res )
      if (res?.status === true) {
        
  toast.success(res.message || 'FAQ updated successfully');
  setTimeout(() => {
    onClose();
    reset();
  }, 300);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        label="Question"
        name="question"
        placeholder="Enter question"
        register={register}
        validation={{ required: 'Question is required' }}
        error={errors?.question}
      />

      <Textarea
        label="Answer"
        name="answer"
        placeholder="Enter answer"
        rows={6}
        register={register}
        validation={{ required: 'Answer is required' }}
        error={errors?.answer}
      />

      <Controller
  name="status"
  control={control}
  rules={{ required: 'Status is required' }}
  render={({ field }) => (
    <ReactSelect
      {...field}
      label="Status"
      options={statusOptions}
      placeholder="Select status"
      value={field.value}
      onChange={(selected) => field.onChange(selected)}
      error={errors?.status}
    />
  )}
/>


      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
          disabled={submitLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitLoading}
        >
          {submitLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditFaq;