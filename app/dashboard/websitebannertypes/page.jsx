'use client';
import React, {
  useState,
  useMemo,
  useCallback,
  useTransition,
  useEffect,
  useRef
} from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Swicth from "@/components/ui/Switch";
import { toast } from "react-toastify";
import BaseTable from "@/components/partials/table/BaseTable";
import debounce from "lodash.debounce";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import ConfirmDialog from "@/components/partials/ConfirmPopup";
import {
  getAllBannerTypes,
  changeBannerStatus,
  deleteBannerType
} from "@/lib/api";
import Modal from "@/components/ui/Modal";
import EditBanner from "./edit_banner";
import Button from "@/components/ui/Button";
import CreateBanner from "./create_banner";

const GetBannerTypes = () => {
  const {banner_type_id} = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInternalUpdate = useRef(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const memoParams = useMemo(() => ({}), []);

  // Set state from URL on initial load
  useEffect(() => {
    const initialSearch = searchParams.get("q") || "";
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const initialPage = isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;

    setFilter(initialSearch);
    setPageIndex(initialPage);
    setHasInitialized(true);
  }, [searchParams]);

  // Update URL when state changes
  useEffect(() => {
    if (!hasInitialized || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filter) params.set("q", filter);
    if (pageIndex > 0) params.set("page", String(pageIndex + 1));

    const nextUrl = `?${params.toString()}`;
    if (nextUrl !== window.location.search) {
      isInternalUpdate.current = true;
      router.replace(nextUrl);
    }
  }, [filter, pageIndex]);

  const handleEditClick = (row) => {
    const id = row.original.id;
    setEditTarget(id);
    setEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await deleteBannerType(deleteTarget.id);
      toast.success("Banner deleted successfully");

      const remaining = totalCount - 1;
      const currentItemIndex = pageIndex * pageSize;

      const newPageIndex =
        currentItemIndex >= remaining && pageIndex > 0 ? pageIndex - 1 : pageIndex;

      startTransition(() => {
        setPageIndex(newPageIndex);
        setRefreshKey((k) => k + 1);
      });

      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleBannersClick = (row) => {
    const bannerTypeId  = row.original.id;
    // alert(id)
    router.push(`/dashboard/websitebannertypes/${bannerTypeId}`)
  };


  const handleSuccess = () => {
    setEditModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      {
        Header: "Name",
        accessor: "name"
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
              const response = await changeBannerStatus(row.original.id);
              if (response.status) {
                setStatus(Boolean(Number(response.data.status)));
                toast.success("Status updated successfully");
              } else {
                toast.error("Failed to update status");
              }
            } catch (error) {
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
        }
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content="Edit" placement="top">
              <button className="action-btn" onClick={() => handleEditClick(row)}>
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip content="Delete" placement="top" theme="danger">
              <button
                className="action-btn"
                onClick={() => handleDelete(row.original)}
                disabled={loading}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
            <Tooltip content="Banners" placement="top">
              <button
                className="action-btn"
                onClick={() => handleBannersClick(row)}
              >
                <Icon icon="heroicons:bookmark-square" />
              </button>
            </Tooltip>
          </div>
        )
      }
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
    if (response?.total) setTotalCount(response.total); // Adjust based on API
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
          rowSelect={false}
          actionButton={
            <div className="flex mr-1">
              <Button
                icon="heroicons-outline:plus"
                text="Add New"
                className="bg-primary-500 text-white btn-sm h-10"
                onClick={() => setCreateModalOpen(true)}
              />
            </div>
          }
        />
      </Card>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Banner"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />

      <Modal
        activeModal={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        footerContent={null}
      >
        <EditBanner banner_type_id={editTarget} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        title="Add New Banner"
        activeModal={createModalOpen}
        footerContent={null}
        onClose={() => setCreateModalOpen(false)}
      >
        <CreateBanner
          onSuccess={() => {
            setCreateModalOpen(false);
            setRefreshKey((k) => k + 1);
          }}
          onClose={() => setCreateModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default GetBannerTypes;
