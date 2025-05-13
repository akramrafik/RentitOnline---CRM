import { useState } from "react";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "@/components/ui/Card";

const SelectOrSkeleton = ({ loading, ...props }) =>
  loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const CategoryFilter = ({ onSearch, type, setType }) => {
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    alert(e.target.value);
  };

  return (
    <Card>
      <div className="space-y-5">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <select
            value={type}
            onChange={handleTypeChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="parent">Main Category</option>
            <option value="child">Child Category</option>
          </select>

          <SelectOrSkeleton
            placeholder="Choose Sub Category"
            // Add props when needed
          />

          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            placeholder="Search by name..."
            onChange={handleInputChange}
          />
        </div>
      </div>
    </Card>
  );
};

export default CategoryFilter;
