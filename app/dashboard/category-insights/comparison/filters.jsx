import React from "react";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SelectOrSkeleton = ({ loading, ...props }) =>
  loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const CompareFilter = ({
  filters,
  onChange,
  loading,
  categoryOptions = [],
  emirateOptions = [],
  locationOptions = [],
}) => (
  <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <SelectOrSkeleton
      loading={loading}
      placeholder="Select Category"
      options={categoryOptions}
      onChange={(option) => onChange("category", option?.value)}
    />
    <SelectOrSkeleton
      loading={loading}
      placeholder="Select Emirate"
      options={emirateOptions}
      onChange={(option) => onChange("emirate", option?.value)}
    />
    <SelectOrSkeleton
      loading={loading}
      placeholder="Choose Location"
      options={locationOptions}
      onChange={(option) => onChange("location", option?.value)}
    />
  </div>
);

export default CompareFilter;
