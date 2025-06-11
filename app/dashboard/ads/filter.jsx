import React, { useEffect, useState, useCallback } from "react";
import ReactSelectFilter from "@/components/partials/froms/ReactSelectFIlter";
import Flatpickr from "react-flatpickr";
import { getCategories } from "@/lib/api";
import InputGroup from "@/components/ui/InputGroup";
import LocationAutoCompleteInput from "@/components/partials/LocationSearch";

const FilterComp = ({selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory,selectedStatus, setSelectedStatus, selectedPlan, setSelectedPlan, startDate, setStartDate, endDate, setEndDate,selectedLocation,setSelectedLocation, resetFiltersRef }) => {
  const [picker, setPicker] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [parentId, setParentId] = useState("");
  const [emirateId, setEmirateId] = useState("")
  const emirateOptions = [
    {value: "1", label: "Abu Dhabi"},
    {value: "3", label: "Dubai"},
    {value: "6", label: "Sharjah"},
    {value: "2", label: "Ajman"},
    {value: "7", label: "Umm Al Quwain"},
    {value: "5", label: "Ras Al Khaimah"},
    {value: "4", label: "Fujairah"},
  ]

  const ad_options = [
    { value: "", label: "All Ads" },
    { value: "0", label: "Under Review" },
    { value: "1", label: "Live" },
    { value: "2", label: "In Draft" },
    { value: "3", label: "Payment Pending" },
    { value: "4", label: "Rejected" },
    { value: "6", label: "Expired" },
    { value: "7", label: "DLD Failed" },
    { value: "8", label: "Rented Out" },
    { value: "9", label: "Deleted" },
    { value: "10", label: "Renewed" },
  ];

  const ad_plan = [
    { value: "", label: "All Ads" },
    { value: "basic", label: "Basic" },
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
  ];

  // Fetch all top-level categories on mount
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories({ type: "parent" });
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // Fetch subcategories when parentId changes
  const fetchSubCategories = useCallback(async () => {
    if (!parentId) return;
    try {
      const res = await getCategories({ parent: parentId });
      setSubCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setSubCategories([]);
    }
  }, [parentId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  useEffect(() => {
    if (!resetFiltersRef) return;
    resetFiltersRef.current = () => {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedStatus(null);
      setSelectedPlan(null);
      setSelectedLocation(null);
      setStartDate(null);
      setEndDate(null);
      setParentId("");
    };
  }, [resetFiltersRef, setSelectedCategory, setSelectedSubCategory, setSelectedStatus, setSelectedPlan,setSelectedLocation, setStartDate, setEndDate]);


  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    const id = selectedOption?.value || "";
    setParentId(id);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryChange = (selectedOption) => {
    setSelectedSubCategory(selectedOption);
  };


  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <ReactSelectFilter
        options={ad_options}
        placeholder="Status"
       onChange={setSelectedStatus}
        value={selectedStatus}
      />
      <ReactSelectFilter 
      options={ad_plan} 
      placeholder="Plan"
      onChange={setSelectedPlan}
      value={selectedPlan}
       />
      <ReactSelectFilter
        options={categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
        placeholder="All Categories"
        onChange={handleCategoryChange}
       value={selectedCategory}
      />
      <ReactSelectFilter
        options={subCategories.map((sub) => ({
          value: sub.id,
          label: sub.name,
        }))}
        placeholder="Sub Categories"
        onChange={handleSubCategoryChange}
        value={selectedSubCategory}
      />
      <Flatpickr
  value={startDate}
  onChange={(date) => setStartDate(date[0])}
  options={{ dateFormat: "Y-m-d" }}
  render={(props, ref) => (
    <input
      {...props}
      ref={ref}
      placeholder="Start Date"
      className="form-control py-2"
    />
  )}
/>

<Flatpickr
  value={endDate}
  onChange={(date) => setEndDate(date[0])}
  options={{ dateFormat: "Y-m-d" }}
  render={(props, ref) => (
    <input
      {...props}
      ref={ref}
      placeholder="End Date"
      className="form-control py-2"
    />
  )}
/>


    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-2">
  <div className="col-span-1">
    <ReactSelectFilter 
      options={emirateOptions}
      value={emirateOptions.find(opt => opt.value === emirateId)}
      onChange={(selectedOption) => setEmirateId(selectedOption.value)}
      placeholder="Emirates"
    />
  </div>
  <div className="col-span-1 lg:col-span-3">
    <LocationAutoCompleteInput 
    emirateId={emirateId}
      selectedLocation={selectedLocation}
  setSelectedLocation={setSelectedLocation}
    />
  </div>
</div>

    </>
  );
};

export default FilterComp;
