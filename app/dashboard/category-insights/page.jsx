'use client';

import { useState } from "react";
import CategoryInsightFilter from "./filters";
import LocationCountsTable from "./summary_table";

export default function Page() {
  const [locationData, setLocationData] = useState([]);
  const [types, setTypes] = useState([]);

  const handleDataUpdate = (locations, insightTypes) => {
    setLocationData(locations);
    setTypes(insightTypes);
  };

  return (
    <div>
      <CategoryInsightFilter  onDataUpdate={handleDataUpdate} />

      {locationData.length > 0 ? (
        <LocationCountsTable types={types} locations={locationData} />
      ) : (
        <div className="mt-6 text-gray-500">No data found.</div>
      )}
    </div>
  );
}
