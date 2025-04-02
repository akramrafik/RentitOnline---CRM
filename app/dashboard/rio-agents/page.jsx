"use client";
import React, { useState } from "react";
import TableData from "@/components/partials/table/TableData";
import { rioAgentData } from "@/constant/table-data";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import Link from "next/link";
const AgentLeadsPage = () => {
  // Manage the status for each agent outside the table
  const [agentData, setAgentData] = useState(rioAgentData);

  const toggleStatus = (id) => {
    setAgentData((prevData) =>
      prevData.map((agent) =>
        agent.id === id
          ? { ...agent, status: agent.status === "Active" ? "Inactive" : "Active" }
          : agent
      )
    );
  };

  const agentLeadsColumns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Position", accessor: "position",
      Cell: ({ value }) => (
        <span className="badge bg-primary-500 text-white">
          {value}
        </span>
      ),
     },
    { Header: "Department", accessor: "department" },
    { Header: "Date of Birth", accessor: "dob" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        //const isChecked = row.original.status === "active";
        const [checked, setChecked] = useState(true);
        return (
          <Switch
             value={checked}
            onChange={() => setChecked(!checked)}
          />
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: () => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button">
             <Link href="/dashboard/rio-agents/agent_edit"><Icon icon="heroicons:pencil-square" /></Link> 
            </button>
          </Tooltip>
          <Tooltip
            content="Delete"
            placement="top"
            arrow
            animation="shift-away"
            theme="danger"
          >
            <button className="action-btn" type="button">
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
          <Tooltip content="Locations" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button">
              <Icon icon="heroicons:map" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <TableData title="Rio Agents" columns={agentLeadsColumns} data={agentData} />
    </div>
  );
};

export default AgentLeadsPage;
