"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import FilterMonthlyData from "@/components/partials/SelectMonth";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import BarChart from "@/components/partials/chart/chartjs/Bar";
import { getDashboardData } from "@/lib/api";
import CommonDropdown from "@/components/ui/Common-dropdown";

// Reusable Skeleton Block
const SkeletonBox = ({ height = "h-24", className = "" }) => (
  <div className={`bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse ${height} ${className}`} />
);

const CrmPage = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response.data);
        setFilteredData(response.data.monthly_ads);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const isLoading = !data;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-5">
        {/* Top Summary Cards */}
        <div className="col-span-12 space-y-5">
         <Card>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
         
            {isLoading ? (
              <>
                <SkeletonBox height="h-20" />
                <SkeletonBox height="h-20" />
                <SkeletonBox height="h-20" />
                <SkeletonBox height="h-20" />
              </>
            ) : (
              <GroupChart3 data={data} />
            )}
           
          </div>
 </Card>
 </div>
        {/* Overview Area Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <Card title="Overview"
           headerslot={
    !isLoading && (
      <CommonDropdown
        contentWrapperClass="rounded-lg filter-panel"
        header="Filters"
        label="Filter"
        split
        labelClass="btn-sm h-10 my-0 btn-outline-light"
      >
        <FilterMonthlyData onDataUpdate={setFilteredData} />
      </CommonDropdown>
    )
  }
  >
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonBox height="h-[300px]" />
              </div>
            ) : (
              <>       
                <BasicArea data={filteredData} height={320} />
              </>
            )}
          </Card>
        </div>

        {/* Last 7 Days Bar Chart */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Card title="Last 7 Days">
            {isLoading ? (
              <SkeletonBox height="h-[300px]" />
            ) : (
              <BarChart />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrmPage;
