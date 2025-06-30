"use client";

import { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import { getDashboardData, getMonthlyAdsReport } from "@/lib/api";
import { toast } from "react-toastify";
import ReactSelectFilter from "./froms/ReactSelectFIlter";

const FilterMonthlyData = ({ onDataUpdate }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getDashboardData();
        const catList = response.data.categories || [];
        setCategories(catList);
        setCategoryOptions(
          catList.map(item => ({ value: item.id, label: item.name }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Set subcategories on category change
  useEffect(() => {
    if (!selectedCategory || !categories.length) return;

    const selectedCat = categories.find(
      cat => String(cat.id) === String(selectedCategory.value)
    );

    if (!selectedCat) return;
    const children = selectedCat.child_categories || [];
    setSubCategoryOptions(
      children.map(sub => ({ value: sub.id, label: sub.name }))
    );
    setSelectedSubCategory(null);
  }, [selectedCategory, categories]);

  // Fetch filtered data
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
        onDataUpdate?.(monthlyData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        toast.error("Failed to fetch filtered data.");
        const { start_date, end_date } = error?.response?.data?.errors || {};
        if (start_date?.length) toast.error(start_date[0]);
        if (end_date?.length) toast.error(end_date[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [startDate, endDate, selectedCategory, selectedSubCategory]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Date Pickers */}
      <div className="flex flex-col gap-2">
        <Flatpickr
  value={startDate}
  onChange={date => setStartDate(date[0])}
  options={{ dateFormat: "d-m-Y" }}
  className="w-full border rounded px-3 py-2 text-sm"
  placeholder="Start Date"
/>

      </div>

      <div className="flex flex-col gap-2">
        <Flatpickr
  value={endDate}
  onChange={date => setEndDate(date[0])}
  options={{ dateFormat: "d-m-Y" }}
  className="w-full border rounded px-3 py-2 text-sm"
  placeholder="End Date"
/>

      </div>

      {/* Category Select */}
      <div className="flex flex-col gap-2">
        <ReactSelectFilter
          className="h-[42px] text-sm"
          placeholder="Choose Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          isDisabled={loading}
        />
      </div>

      {/* Subcategory Select */}
      <div className="flex flex-col gap-2 lg:col-span-1 md:col-span-2 col-span-1">
        {/* <ReactSelectFilter
          className="h-[42px] text-sm"
          placeholder="Choose Sub Category"
          options={subCategoryOptions}
          value={selectedSubCategory}
          onChange={setSelectedSubCategory}
          isDisabled={!subCategoryOptions.length || loading}
        /> */}
      </div>
    </div>
  );
};

export default FilterMonthlyData;
