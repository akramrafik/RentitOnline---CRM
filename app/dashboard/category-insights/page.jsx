"use client";
import React, { useState } from "react";
import SummaryTable from "./summary_table";
import { insightData } from "@/constant/table-data";
import CategoryInsightFilter from "./filters";
import Link from "next/link";

const CategoryInsights = () => {
  const [agentData, setAgentData] = useState(insightData);

  const insightColumn = [
    { Header: "Choose Location", accessor: "location" },
    { Header: "Economy cars", accessor: "economy_cars" },
    { Header: "Luxury cars", accessor: "luxuary_cars" },
    { Header: "Sports cars", accessor: "sports_cars" },
    { Header: "Electric cars", accessor: "electric_cars" },
    { Header: "Limousine", accessor: "limousine" },
    { Header: "Commercial", accessor: "commercial" },
    { Header: "Chauffeur cars", accessor: "chauffeur_cars" },
    { Header: "Vendor", accessor: "vendor" },
    { Header: "Agent", accessor: "agent" },
    {
      Header: "Action",
      accessor: "action",
      Cell: () => (
        <Link href="/dashboard/category-insights/comparison">
          <button className="btn-primary btn-sm">Compare</button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <CategoryInsightFilter />
      <SummaryTable
        title="Rio Agents"
        columns={insightColumn}
        data={agentData}
        showAddNew={true}
      />
    </div>
  );
};

export default CategoryInsights;
