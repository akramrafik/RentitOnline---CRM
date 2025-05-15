import { useEffect, useState } from "react";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "@/components/ui/Card";
import { getCategories } from "@/lib/api";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

const SelectOrSkeleton = ({ loading, ...props }) =>
  loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const CategoryFilter = ({ onSearch, type, setType, parentId, setParentId }) => {

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (onSearch) onSearch(value);
  };

  const handleTypeChange = (selected) => {
    const newType = selected?.value || "";
    setType(newType);  
  };

  const mainOptions = [
    { value: 'parent', label: 'View Main Category' },
    { value: 'child', label: 'View Child Category' },
  ];

  useEffect(() => {
  const fetchParentCategories = async () => {
    try {
      const response = await getCategories({
        type: "parent",});
      if (response.status === true && Array.isArray(response.data)) {
        const transformed = response.data.map((item) => ({
          ...item,
          status: item.status ? 1 : 0,
          parent: item.parent ? item.parent.name : null,
        }));
        const parents = transformed.filter(
          (item) => item.parent === null && item.status === 1
        );

        setCategories(parents);
      }
    } catch (err) {
      console.error("Error fetching parent categories", err);
    }
  };

  fetchParentCategories();
}, []);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  return (
    <Card>
      <div className="space-y-5">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <SelectOrSkeleton
            value={mainOptions.find((opt) => opt.value === type)}
            onChange={handleTypeChange}
            options={mainOptions}
            placeholder="Category type"
          />

          <SelectOrSkeleton
  placeholder="Category options"
  options={categories.map((cat) => ({
    value: cat.id,
    label: cat.name
  }))}
  onChange={(selected) => setParentId(selected?.value)}
  //isDisabled={type === 'parent'}
  value={categories
    .map((cat) => ({ value: cat.id, label: cat.name }))
    .find((opt) => opt.value === parentId)}
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
