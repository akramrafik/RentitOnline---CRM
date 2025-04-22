"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import Card from "@/components/ui/card";
import { getInsightCoparison } from "@/lib/agents_api";

const Comparison = ({ onDataUpdate }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [emirates, setEmirates] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmirate, setSelectedEmirate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const updateURL = (category, emirate, location) => {
    const params = new URLSearchParams();

    if (category) params.set("category", category.value);
    if (emirate) params.set("emirate", emirate.value);
    if (location) params.set("location", location.value);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchData = async () => {
    try {
      const response = await getInsightCoparison({
        category: selectedCategory?.value,
        emirate: selectedEmirate?.value,
        location: selectedLocation?.value,
      });

      const data = response?.data;

      setCategories(
        data?.categories?.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || []
      );

      setEmirates(
        data?.emirates?.map((e) => ({
          value: e.id,
          label: e.name,
        })) || []
      );

      setLocations(
        data?.location_counts?.data?.map((loc) => ({
          value: loc.location,
          label: loc.location,
        })) || []
      );

      onDataUpdate?.(data?.location_counts?.data || [], data?.types || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    updateURL(selectedCategory, selectedEmirate, selectedLocation);
  }, [selectedCategory, selectedEmirate, selectedLocation]);

  return (
    <Card>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ReactSelect
          options={categories}
          placeholder="Select Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
        <ReactSelect
          options={emirates}
          placeholder="Select Emirate"
          value={selectedEmirate}
          onChange={(opt) => {
            setSelectedEmirate(opt);
            setSelectedLocation(null); // Reset location when emirate changes
          }}
        />
        <ReactSelect
          options={locations}
          placeholder="Choose Location"
          value={selectedLocation}
          onChange={setSelectedLocation}
          isDisabled={!selectedEmirate}
        />
      </div>
    </Card>
  );
};

export default Comparison;
