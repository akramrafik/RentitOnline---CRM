'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Dynamically import FroalaEditor to prevent SSR issues
const FroalaEditor = dynamic(() => import('react-froala-wysiwyg'), {
  ssr: false,
});

const TextEditor = ({ value = '', onChange }) => {
  const [content, setContent] = useState(value);

  const handleModelChange = (newContent) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <div className="formGroup">
      <FroalaEditor
        tag="textarea"
        model={content}
        onModelChange={handleModelChange}
        config={{
          placeholderText: 'Write something here...',
          heightMin: 150,
        }}
      />
    </div>
  );
};

export default TextEditor;
