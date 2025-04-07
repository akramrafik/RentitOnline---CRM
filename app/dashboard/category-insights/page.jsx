"use client";
import React, { useState } from "react";
import TableData from "@/components/partials/table/TableData";
import { insightData } from "@/constant/table-data";
import CategoryInsightFilter from "./filters"
import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
const categoryInsights = () => {
  // Manage the status for each agent outside the table
  const [agentData, setAgentData] = useState(insightData);

  const insightColumn = [
    { Header: "Choose Location", accessor: "location" },
    { Header: "Economy cars", accessor: "economy_cars" },
    { Header: "Luxury cars", accessor: "luxuary_cars" },
    { Header: "Sports cars", accessor: "sports_cars"},
    { Header: "Electric cars", accessor: "electric_cars" },
    { Header: "Limousine", accessor: "limousine" },
    { Header: "Commercial", accessor: "commercial" },
    { Header: "Chauffeur cars", accessor: "chauffeur_cars" },
    { Header: "Vendor", accessor: "vendor" },
    { Header: "Agent", accessor: "agent" },
    { Header: "Action", accessor: "action",
      Cell: () => (
        <Link href="/dashboard/category-insights/comparison">
            <Button text="Compare" className="btn-primary btn-sm" />
            </Link>
      ),
     },
  ];

  return (
    <div className="space-y-5">
    <CategoryInsightFilter/>
      <TableData columns={insightColumn} data={insightData} />
    </div>
  );
};

export default categoryInsights;
