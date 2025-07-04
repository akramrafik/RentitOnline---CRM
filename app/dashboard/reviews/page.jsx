"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useTransition,
  useMemo,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getAllReviews, changeReviewStatus, deleteReview } from "@/lib/api";
import Switch from "@/components/ui/Switch";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { format } from "date-fns";
import ConfirmDialog from "@/components/partials/ConfirmPopup";

const StatusCell = React.memo(({ row }) => {
  const [status, setStatus] = useState(!!Number(row.original.status));
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await changeReviewStatus(row.original.id);
      if (response.status) {
        setStatus(!!Number(response.data.status));
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("An error occurred while updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      value={status}
      onChange={handleToggle}
      badge
      disabled={loading}
      prevIcon="heroicons-outline:check"
      nextIcon="heroicons-outline:x"
      activeClass="bg-primary-500"
    />
  );
});

const ReviewPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [, startTransition] = useTransition();
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const initialSearch = searchParams.get("filter") || "";
    const initialPage = parseInt(searchParams.get("page"), 10);
    setFilter(initialSearch);
    setPageIndex(isNaN(initialPage) ? 0 : initialPage - 1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.trim()) params.set("filter", filter.trim());
    if (pageIndex > 0) params.set("page", String(pageIndex + 1));
    router.replace(`?${params.toString()}`);
  }, [filter, pageIndex, router]);

  const debouncedSetFilter = useMemo(
    () => debounce((value) => {
      startTransition(() => {
        setPageIndex(0);
        setFilter(value);
      });
    }, 300),
    []
  );

  const columns = useMemo(() => [
    { Header: "Id", accessor: "id" },
    { Header: "Ad Title", accessor: "ad_title", sticky: "left",
      className: "bg-white z-10"},
    { Header: "Vendor Name", accessor: "vendor_name" },
    {
      Header: "Reviewer Name",
      accessor: "reviewer_name",
      Cell: ({ value }) => value?.trim() || "-- --",
    },
    { Header: "Reviewer Email", accessor: "email" },
    { Header: "Reviewer Mobile", accessor: "mobile" },
    {
      Header: "Review",
      accessor: "comment",
      className: "min-w-[500px]",
      Cell: ({ value }) => {
        const [expanded, setExpanded] = useState(false);
        const shouldTruncate = value?.length > 100;

        return (
          <div className="min-w-[500px]">
            <p className="whitespace-pre-line text-sm text-gray-700">
              {expanded || !shouldTruncate ? value : `${value.slice(0, 100)}...`}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-primary-500 text-xs mt-1 underline"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      Header: "Rating",
      accessor: "rating",
      Cell: ({ value }) => {
        const rating = Math.round(Number(value));
        return (
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Icon
                key={i}
                icon={i <= rating ? "heroicons:star-solid" : "heroicons:star"}
                className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        );
      },
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }) => {
        try {
          return value ? format(new Date(value), "PPpp") : "-- --";
        } catch {
          return "-- --";
        }
      },
    },
    { Header: "Status", accessor: "status", Cell: StatusCell },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Tooltip content="Delete" theme="danger">
            <button
              className="action-btn"
              onClick={() => {
                setSelectedItem(row.original);
                setActionType("delete");
              }}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    if (!selectedItem) return;
    if (actionType === "edit") router.push(`/dashboard/categories/${selectedItem.id}/edit`);
    if (actionType === "specs") router.push(`/dashboard/categories/${selectedItem.id}/specification-groups`);
    if (actionType === "faqs") router.push(`/dashboard/categories/${selectedItem.id}/faqs`);
  }, [selectedItem, actionType, router]);

  const fetchReviewData = useCallback(async ({ pageIndex }) => {
    try {
      return await getAllReviews({ filter, page: pageIndex + 1 });
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      return { data: [], total: 0 };
    }
  }, [filter]);

  const handleDeleteCancel = () => {
    setSelectedItem(null);
    setActionType("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem || actionType !== "delete") return;
    setDeleting(true);
    try {
      const res = await deleteReview(selectedItem.id);
      if (res?.status === true) {
        toast.success("Review deleted successfully");
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setSelectedItem(null);
      setActionType("");
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <BaseTable
          columns={columns}
          filter={filter}
          setFilter={debouncedSetFilter}
          apiCall={fetchReviewData}
          pageIndex={pageIndex}
          setPageIndex={(index) => startTransition(() => setPageIndex(index))}
          params={{}}
          title="Reviews"
          showGlobalFilter={true}
          rowSelect={false}
        />
      </Card>
      <ConfirmDialog
        isOpen={actionType === "delete" && !!selectedItem}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message={`Are you sure you want to delete the review \"${selectedItem?.name || selectedItem?.id}\"? This action cannot be undone.`}
        confirmDisabled={loading || deleting}
      />
    </div>
  );
};

export default ReviewPage;