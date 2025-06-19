import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react"; 

const DropZone = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
  });

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-6 px-4 flex flex-col justify-center items-center">
      {files.length === 0 && (
        <div {...getRootProps({ className: "dropzone cursor-pointer" })}>
          <input className="hidden" {...getInputProps()} />
          <img
            src="/assets/images/svg/upload.svg"
            alt=""
            className="mx-auto mb-4"
          />
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {isDragAccept ? "Drop the files here ..." : "Drop files here or click to upload."}
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {files.map((file, i) => (
          <div key={i} className="relative group w-[150px] h-[150px]">
            <img
              src={file.preview}
              alt=""
              className="object-cover w-full h-full rounded-md"
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
            <button
              type="button"
              onClick={() => removeFile(i)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropZone;
