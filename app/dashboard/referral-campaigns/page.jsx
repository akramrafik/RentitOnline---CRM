"use client";
import React, { useEffect, useState, useCallback, useTransition, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getAllReferrals, deleteReferralById, updateReferralStatus} from "@/lib/api";
import debounce from "lodash.debounce";
import Tooltip from "@/components/ui/Tooltip";
import Swicth from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CommonDropdown from "@/components/ui/Common-dropdown";
import { format } from "date-fns";
import Toolbar from "@/components/partials/Toolbar";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/partials/ConfirmPopup";

const GetReferralCampaigns = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const isInternalUpdate = useRef(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const referralTypeStyles = {
  "Place Ad": "bg-blue-100 text-blue-800",
  "Register": "bg-green-100 text-green-800",
};
const ReferralTypeBadge = ({ label }) => {
  const style = referralTypeStyles[label] || "bg-slate-100 text-slate-800";
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${style}`}>
      {label}
    </span>
  );
};

  
  const handleDelete = (rows) => {
    setDeleteTarget(rows)
  };

  const handleDeleteConfirm = useCallback( async () => {
      if (!deleteTarget || deleteTarget.length === 0) return;
      try {
        const ids = deleteTarget.map((row) => row.id);
        await deleteReferralById(ids);
        toast.success(`${ids.length} ad(s) deleted successfully`);
        setDeleteTarget(null);
        setSelectedRows([]); 
        startTransition(() => {
          if (pageIndex === 0) {
            setRefreshKey((k) => k + 1);
          } else {
            setPageIndex(0);
          }
        });
      } catch (error) {
       toast.error("Failed to delete selected ads");
      }
    }, [deleteTarget, pageIndex, router, toast]);
  
    const handleDeleteCancel = () => {
      setDeleteTarget(null);
    };



  const toolbarActions = useMemo(() => [
    { 
      label: "Edit",
      icon: "heroicons-outline:pencil-alt",
      allowMultiple: false,
      onClick: () => {
        if(selectedRows.length !== 1){
          toast.warn("Please select exactly one ad to edit");
          return;
        }
        const id = selectedRows[0].id;
        router.push(`/dashboard/referral-campaigns/edit/${id}`)
      }
    },
    {
  label: "Delete",
  icon: "heroicons-outline:trash",
  allowMultiple: true,
  onClick: () => {
    if (selectedRows.length === 0) {
      toast.warn("Please select at least one ad to delete.");
      return;
    }
    handleDelete(selectedRows);
  },
},
  ], [selectedRows, handleDelete]);

  const handleClearSelection = () => setSelectedRows([]);

  const handleClearFilter  = () => {
    setFilter("");;
    setPageIndex(0);
  };

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const initialSearch = searchParams.get("q") || "";
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const initialPage = isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;
    if (filter !== initialSearch) setFilter(initialSearch);
    if (pageIndex !== initialPage) setPageIndex(initialPage);
    setHasInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    if (!hasInitialized) return;
    const params = new URLSearchParams(window.location.search);
    if (filter) {
    params.set("q", filter);
  } else {
    params.delete("q");
  }
    if (pageIndex > 0) {
    params.set("page", String(pageIndex + 1));
  } else {
    params.delete("page");
  }
   
    const nextUrl = `?${params.toString()}`;
    if (nextUrl !== window.location.search) {
      isInternalUpdate.current = true;
      router.replace(nextUrl);
    }
  }, [filter, pageIndex,hasInitialized]);

  const debouncedSetFilter = useMemo(() => debounce((value) => {
    startTransition(() => {
      setPageIndex(0);
      setFilter(value);
    });
  }, 300), []);

  useEffect(() => () => debouncedSetFilter.cancel(), []); // cleanup debounce

  const memoizedParams = useMemo(() => ({
  }), []);

  const columns = useMemo(() => [
    { Header: "Id", accessor: "id" },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row }) => {
    const name = row.original.name;
    const isDeleted = row.original.is_deleted;

    return (
      <div className="flex items-center gap-2">
        <span>{name}</span>
        {isDeleted === 1 && (
          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
            Deleted
          </span>
        )}
      </div>
    );
  },
    },
    { Header: "Headline", accessor: "headline", Cell: ({ value }) => value || "--" },
    { Header: "Created Date", accessor: "created_at",
         Cell: ({ value }) => {
                  if (!value) return "-";
                  return format(new Date(value), "dd MMM yyyy hh:mm a");
                },
    },
    { Header: "Referral Type", accessor: "type_label",
        Cell: ({ value }) => <ReferralTypeBadge label={value} />      
    },
    {
  Header: "Status",
  accessor: "status",
  Cell: ({ row }) => {
    const isDeleted = row.original.is_deleted === 1;

    const [status, setStatus] = useState(() =>
      isDeleted ? false : Boolean(Number(row.original.status))
    );
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
      if (isDeleted) {
        toast.info("Deleted program");
        return;
      }

      setLoading(true);
      try {
        const response = await updateReferralStatus(row.original.id);
        if (response.status) {
          setStatus(Boolean(Number(response.data.status)));
          toast.success("Status updated successfully");
        } else {
          toast.error("Failed to update status");
        }
      } catch (err) {
        toast.error("Error updating status");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Swicth
        value={status}
        onChange={handleToggle}
        badge
        disabled={loading || isDeleted}
        prevIcon="heroicons-outline:check"
        nextIcon="heroicons-outline:x"
      />
    );
  },
}

  ], []);

  const fetchRefferals = useCallback(async ({ pageIndex, q }) => {
    setLoading(true);
    const params = {
      page: pageIndex + 1,
      ...(q ? { q } : {}),
      ...memoizedParams,
    };
    try {
      return await getAllReferrals("", params);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [memoizedParams]);

  return (
    <div className="space-y-5 relative">
      <Card>
        {hasInitialized && (
          <BaseTable
            rowSelect
            onSelectionChange={setSelectedRows}
            refreshKey={refreshKey}
            columns={columns}
            filter={filter}
            setFilter={debouncedSetFilter}
            apiCall={fetchRefferals}
            pageIndex={pageIndex}
            setPageIndex={(index) => startTransition(() => setPageIndex(index))}
            params={memoizedParams}
            title="Referral Programs"
            showGlobalFilter
            actionButton={(
             <Button
              icon="heroicons-outline:plus"
              text="Create New"
              className="bg-primary-500 text-white btn-sm mr-2"
              onClick={() => router.push("/dashboard/referral-campaigns/create")}
             />
            )}
          />
        )}
      </Card>
      {!loading && (
        <Toolbar
          selectedCount={selectedRows.length}
          actions={toolbarActions}
          onClear={handleClearSelection}
        />
      )}
      <ConfirmDialog
  isOpen={!!deleteTarget}
  onClose={handleDeleteCancel}
  onConfirm={handleDeleteConfirm}
  title={`Delete ${deleteTarget?.length || 0} Referral Program(s)`}
 message={
  Array.isArray(deleteTarget) && deleteTarget.length === 1
    ? `Are you sure you want to delete the ad "${deleteTarget[0]?.title}"?`
    : Array.isArray(deleteTarget) && deleteTarget.length > 1
    ? `Are you sure you want to delete the following ${deleteTarget.length} ads?\n\n${deleteTarget
        .map((row) => `• ${row.title} (${row.id})`)
        .join("\n")}\n\nThis action cannot be undone.`
    : ""
}

/>

    </div>
  );
};

export default GetReferralCampaigns;