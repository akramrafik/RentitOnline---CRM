import { useEffect, useState } from "react";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "@/components/ui/Card";
import ReactSelectFilter from "@/components/partials/froms/ReactSelectFIlter";
import { getCategories } from "@/lib/api";

const SelectOrSkeleton = ({ loading, ...props }) =>
  loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const CategoryFilter = ({ onSearch, type, setType, parentId, setParentId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const mainOptions = [
    { value: "parent", label: "View Main Category" },
    { value: "child", label: "View Child Category" },
  ];

  // Local state for controlled selects
  const [selectedTypeOption, setSelectedTypeOption] = useState(null);
  const [selectedParentOption, setSelectedParentOption] = useState(null);

  // Sync `type` prop to local select state
  useEffect(() => {
    const matchedType = mainOptions.find((opt) => opt.value === type) || null;
    setSelectedTypeOption(matchedType);
  }, [type]);

  // Sync `parentId` prop to local select state
 useEffect(() => {
  if (!loading && categories.length > 0) {
    const parentOptions = categories.map(cat => ({
      value: cat.id,
      label: cat.name,
    }));
    const matchedParent = parentOptions.find(
      (opt) => String(opt.value) === String(parentId)
    ) || null;
    setSelectedParentOption(matchedParent);
  }
}, [parentId, categories, loading]);


  // Fetch parent categories once on mount
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await getCategories({ type: "parent" });
        if (response.status === true && Array.isArray(response.data)) {
          // Filter to main categories with active status
          const parents = response.data.filter(
            (cat) => !cat.parent && cat.status
          );
          setCategories(parents);
        }
      } catch (err) {
        console.error("Error fetching parent categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParentCategories();
  }, []);

  const handleTypeChange = (selected) => {
    setSelectedTypeOption(selected);
    setType(selected?.value || "");
  };

  const handleParentChange = (selected) => {
    setSelectedParentOption(selected);
    setParentId(selected?.value || "");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (onSearch) onSearch(value);
  };

  return (
      <div className="space-y-5">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ReactSelectFilter
            loading={loading}
            value={selectedTypeOption}
            onChange={handleTypeChange}
            options={mainOptions}
            placeholder="Category type"
          />

          <ReactSelectFilter
            loading={loading}
            value={selectedParentOption}
            onChange={handleParentChange}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            placeholder="Category options"
          />
          {/* <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            placeholder="Search by name..."
            onChange={handleInputChange}
          /> */}
        </div>
      </div>
  );
};

export default CategoryFilter;
