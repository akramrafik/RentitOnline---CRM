'use client';
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Textarea from '@/components/ui/Textarea';
import Fileinput from '@/components/ui/Fileinput';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { createCategory, getCategories } from '@/lib/api';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactSelect = dynamic(() => import('@/components/partials/froms/ReactSelect'), { ssr: false });
const FroalaEditorComponent = dynamic(() => import('react-froala-wysiwyg'), { ssr: false });

const SelectOrSkeleton = ({ loading, ...props }) =>
  loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const editorConfig = {
  placeholderText: 'Frontend Footer Description',
  charCounterCount: true,
  toolbarButtons: [
    'bold', 'italic', 'underline', 'strikeThrough',
    'formatOL', 'formatUL', 'insertLink', 'insertImage'
  ],
  pluginsEnabled: ['align', 'charCounter', 'link', 'image', 'lists'],
  branding: false
};

const TYPE_OPTIONS = [
  { value: '1', label: 'Property' },
  { value: '2', label: 'No Property' },
  { value: '3', label: 'Residential' },
  { value: '4', label: 'Commercial' },
  { value: '5', label: 'Rooms/Bedspace' }
];

const CheckboxField = ({ name, label, control, error }) => (
  <Controller
    name={name}
    control={control}
    rules={{ required: `${label} is required` }}
    render={({ field }) => (
      <div className="flex flex-col">
        <Checkbox
          {...field}
          checked={field.value}
          onChange={e => field.onChange(e.target.checked)}
          label={label}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
      </div>
    )}
  />
);

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      parent_category: '',
      description: '',
      order_number: '',
      visible_in_home: false,
      company_only: false,
      rera_required: false,
      dynamic_pricing: false,
      seo_url: '',
      seo_title: '',
      seo_keywords: '',
      seo_description: '',
      footer_title: '',
      schema_code: '',
      footer_description: '',
      payment_gateway: false,
      status: 0,
    }
  });

  useEffect(() => {
    async function fetchParentCategories() {
      try {
        const response = await getCategories({ type: 'parent' });
        if (response.status && Array.isArray(response.data)) {
          const filtered = response.data.filter(cat => !cat.parent && cat.status);
          setCategories(filtered.map(cat => ({ value: cat.id, label: cat.name })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchParentCategories();
  }, []);

  // Memoize categories options to avoid re-renders
  const categoryOptions = useMemo(() => categories, [categories]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
        }
      });

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await createCategory(formData);

      toast.success('Category created successfully');
      reset();
      setSelectedFile(null);
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors;
        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: messages[0],
          });
        });
        toast.error('Please fix the errors in the form');
      } else {
        console.error(error);
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" noValidate>
        <Card>
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 -mx-6 px-6 pb-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300">Create Category</h2>
            <Button
              type="submit"
              text={isSubmitting ? "Submitting..." : "Save"}
              className="btn-dark"
              disabled={isSubmitting}
            />
          </div>

          <div className='grid grid-cols-2 mb-4'>
            <Fileinput
              name="image"
              label="Category Image"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
              }}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              className="mt-6"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Textinput
              name="name"
              label="Category Name *"
              register={register}
              validation={{ required: 'Category name is required' }}
              error={errors.name}
            />

            <div className="flex flex-col">
              <label className="form-label capitalize mb-2">Type *</label>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field, fieldState }) => (
                  <ReactSelect
                    {...field}
                    options={TYPE_OPTIONS}
                    onChange={option => field.onChange(option?.value)}
                    value={TYPE_OPTIONS.find(opt => opt.value === field.value) || null}
                    placeholder="Select Type"
                    error={fieldState.error}
                  />
                )}
              />
              {/* {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>} */}
            </div>

            <div className="flex flex-col">
              <label className="form-label capitalize mb-2">Parent Category *</label>
              <Controller
                name="parent_category"
                control={control}
                rules={{ required: 'Parent category is required' }}
                render={({ field, fieldState }) => (
                  <ReactSelect
                    loading={loadingCategories}
                    {...field}
                    options={categoryOptions}
                    onChange={(option) => field.onChange(option?.value)}
                    value={categoryOptions.find(opt => opt.value === field.value) || null}
                    placeholder="Select Parent Category"
                    error={fieldState.error}
                  />
                )}
              />
              {/* {errors.parent_category && <p className="text-red-600 text-sm mt-1">{errors.parent_category.message}</p>} */}
            </div>
          </div>

          {/* Row 2: Description & Order Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Textarea
              name="description"
              label="Description *"
              placeholder=""
              register={register}
              validation={{ required: 'Description is required' }}
              error={errors.description}
              rows={3}
              className="md:col-span-2"
            />
            <Textinput
              name="order_number"
              label="Order Number"
              type="number"
              register={register}
              validation={{
                required: 'Order number is required',
                min: { value: 1, message: 'Order number must be at least 1' }
              }}
              error={errors.order_number}
            />
          </div>

          {/* Checkboxes */}
          <div className="w-full mt-6">
            <div className="flex flex-wrap gap-x-10 gap-y-4 w-full mb-7">
              <CheckboxField
                name="visible_in_home"
                label="Show in home page"
                control={control}
                error={errors.visible_in_home}
              />
              <CheckboxField
                name="company_only"
                label="Company account required for posting ads"
                control={control}
                error={errors.company_only}
              />
              <CheckboxField
                name="rera_required"
                label="Rera fields"
                control={control}
                error={errors.rera_required}
              />
              <CheckboxField
                name="dynamic_pricing"
                label="Dynamic Pricing"
                control={control}
                error={errors.dynamic_pricing}
              />
            </div>
          </div>

          {/* SEO and Other Fields */}
          <div className="mb-7">
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-2">
              SEO Details
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Textinput
                name="seo_title"
                label="SEO Title"
                placeholder=''
                register={register}
                error={errors.seo_title}
                validation={{ required: 'SEO title required' }}
              />
              <Textinput
                name="seo_url"
                label="SEO URL"
                placeholder=''
                register={register}
                error={errors.seo_url}
                validation={{ required: 'SEO URL required' }}
              />
              <Textinput
                name="seo_keywords"
                label="SEO Keywords"
                placeholder=''
                register={register}
                error={errors.seo_keywords}
                validation={{ required: 'SEO keywords required' }}
              />
              <Textinput
                name="seo_description"
                label="SEO Description"
                placeholder=''
                register={register}
                error={errors.seo_description}
                validation={{ required: 'SEO description required' }}
              />
              <Textinput
                name="footer_title"
                label="Frontend Footer Title"
                placeholder=''
                register={register}
                error={errors.footer_title}
                validation={{ required: 'Frontend Footer Title required' }}
              />
              <Textarea
                name="schema_code"
                label="Schema Code"
                register={register}
                rows={3}
                className="mt-1"
                error={errors.schema_code}
                validation={{ required: 'Schema Code required' }}
              />
            </div>
          </div>

          <div className="mb-4 mt-6">
            <label className="form-label">Footer Description</label>

            <Controller
              name="footer_description"
              control={control}
              rules={{
                required: "Footer Description is required",
                minLength: {
                  value: 10,
                  message: "Footer Description must be at least 10 characters",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <FroalaEditorComponent
                    model={field.value}
                    onModelChange={field.onChange}
                    config={editorConfig}
                    tag="textarea"
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <Controller
            name="payment_gateway"
            control={control}
            rules={{ required: 'The payment gateway field is required' }}
            render={({ field }) => (
              <>
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label="Enable Payment Gateway"
                  className="mt-6"
                />
                {errors.payment_gateway && (
                  <p className="text-red-600 text-sm mt-1">{errors.payment_gateway.message}</p>
                )}
              </>
            )}
          />
        </Card>
      </form>

      {/* Toast Container to show toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default CreateCategory;
