"use client";

import { useState, useEffect } from "react";
import ReactSelect from "./froms/ReactSelect";
import Flatpickr from "react-flatpickr";
import { getDashboardData, getMonthlyAdsReport } from "@/lib/api";
import { toast } from "react-toastify";

const FilterMonthlyData = ({ onDataUpdate }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  
// fetching initial categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getDashboardData();
        const catList = response.data.categories || [];
        setCategories(catList);
        console.log("Categories: ", catList)
        setCategoryOptions(
          catList.map(item => ({ value: item.id, label: item.name }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
// subcategory options
  useEffect(() => {
    if (!selectedCategory || !categories.length) return;
    console.log("Selected Category Value:", selectedCategory.value);
    console.log("All Categories:", categories);
  
    const selectedCat = categories.find(
      cat => String(cat.id) == String(selectedCategory.value)
    );
    console.log("Matched Category:", selectedCat);
    if (!selectedCat) return;
    const children = selectedCat?.child_categories || [];
    console.log("Children Categories:", children);
    setSubCategoryOptions(children.map(sub => ({
      value: sub.id,
      label: sub.name,
    })));

    setSelectedSubCategory(null);
  }, [selectedCategory, categories]);

  // fetching filtered data
  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!startDate || !endDate) return;
      if (startDate > endDate) {
        toast.error("Start date must be before or equal to end date.");
        return;
      }
      try {
        setLoading(true);

        const payload = {
          category: selectedCategory?.value ?? null,
          subcategory: selectedSubCategory?.value ?? null,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        };

        const response = await getMonthlyAdsReport(payload);
        const monthlyData = response?.data?.monthly_ads || {};
        if (onDataUpdate) onDataUpdate(monthlyData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        toast.error("Failed to fetch data.");
        if (error?.response?.data?.errors) {
          const { start_date, end_date } = error.response.data.errors;
  
          if (start_date?.length) toast.error(start_date[0]);
          if (end_date?.length) toast.error(end_date[0]);
        } else {
          toast.error("Failed to fetch filtered data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [startDate, endDate, selectedCategory, selectedSubCategory]);


  return (
    <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mb-5">
      <div className="flex justify-between items-end space-x-5">
        <Flatpickr
          className="form-control py-2 h-[42px] text-sm"
          placeholder="Start Date"
          value={startDate}
          onChange={date => setStartDate(date[0])}
        />
        <Flatpickr
          className="form-control py-2 h-[42px] text-sm"
          placeholder="End Date"
          value={endDate}
          onChange={date => setEndDate(date[0])}
        />
      </div>

      <ReactSelect
       className="h-[42px] text-sm"
        placeholder="Choose Category"
        options={categoryOptions}
        value={selectedCategory}
        onChange={(option) => {
    console.log("Category selected:", option);
    setSelectedCategory(option);
  }}
        isDisabled={loading}
      />

      <ReactSelect
        className="h-[42px] text-sm"
        placeholder="Choose Sub Category"
        options={subCategoryOptions}
        value={selectedSubCategory}
        onChange={setSelectedSubCategory}
        isDisabled={!subCategoryOptions.length || loading}
      />

    </div>
  );
};

export default FilterMonthlyData;
