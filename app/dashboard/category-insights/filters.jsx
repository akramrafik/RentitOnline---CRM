"use client";
import React, { useEffect, useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Icon from "@/components/ui/Icon";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategoryInsights } from "@/lib/agents_api";

// === Utility ===
const getRandomColor = () => {
  const bgColors = ["bg-[#ECF1FF]", "bg-[#EDE8FB]", "bg-[#FDEDEC]", "bg-[#E7FBFE]", "bg-[#FCEFEE]"];
  return { randomBg: bgColors[Math.floor(Math.random() * bgColors.length)], randomText: "text-white" };
};

const SelectOrSkeleton = ({ loading, ...props }) =>
  loading ? <Skeleton height={38} /> : <ReactSelect {...props} />;

const CategoryInsightFilter = ({ onDataUpdate = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [emirates, setEmirates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmirate, setSelectedEmirate] = useState(null);
  const [location, setLocation] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [initialCategoryId, setInitialCategoryId] = useState(null);
  const [initialEmirateId, setInitialEmirateId] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL query params
  useEffect(() => {
    const categoryFromURL = searchParams.get("category");
    const emirateFromURL = searchParams.get("emirate");

    if (categoryFromURL) setInitialCategoryId(categoryFromURL);
    if (emirateFromURL) setInitialEmirateId(emirateFromURL);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategoryInsights({
        category: selectedCategory?.value,
        emirate: selectedEmirate?.value,
        location: location?.value,
        page: 1,
      });

      const data = response?.data;

      setCategories(data?.categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []);
      setEmirates(data?.emirates?.map((e) => ({ value: e.id, label: e.name })) || []);
      setLocations(data?.location_counts?.data?.map((loc) => ({ value: loc.location, label: loc.location })) || []);
      setInsights(data?.summery ? [{ types: Object.keys(data.summery), summary: data.summery }] : []);

      onDataUpdate(data?.location_counts?.data || [], data?.types || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong while fetching insights.");
    } finally {
      setLoading(false);
    }
  };

  // Apply initial category from URL
  useEffect(() => {
    if (!selectedCategory && initialCategoryId && categories.length > 0) {
      const found = categories.find((cat) => String(cat.value) === initialCategoryId);
      if (found) setSelectedCategory(found);
    }
  }, [categories, initialCategoryId]);

  // Apply initial emirate from URL
  useEffect(() => {
    if (!selectedEmirate && initialEmirateId && emirates.length > 0) {
      const found = emirates.find((e) => String(e.value) === initialEmirateId);
      if (found) setSelectedEmirate(found);
    }
  }, [emirates, initialEmirateId]);

  // Refetch data and update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory?.value) params.append("category", selectedCategory.value);
    if (selectedEmirate?.value) params.append("emirate", selectedEmirate.value);
    if (location?.value) params.append("location", location.value);
    router.push(`/dashboard/category-insights?${params.toString()}`);
    fetchData();
  }, [selectedCategory, selectedEmirate, location]);

  const colorMap = useMemo(() => {
    const map = {};
    insights.forEach((item) => {
      item.types.forEach((type) => {
        if (!map[type]) map[type] = getRandomColor();
      });
    });
    return map;
  }, [insights]);

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedEmirate(null);
    setLocation(null);
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <SelectOrSkeleton
            loading={loading}
            options={categories}
            value={selectedCategory}
            placeholder="Choose Category"
            onChange={(selected) => {
              setSelectedCategory(selected);
              setSelectedEmirate(null);
              setLocation(null);
            }}
          />
          <SelectOrSkeleton
            loading={loading}
            options={emirates}
            value={selectedEmirate}
            placeholder="Choose Emirate"
            onChange={(selected) => {
              setSelectedEmirate(selected);
              setLocation(null);
            }}
            isDisabled={!selectedCategory}
          />
          <div className="flex justify-between items-end space-x-5">
            <div className="flex-1">
              <SelectOrSkeleton
                loading={loading}
                options={locations}
                value={location}
                placeholder="Choose Location"
                onChange={setLocation}
                isDisabled={!selectedEmirate}
              />
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center h-10 w-10 bg-gray-500 border border-gray-500 text-white rounded"
            >
              <Icon icon="heroicons-outline:arrow-path" />
            </button>
          </div>
        </div>
      </Card>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading
            ? [...Array(6)].map((_, i) => (
                <Card key={i} bodyClass="pt-4 pb-3 px-4">
                  <div className="flex space-x-3">
                    <Skeleton circle height={48} width={48} />
                    <div className="flex-1">
                      <Skeleton width="80%" height={15} />
                      <Skeleton width="60%" height={20} />
                    </div>
                  </div>
                </Card>
              ))
            : insights.length > 0
            ? insights.flatMap((item, i) =>
                item.types.map((type, j) => {
                  const { randomBg, randomText } = colorMap[type] || getRandomColor();
                  return (
                    <Card key={`${i}-${j}`} bodyClass="pt-4 pb-3 px-4">
                      <div className="flex space-x-3">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${randomBg} ${randomText}`}>
                          <Icon icon="heroicons-outline:document-chart-bar" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-600 font-medium">{type}</div>
                          <div className="text-lg font-medium text-slate-900">{item.summary[type] ?? 0}</div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )
            : <p>No Data found</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryInsightFilter;
