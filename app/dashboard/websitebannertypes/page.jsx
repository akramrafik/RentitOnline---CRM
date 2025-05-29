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
import { getAllBannerTypes } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import EditBanner from "./edit_banner";

const GetBannerTypes = () => {
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

  const handleEditClick = (row) => {
    const plan_id = row.original.id;
    setEditTarget(plan_id)
    setEditModalOpen(true);
    //router.push(`/dashboard/plans/${plan_id}/packages`);
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
      },
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
                onClick={() => handleEditClick (row)}
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

  const fetchBannerType = useCallback(async ({ pageIndex }) => {
    const params = { page: pageIndex + 1 };
    const response = await getAllBannerTypes(params);
    return response;
  }, []);

  return (
    <>
    <Card>
      <BaseTable
        title="BannerType"
        columns={columns}
        apiCall={fetchBannerType}
        params={memoParams}
        pageIndex={pageIndex}
        setFilter={debouncedSetFilter}
        setPageIndex={(index) => startTransition(() => setPageIndex(index))}
        filter={filter}
        showGlobalFilter={false}
        refreshKey={refreshKey}
      />
    </Card>
    <Modal
        // title={`edit ${editTarget}`}
        activeModal={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        footerContent={null} >
        <EditBanner id={editTarget}/>
      </Modal>
      </>
  );
};

export default GetBannerTypes;
