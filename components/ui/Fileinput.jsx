import React from "react";
import { FaUserCircle, FaPen, FaTimes, FaTrash } from "react-icons/fa";

const Fileinput = ({
  name,
  onChange,
  selectedFile,
  setSelectedFile,
  id = "profile-upload",
}) => {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Hidden File Input */}
      <input
        type="file"
        id={id}
        name={name}
        onChange={onChange}
        className="hidden"
        accept="image/*"
      />

      {/* Profile Image Preview */}
      <label htmlFor={id} className="cursor-pointer group">
        <div className="w-32 h-32  border border-gray-300 overflow-hidden relative bg-gray-100 flex items-center justify-center">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-7xl" />
          )}

          {/* Pen Icon Overlay */}
          <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow group-hover:scale-110 transition">
            <FaPen className="text-gray-600 text-sm" />
          </div>
         
        </div>
         {selectedFile && (
          <button 
          type="button"
          className="absolute bottom-1 left-1  bg-red-500  rounded-full p-1 shadow group-hover:scale-110 transition"
          onClick={() => setSelectedFile(null)}
          >
            <FaTrash className="text-white text-sm" />
          </button>
           )}
      </label>
     
    </div>
  );
};

export default Fileinput;
