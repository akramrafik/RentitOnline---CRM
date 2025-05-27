'use client';
import React, { useState, useMemo, useCallback, useTransition  } from "react";
import Card from "@/components/ui/Card";
import Swicth from "@/components/ui/Switch";
import { toast } from "react-toastify";
import BaseTable from "@/components/partials/table/BaseTable";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { getPlan, updatePlanStatus, deletePlan } from "@/lib/api";
import ConfirmDialog from "@/components/partials/ConfirmPopup";
import Modal from "@/components/ui/Modal";
import EditPlan from "./edit_plan";

const PlanPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const memoParams = useMemo(() => ({}), []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editPlanId, setEditPlanId] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handlePackagesClick = (row) => {
    const plan_id = row.original.id;
    router.push(`/dashboard/plans/${plan_id}/packages`);
  };

  const handleDelete = (plan) => {
    setDeleteTarget(plan);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlan(deleteTarget.id);
      toast.success("Plan deleted successfully");
      setDeleteTarget(null);
      startTransition(() => {
        if (pageIndex === 0) {
          setRefreshKey((k) => k + 1);
        } else {
          setPageIndex(0);
        }
      });
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => {
          const planName = value?.toLowerCase();
          const colorMap = {
            "basic plan": "bg-blue-100 text-blue-700",
            "standard plan": "bg-green-100 text-green-700",
            "premium plan": "bg-yellow-100 text-yellow-700",
            "enterprise plan": "bg-purple-100 text-purple-700",
            "featured plan": "bg-pink-100 text-pink-700",
          };
          const baseClass = "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize";
          const colorClass = colorMap[planName] || "bg-gray-100 text-gray-700";
          return <span className={`${baseClass} ${colorClass}`}>{value}</span>;
        },
      },
      { Header: "Tag", accessor: "tag" },
      { Header: "Caption", accessor: "caption" },
      { Header: "Ad Cost", accessor: "ad_cost" },
      { Header: "Prioroty.", accessor: "priority" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const [status, setStatus] = useState(() =>
            Boolean(Number(row.original.status))
          );
          const [loading, setLoading] = useState(false);

          const handleToggle = async () => {
            setLoading(true);
            try {
              const response = await updatePlanStatus(row.original.id);
              if (response.status) {
                setStatus(Boolean(Number(response.data.status)));
                toast.success("Status updated successfully");
              } else {
                toast.error("Failed to update status");
              }
            } catch (error) {
              console.error("Error toggling status:", error);
              toast.error("Error toggling status");
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
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content="Edit" placement="top" arrow animation="shift-away">
              <button
                className="action-btn"
                onClick={() => {
                  setEditPlanId(row.original.id); 
                  setEditTarget(row.original.name)
                  setEditModalOpen(true);
                }}
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="danger">
              <button
                className="action-btn"
                onClick={() => handleDelete(row.original)}
                disabled={loading}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
            <Tooltip content="Packages" placement="top" arrow animation="shift-away">
              <button
                className="action-btn"
                onClick={() => handlePackagesClick(row)}
              >
                <Icon icon="heroicons:circle-stack" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [loading]
  );

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

  const fetchPlans = useCallback(async ({ pageIndex }) => {
    const params = { page: pageIndex + 1 };
    const response = await getPlan(params);
    return response;
  }, []);

  return (
    <>
    <Card>
      <BaseTable
        title="Plans"
        columns={columns}
        apiCall={fetchPlans}
        params={memoParams}
        pageIndex={pageIndex}
        setFilter={debouncedSetFilter}
        setPageIndex={(index) => startTransition(() => setPageIndex(index))}
        filter={filter}
        showGlobalFilter={false}
        refreshKey={refreshKey}
      />
    </Card>
     <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Plan"
        message={`Are you sure you want to delete the plan "${deleteTarget?.name}"? This action cannot be undone.`}
      />
      <Modal
        title={`edit ${editTarget}`}
        activeModal={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        footerContent={null} >
        <EditPlan id={editTarget}/>
      </Modal>
      </>
  );
};

export default PlanPage;
