"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import FilterMonthlyData from "@/components/partials/SelectMonth";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import BarChart from "@/components/partials/chart/chartjs/Bar";
import { getDashboardData } from "@/lib/api";

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

  return (
    <div>
      <div className="space-y-5">
        <div className="grid grid-cols-12 gap-5">
          <div className="lg:col-span-12 space-y-5">
            <Card>
              <div className="grid xl:grid-cols-4 lg:grid-cols-2 col-span-1 gap-3">
                <GroupChart3 data={data} />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 col-span-12 space-y-5">
            <Card title="Overview">
              <FilterMonthlyData onDataUpdate={setFilteredData} />
              <BasicArea data={filteredData} height={300} />
            </Card>
          </div>

          <div className="lg:col-span-4 col-span-12 space-y-5">
            <Card title="Last 7 Days">
              <BarChart />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmPage;
