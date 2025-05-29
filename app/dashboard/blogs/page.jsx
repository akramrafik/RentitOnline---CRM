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
import { getAllBlogs, updateBlogStatus, deleteBlog } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/partials/ConfirmPopup";
// import EditBanner from "./edit_banner";

const GetBlogs = () => {
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
    const blog_id = row.original.id;
    router.push(`/dashboard/plans/${plan_id}/packages`);
  };

  const handleDelete = (plan) => {
    setDeleteTarget(plan);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {   
      await deleteBlog(deleteTarget.id);
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
        Header: "Image",
        accessor: "image1",
         Cell: ({ value }) => (
    <img
      src={value}
      alt="Banner"
      style={{ width: "60px", height: "auto", objectFit: "cover", borderRadius: "4px" }}
    />
  ),
      },
      {
        Header: "Title",
        accessor: "title",
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
              const response = await updateBlogStatus(row.original.id);
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
        title="Blogs"
        columns={columns}
        apiCall={getAllBlogs}
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
        message={`Are you sure you want to delete the blog "${deleteTarget?.id}"? This action cannot be undone.`}
      />
    <Modal
        // title={`edit ${editTarget}`}
        activeModal={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        footerContent={null} >
        {/* <EditBanner id={editTarget}/> */}
      </Modal>
      </>
  );
};

export default GetBlogs;
