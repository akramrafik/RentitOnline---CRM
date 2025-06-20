// DropZone.jsx
import React from "react";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";

const DropZone = ({ uploadedFiles = [], setUploadedFiles = () => {} }) => {
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      const combined = [...uploadedFiles, ...newFiles];
      setUploadedFiles(combined);
    },
  });

  const removeFile = (index) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    setUploadedFiles(updated);
  };

  return (
    <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-6 px-4 flex flex-col justify-center items-center">
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

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="relative group w-[150px] h-[150px]">
              <img
                src={file.preview}
                alt={file.name}
                className="object-cover w-full h-full rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MdClose />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropZone;
