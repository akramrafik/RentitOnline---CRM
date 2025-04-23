import React from "react";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SelectOrSkeleton = ({ loading, ...props }) =>
    loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const CategoryFilter = () => {
  return (
    <div className="space-y-5">
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <SelectOrSkeleton
        placeholder="Choose Category"
    />
    <SelectOrSkeleton
        placeholder="Choose Sub Category"
    />
    </div>
    </div>
  );
}
export default CategoryFilter;