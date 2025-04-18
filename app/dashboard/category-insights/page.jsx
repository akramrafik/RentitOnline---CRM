'use client';

import { useState } from "react";
import CategoryInsightFilter from "./filters";
import LocationCountsTable from "./summary_table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [locationData, setLocationData] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataUpdate = (locations, insightTypes) => {
    setIsLoading(true);
    setLocationData(locations);
    setTypes(insightTypes);
    setIsLoading(false);
  };

  const hasData = locationData && locationData.length > 0;

  return (
    <div className="p-4 space-y-4">
      <CategoryInsightFilter onDataUpdate={handleDataUpdate} />
      {hasData ? (
        <LocationCountsTable types={types} locations={locationData} loading={isLoading} />
      ) : (
        <div className="mt-6 text-gray-500">No data found.</div>
      )}
    </div>
  );
}
