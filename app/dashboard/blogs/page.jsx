'use client';
import React, { useState, useMemo, useCallback, useTransition } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Swicth from "@/components/ui/Switch";
import { toast } from "react-toastify";
import BaseTable from "@/components/partials/table/BaseTable";
import debounce from "lodash.debounce";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { getAllBlogs, updateBlogStatus, deleteBlog, getBlogById  } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/partials/ConfirmPopup";

const GetBlogs = () => {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPageDataLength, setCurrentPageDataLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState(null); 
  const [loadingEditData, setLoadingEditData] = useState(false)

  // Initial page index from URL, default to 0
  const initialPage = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;
  }, [searchParams]);

  const [pageIndex, setPageIndex] = useState(initialPage);

  const handlePageChange = (index) => {
    if (index === pageIndex) return;
    startTransition(() => {
      setPageIndex(index);
      const params = new URLSearchParams(searchParams.toString());
      if (index > 0) {
        params.set("page", index + 1);
      } else {
        params.delete("page");
      }
      router.replace(`?${params.toString()}`);
    });
  };

 const handleEditClick = async (row) => {
  const blogId = row.original.id;
  setLoadingEditData(true);
  router.push(`/dashboard/blogs/edit/${blogId}`);

  // try {
  //   const blogData = await getBlogById({ id: blogId });
  //   setEditTarget(blogData);
  //   // setEditModalOpen(true);
  // } catch (error) {
  //   toast.error("Failed to load blog data");
  //   console.error(error);
  // } finally {
  //   setLoadingEditData(false);
  // }
};



  const handleDelete = (blog) => {
    setDeleteTarget(blog);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  // * CHANGED: useCallback + disabling to prevent multiple calls
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget.id);
      toast.success("Blog deleted successfully");
      setDeleteTarget(null);

      startTransition(() => {
        if (currentPageDataLength === 1 && pageIndex > 0) {
          setPageIndex(pageIndex - 1);
        } else {
          setRefreshKey((k) => k + 1);
        }
      });
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, currentPageDataLength, pageIndex]);

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
            style={{
              width: "60px",
              height: "auto",
              objectFit: "cover",
              borderRadius: "4px",
            }}
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
          const [status, setStatus] = useState(Boolean(Number(row.original.status)));
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
              <button className="action-btn" onClick={() => handleEditClick(row)} type="button">
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
              <button
              type="button"
                className="action-btn"
                onClick={() => handleDelete(row.original)}
                disabled={deleting}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [deleting]
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

  const fetchBlogs = useCallback(async ({ pageIndex }) => {
    try {
      return await getAllBlogs({
        page: pageIndex + 1,
      });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      return { data: [], total: 0 };
    }
  }, []);

  return (
    <>
      <Card>
        <BaseTable
          title="Blogs"
          columns={columns}
          apiCall={fetchBlogs}
          params={{}}
          setPageIndex={handlePageChange}
          pageIndex={pageIndex}
          setFilter={debouncedSetFilter}
          filter={filter}
          showGlobalFilter={false}
          refreshKey={refreshKey}
          onDataFetched={(data) => setCurrentPageDataLength(data.length)}
        />
      </Card>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog"
        message={`Are you sure you want to delete the blog "${deleteTarget?.id}"? This action cannot be undone.`}
        confirmDisabled={deleting} // * CHANGED - disable confirm button during delete
      />
    </>
  );
};

export default GetBlogs;
