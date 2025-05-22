'use client'
import React from "react";
import Card from "@/components/ui/Card";
import Swicth from "@/components/ui/Switch";
import { toast } from "react-toastify";
import BaseTable from "@/components/partials/table/BaseTable";
import { useEffect, useMemo, useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { getPlan, updatePlanStatus } from "@/lib/api";


const PlanPage = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState("");

     const columns = useMemo(
        () => [
          { Header: "Id", accessor: "id" },
          { Header: "Name", accessor: "name",
            Cell: ({value}) =>{
                const planName = value?.toLowerCase();
                const colorMap = {
      "basic plan": "bg-blue-100 text-blue-700",
      "standard plan": "bg-green-100 text-green-700",
      "premium plan": "bg-yellow-100 text-yellow-700",
      "enterprise plan": "bg-purple-100 text-purple-700",
      "featured plan": "bg-pink-100 text-pink-700",
    };
                const baseClass = 'inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize';
                const colorClass = colorMap[planName] || 'bg-gray-100 text-gray-700';
                console.log('colorclass', colorClass);
                return(
                <span className={`${baseClass} ${colorClass}`}>
                {value}
                </span>
                );
            },
          },
          { Header: "Tag", accessor: "tag",},
          { Header: "Caption", accessor: "caption" },
          { Header: "Ad Cost", accessor: "ad_cost" },
          { Header: "Prioroty.", accessor: "priority" },
          { Header: "Status", accessor: "status",
            Cell: ({ row }) => {
  const [status, setStatus] = useState(() => Boolean(Number(row.original.status)));
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await updatePlanStatus(row.original.id);
      if (response.status) {
        setStatus(Boolean(Number(response.data.status))); // ensure it's boolean
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Swicth
      value={status}
      onChange={handleToggle}
      badge
      disabled={loading}
      prevIcon="heroicons-outline:check"
      nextIcon="heroicons-outline:x"
      activeClass="bg-green-500"
    />
  );
},
           },
      { Header: "Action", accessor: "",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content="Edit" placement="top" arrow animation="shift-away"><button className="action-btn"><Icon icon="heroicons:pencil-square"/></button></Tooltip>
            <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="danger"><button className="action-btn"><Icon icon="heroicons:trash" /></button></Tooltip>
            <Tooltip content="Packages" placement="top" arrow animation="shift-away">
            <button className="action-btn" onClick={handleClick}><Icon icon="heroicons:circle-stack" /></button>
            </Tooltip>
          </div>
        ),
       },
        ],
        []
      );
      // Debounced filter change
            const debouncedSetFilter = useMemo(
              () =>
                debounce((value) => {
                  startTransition(() => {
                    setPageIndex(0);
                    setFilter(value);
                  });
                }, 300),
              []
            );

     // API call
        const fetchPlans = useCallback(
          async ({ pageIndex }) => {
             const params = {
          page: pageIndex + 1,
             }
            const response = await getPlan(params);
            return response;
          },
          []
        );
    return(
        <Card>
            <BaseTable
            title="Plans"
            columns={columns}
            apiCall={fetchPlans}
            params={{}}
            pageIndex={pageIndex}
            setFilter={debouncedSetFilter}
            setPageIndex={(index) => startTransition(() => setPageIndex(index))}
            filter={filter}
            showGlobalFilter={false}
            />
        </Card>
    );
};

export default PlanPage;