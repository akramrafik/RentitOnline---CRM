"use client";
import React, { useState } from "react";
import TableData from "@/components/partials/table/TableData";
import { agentLeadData } from "@/constant/table-data";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
// import ReactSelect from "@/components/partials/froms/ReactSelect";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Filters  from "./filters"; 

const AgentLeadsPage = () => {
  // Manage the status for each agent outside the table
  const [agentData, setAgentData] = useState(agentLeadData);

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
    { Header: "Owner", accessor: "owner" },
    { Header: "Phone Number", accessor: "phone" },
    { Header: "Whatsapp", accessor: "whatsapp" },
    { Header: "City", accessor: "city" },
    { Header: "Description", accessor: "description" },
    { Header: "Tag", accessor: "tag" },
    { Header: "First Call", accessor: "first_call" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
          return (
              <div>
                <ReactSelect className="react-select" />
              </div>
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
              <Icon icon="heroicons:pencil-square" />
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
    <Filters  />
      <TableData title="Agent Leads"  columns={agentLeadsColumns} data={agentData} />
    </div>
  );
};

export default AgentLeadsPage;