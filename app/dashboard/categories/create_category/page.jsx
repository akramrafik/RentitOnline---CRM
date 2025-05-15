'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import ReactSelect from '@/components/partials/froms/ReactSelect';
import Switch from '@/components/ui/Switch';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import Fileinput from "@/components/ui/Fileinput";
import { useForm } from 'react-hook-form';

const FroalaEditorComponent = dynamic(() => import('react-froala-wysiwyg'), {
  ssr: false,
});

const editorConfig = {
  placeholderText: 'Frontend Footer Description',
  charCounterCount: true,
  toolbarButtons: [
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'formatOL',
    'formatUL',
    'insertLink',
    'insertImage',
  ],
  pluginsEnabled: ['align', 'charCounter', 'link', 'image', 'lists'],
};

const CreateCategory = () => {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(true); 
  const [checked4, setChecked4] = useState(true); 
  const [checked5, setChecked5] = useState(false);
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoUrl, setSeoUrl] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [footerTitle, setFooterTitle] = useState('');
  const [schemaCode, setSchemaCode] = useState('');
  const [cateActive, setCateActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    category_name: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm();

  // api call
  const createCategory = async () => {
    e.preventDefault();
  }

  console.log('Form Data:', formData);

  return (
    <form onSubmit={createCategory}>
    <div className="grid xl:grid-cols-1 grid-cols-1 gap-5">
      <Card>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 -mx-6 px-6 pb-4">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300">Create Category</h2>
          <Button type='submit' text="Save" className="btn-dark" />
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
          name={"category_name"}
          value={formData.category_name}
          onChange={handleInputChange}
          register={register}
            label="Category name"
            type="text"
            horizontal
          />

          <div className="flex items-center gap-4">
            <label className="form-label capitalize w-[60px] md:w-[100px] break-words">
              Select Type
            </label>
            <div className="w-full max-w-[350px]">
              <ReactSelect placeholder="Type" />
            </div>
          </div>

          <Textarea
            label="Description"
            type="text"
            placeholder=""
            rows="1"
            horizontal
            className="w-full max-w-[350px]"
          />

          <div className="flex items-center gap-4">
            <label className="form-label capitalize w-[60px] md:w-[100px] break-words">
              Select Parent Category
            </label>
            <div className="w-full max-w-[350px]">
              <ReactSelect placeholder="Main Category" />
            </div>
          </div>
          <Textinput
            label="Order Number"
            type="Number"
            horizontal
            placeholder=""
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 ml-32 gap-32">
          <Checkbox
            label="Show in home page"
            value={checked}
            onChange={() => setChecked(!checked)}
          />
          <Checkbox
            label="Company account required for posting ads"
            value={checked2}
            onChange={() => setChecked2(!checked2)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 ml-32 gap-32">
         <Checkbox
            label="Rera fields"
            value={checked3}
            onChange={() => setChecked3(!checked3)}
          />
          <Checkbox
            label="Dynamic Pricing"
            value={checked4}
            onChange={() => setChecked4(!checked4)}
          />
          </div>

        <h4 className="text-base text-slate-800 dark:text-slate-300 my-8">SEO information</h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Textinput
            label="SEO Title"
            type="text"
            horizontal
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder=""
          />
          <Textinput
            label="SEO Url"
            type="text"
            horizontal
            value={seoUrl}
            onChange={(e) => setSeoUrl(e.target.value)}
            placeholder=""
          />
          <Textinput
            label="SEO Description"
            type="text"
            horizontal
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            placeholder=""
          />
        </div>
<Textarea
            label="Schema Code"
            type="text"
            placeholder=""
            rows="1"
            horizontal
            value={schemaCode}
            onChange={(e) => setSchemaCode(e.target.value)}
            className="w-full max-w-[350px]"
          />
        <h4 className="text-slate-800 dark:text-slate-300 my-8 text-base">Footer information</h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Textinput
            label="Frontend Footer Title"
            type="text"
            horizontal
            value={footerTitle}
            onChange={(e) => setFooterTitle(e.target.value)}
            placeholder=""
          />

          <div className="xl:col-span-2 ml-32">
            <FroalaEditorComponent
              tag="textarea"
              config={editorConfig}
              model={content}
              onModelChange={setContent}
            />
          </div> 
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 ml-32 gap-32">
          <Checkbox
            label="Enable Payment Gateway"
            value={checked5}
            onChange={() => setChecked5(!checked5)}
          />
         </div> 
        <Fileinput
        name="profile"
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onChange={handleFileChange}
      />
      </Card>
    </div>
    </form>
  );
};

export default CreateCategory;
