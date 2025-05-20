'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
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
import Switch from '@/components/ui/Switch';
import { createCategory, getCategories } from '@/lib/api';

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
  pluginsEnabled: ['align', 'charCounter', 'link', 'image', 'lists']
};

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [cateActive, setCateActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState();

  const [formData, setFormData] = useState({
    image: '',
    parent_category: '',
    order_number: '',
    status: '',
    name: '',
    description: '',
    type: '',
    visible_in_home: 0,
    company_only: 0,
    rera_required: 0,
    dynamic_pricing: 0,
    seo_url: '',
    seo_title: '',
    seo_keywords: '',
    seo_description: '',
    footer_description: '',
    footer_title: '',
    schema_code: '',
    payment_gateway: 0
  });

  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: prev[name] === 1 ? 0 : 1 }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption.value }));
  };

  const handleParentChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, parent_category: selectedOption ? selectedOption.value : '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await getCategories({ type: 'parent' });
        if (response.status === true && Array.isArray(response.data)) {
          const transformed = response.data
            .map((item) => ({
              ...item,
              status: item.status ? 1 : 0,
              parent: item.parent ? item.parent.name : null
            }))
            .filter((item) => item.parent === null && item.status === 1);

          setCategories(transformed);
        }
      } catch (err) {
        console.error('Error fetching parent categories', err);
      }
    };

    fetchParentCategories();
  }, []);

  const onSubmit = async () => {
    setStatus('Submitting...');
    try {
      await createCategory(formData);
      setStatus('Category created successfully');
      setFormData({
        image: '', parent_category: '', order_number: '', status: '', name: '', description: '', type: '',
        visible_in_home: 0, company_only: 0, rera_required: 0, dynamic_pricing: 0,
        seo_url: '', seo_title: '', seo_keywords: '', seo_description: '',
        footer_description: '', footer_title: '', schema_code: '', payment_gateway: 0
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          setError(field, { type: 'server', message: messages[0] });
        });
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid xl:grid-cols-1 grid-cols-1 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 -mx-6 px-6 pb-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300">Create Category</h2>
            <Button type="submit" text="Save" className="btn-dark" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 my-8 gap-5 mr-24">
            <div className="flex justify-between items-center col-span-1 md:col-span-2">
              <h4 className="text-base text-slate-800 dark:text-slate-300">Category information</h4>
              <Switch
                label="Active"
                value={cateActive}
                onChange={() => setCateActive(!cateActive)}
                activeText="Active"
                inactiveText="Inactive"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Textinput
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              register={register}
              validation={{ required: 'Category name is required' }}
              error={errors.name}
              label="Category name"
              type="text"
              horizontal
            />

            <div className="flex items-center gap-4">
              <label className="form-label capitalize w-[100px]">Select Type</label>
              <div className="w-full max-w-[350px]">
                <SelectOrSkeleton
                validation={{required: 'Type is required'}}
                error={errors.type}
                  name="type"
                  onChange={handleSelectChange}
                  options={[
                    { value: '1', label: 'Property' },
                    { value: '2', label: 'No Property' },
                    { value: '3', label: 'Residential' },
                    { value: '4', label: 'Commercial' },
                    { value: '5', label: 'Rooms/Bedspace' }
                  ]}
                  value={{ value: formData.type, label: formData.type }}
                  placeholder="Type"
                />
              </div>
            </div>

            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              validation={{required: 'The description field is required'}}
              register={register}
              error={errors.description}
              label="Description"
              rows="1"
              horizontal
              className="w-full max-w-[350px]"
            />

            <div className="flex items-center gap-4">
              <label className="form-label capitalize w-[100px]">Select Parent Category</label>
              <div className="w-full max-w-[350px]">
                <SelectOrSkeleton
                  name="parent_category"
                  error={errors.parent_category}
                  validation={{required: 'Categiory required'}}
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  value={categories.find(opt => opt.value === formData.parent_category)}
                  onChange={handleParentChange}
                  placeholder="Main Category"
                />
              </div>
            </div>

            <Textinput
              name="order_number"
              value={formData.order_number}
              onChange={handleInputChange}
              register={register}
              error={errors.order_number}
              label="Order Number"
              type="number"
              horizontal
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-6 ml-32 gap-32">
            <Checkbox label="Show in home page" name="visible_in_home" register={register} error={errors.visible_in_home} value={formData.visible_in_home === 1} onChange={() => handleCheckboxChange('visible_in_home')} />
            <Checkbox label="Company account required for posting ads" name="company_only" register={register} error={errors.company_only} value={formData.company_only === 1} onChange={() => handleCheckboxChange('company_only')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-6 ml-32 gap-32">
            <Checkbox label="Rera fields" name="rera_required" register={register} error={errors.rera_required} value={formData.rera_required === 1} onChange={() => handleCheckboxChange('rera_required')} />
            <Checkbox label="Dynamic Pricing" name="dynamic_pricing" register={register} error={errors.dynamic_pricing} value={formData.dynamic_pricing === 1} onChange={() => handleCheckboxChange('dynamic_pricing')} />
          </div>

          <h4 className="text-base text-slate-800 dark:text-slate-300 my-8">SEO information</h4>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Textinput name="seo_title" value={formData.seo_title} onChange={handleInputChange} register={register} label="SEO Title" type="text" horizontal />
            <Textinput name="seo_url" value={formData.seo_url} onChange={handleInputChange} register={register} label="SEO Url" type="text" horizontal />
            <Textinput name="seo_keywords" value={formData.seo_keywords} onChange={handleInputChange} register={register} label="SEO Keywords" type="text" horizontal />
            <Textinput name="seo_description" value={formData.seo_description} onChange={handleInputChange} register={register} label="SEO Description" type="text" horizontal />
          </div>

          <Textarea name="schema_code" value={formData.schema_code} onChange={handleInputChange} register={register} label="Schema Code" rows="1" horizontal className="w-full max-w-[350px]" />

          <h4 className="text-slate-800 dark:text-slate-300 my-8 text-base">Footer information</h4>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Textinput name="footer_title" value={formData.footer_title} onChange={handleInputChange} register={register} label="Frontend Footer Title" type="text" horizontal />

            <div className="xl:col-span-2 ml-32">
              <FroalaEditorComponent
                name="footer_description"
                model={formData.footer_description}
                onModelChange={(value) => setFormData((prev) => ({ ...prev, footer_description: value }))}
                config={editorConfig}
                tag="textarea"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-6 ml-32 gap-32">
            <Checkbox label="Enable Payment Gateway" name="payment_gateway" value={formData.payment_gateway === 1} onChange={() => handleCheckboxChange('payment_gateway')} register={register} />
          </div>

          <Fileinput name="image" label="Category Image" onChange={handleFileChange} selectedFile={formData.image} setSelectedFile={(file) => setFormData((prev) => ({ ...prev, image: file }))} />
        </Card>
      </div>
    </form>
  );
};

export default CreateCategory;
