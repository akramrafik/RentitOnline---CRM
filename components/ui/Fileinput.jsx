import React from "react";
import { FaUserCircle, FaPen, FaTrash } from "react-icons/fa";

const Fileinput = ({
  name,
  onChange,
  selectedFile,
  setSelectedFile,
  id = "profile-upload",
}) => {
  return (
    <div className="relative w-32 h-32">
      {/* Hidden File Input */}
      <input
        type="file"
        id={id}
        name={name}
        onChange={onChange}
        className="hidden"
        accept="image/*"
      />

      {/* Circle Image Preview & Label */}
      <label
        htmlFor={id}
        className="cursor-pointer group  w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 relative flex items-center justify-center shadow-sm hover:border-primary-500 transition-colors"
        title="Click to upload/change image"
      >
        {selectedFile ? (
          <img
            src={
              typeof selectedFile === "string"
                ? selectedFile
                : URL.createObjectURL(selectedFile)
            }
            alt="Selected"
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          <FaUserCircle className="text-gray-400 text-8xl" />
        )}

        {/* Pen Icon Overlay */}
        <div className="absolute bottom-3 right-3 bg-white rounded-full p-1 shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
          <FaPen className="text-gray-700 text-sm" />
        </div>

        {/* Delete Button */}
        {selectedFile && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSelectedFile(null);
            }}
            className="absolute top-3 right-3 bg-red-600 rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
            aria-label="Remove selected image"
          >
            <FaTrash className="text-white text-sm" />
          </button>
        )}
      </label>
    </div>
  );
};

export default Fileinput;
