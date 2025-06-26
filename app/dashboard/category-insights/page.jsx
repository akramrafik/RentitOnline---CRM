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
  const [pagination, setPagination] = useState({currentPage: 1, totalPages: 1});

  const handleDataUpdate = (locations, insightTypes, paginationInfo) => {
    setIsLoading(true);
    setLocationData(locations);
    setTypes(insightTypes);
    setPagination(paginationInfo || {currentPage: 1, totalPages: 1});
    setIsLoading(false);
  };

  const hasData = locationData && locationData.length > 0;

  return (
    <div className=" space-y-4">
      <CategoryInsightFilter onDataUpdate={handleDataUpdate} />
      {hasData ? (
       <LocationCountsTable types={types} locations={locationData} loading={isLoading} currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      ) : (
        <div className="mt-6 text-gray-500">No data found.</div>
      )}
    </div>
  );
}
