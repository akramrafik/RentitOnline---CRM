'use client'; 
import React, { useState } from 'react'; 
import Card from '@/components/ui/Card'; 
import Textinput from '@/components/ui/Textinput'; 
import Checkbox from '@/components/ui/Checkbox'; 
import Button from '@/components/ui/Button'; 
import Icon from '@/components/ui/Icon'; 
import Textarea from '@/components/ui/Textarea'; 
import ReactSelect from '@/components/partials/froms/ReactSelect'; 
import dynamic from 'next/dynamic';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

const FroalaEditorComponent = dynamic(() => import('react-froala-wysiwyg'), {
  ssr: false,
});

const editorConfig = {
  placeholderText: 'Schema Code',
  charCounterCount: true,
  toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL', 'insertLink', 'insertImage'],
  pluginsEnabled: ['align', 'charCounter', 'link', 'image', 'lists'],
};


const CreateCategory = () => { 
    const [checked, setChecked] = useState(true);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(true);
    const [checked4, setChecked4] = useState(true);
     const [content, setContent] = useState('');
     return (
<div className="grid xl:grid-cols-1 grid-cols-1 gap-5 ">
    <Card>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 -mx-6 px-6 pb-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-300">Create Category</h2>
            <Button 
            text="Save" 
            className="btn-dark"
             />
        </div>
        <h4 className="text-base text-slate-800 dark:text-slate-300 mb-8">Category information</h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Textinput 
            label="Category name" 
            type="text" 
            horizontal 
            placeholder='' />
            <div className="flex items-center gap-4 ">
                <label className="form-label capitalize w-[60px] md:w-[100px] break-words">
                    Select Type
                </label>
                <div className='w-full max-w-[350px]'>
                    <ReactSelect 
                    placeholder="Type" 

                    />
                </div>
            </div>
            <Textarea 
            label="Description" 
            type="text" 
            placeholder=""
            rows="1" 
            horizontal 
                className='w-full max-w-[350px]'
            />
            <div className="flex items-center gap-4">
                <label className="form-label capitalize w-[60px] md:w-[100px] break-words">
                    Select Parent Category
                </label>
                <div className='w-full max-w-[350px]'>
                    <ReactSelect 
                    placeholder="Main Category" 

                    />
                </div>
            </div>

<div className="flex flex-wrap space-xy-6 mt-4 gap-4 ml-32">
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
          <div className="flex flex-wrap space-xy-6 mt-4 gap-4 mr-80">
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
          <h4 className="text-base text-slate-800 dark:text-slate-300 mb-8">SEO information</h4>
          <div></div>
          <Textinput 
            label="SEO Title" 
            type="text" 
            horizontal 
            placeholder='' />
          <Textinput 
            label="SEO Url" 
            type="text" 
            horizontal 
            placeholder='' />
            
            <Textinput 
            label="SEO Description" 
            type="text" 
            horizontal 
            placeholder='' />
            <div></div>
            <h4 className="text-slate-800 dark:text-slate-300 mb-8 text-base">Footer information</h4>
             <div></div>
          <Textinput 
            label="Frontend Footer Title" 
            type="text" 
            horizontal 
            placeholder='' />
            <FroalaEditorComponent
              tag="textarea"
              config={editorConfig}
              model={content}
              onModelChange={setContent}
            />
            <Textarea 
            label="Schema Code  " 
            type="text" 
            placeholder=""
            rows="1" 
            horizontal 
                className='w-full max-w-[350px]'
            />
            <div className="flex flex-wrap space-xy-6 mt-4 gap-4 mr-80">
          <Checkbox
            label="Enable Payment Gateway"
            value={checked3}
            onChange={() => setChecked3(!checked3)}
          />
          </div>
        </div>
        
    </Card>
</div>
); }; export default CreateCategory;