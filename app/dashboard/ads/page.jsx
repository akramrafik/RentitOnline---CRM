"use client";
import React, { useEffect, useState, useCallback, useTransition, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getAds, deleteAd } from "@/lib/api";
import debounce from "lodash.debounce";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusCell from "./statuscell";
import CommonDropdown from "@/components/ui/Common-dropdown";
import FilterComp from "./filter";
import { format } from "date-fns";
import Toolbar from "@/components/partials/Toolbar";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/partials/ConfirmPopup";
import Link from "next/link";

const GetAds = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [emirateId, setEmirateId] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const isInternalUpdate = useRef(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  
  const handleDelete = (rows) => {
    setDeleteTarget(rows)
  };

  const handleDeleteConfirm = useCallback( async () => {
      if (!deleteTarget || deleteTarget.length === 0) return;
      try {
        const ids = deleteTarget.map((row) => row.id);
        await deleteAd(ids);
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
    label: "Details",
    icon: "heroicons-outline:view-boards",
    allowMultiple: false,
    onClick: () => {
      if (selectedRows.length !== 1) {
        toast.warn("Please select exactly one ad to view details.");
        return;
      }
      const id = selectedRows[0].id;
      router.push(`/dashboard/ads/details/${id}`);
    }
  },
    { 
      label: "Listings", 
      icon: "heroicons-outline:document-text",
      allowMultiple: false 
    },
    { 
      label: "Clicks",
      icon: "heroicons-outline:check-circle",
      allowMultiple: false 
    },
    { 
      label: "Edit",
      icon: "heroicons-outline:pencil-alt",
      allowMultiple: false 
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
    { 
      label: "Export",
      icon: "heroicons-outline:download",
      allowMultiple: true 
    },
  ], [selectedRows, handleDelete]);

  const handleClearSelection = () => setSelectedRows([]);

  const handleClearFilter  = () => {
    setFilter("");
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedStatus(null);
    setSelectedPlan(null);
    setSelectedLocation(null);
    setStartDate(null);
    setEndDate(null);
    setPageIndex(0);
  };

  const hasActiveFilter = !!filter || !!selectedCategory || !!selectedSubCategory || !!selectedStatus || !!selectedPlan || !!selectedLocation || !!startDate || !!endDate;

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
    const params = new URLSearchParams();
    if (filter) params.set("q", filter);
    if (pageIndex > 0) params.set("page", pageIndex + 1);
    if (selectedCategory?.value) params.set("category", selectedCategory.value); // ✅ fixed typo
    if (selectedSubCategory?.value) params.set("subcategory", selectedSubCategory.value);
    if (selectedStatus?.value) params.set("filter", selectedStatus.value);
    if (selectedPlan?.value) params.set("plan", selectedPlan.value);
    if (selectedLocation?.city) params.set("location", selectedLocation.city);
    if (startDate) params.set("start_date", format(startDate, "dd-MM-yyyy"));
    if (endDate) params.set("end_date", format(endDate, "dd-MM-yyyy"));
    const nextUrl = `?${params.toString()}`;
    if (nextUrl !== window.location.search) {
      isInternalUpdate.current = true;
      router.replace(nextUrl);
    }
  }, [filter, pageIndex, selectedCategory, selectedSubCategory, selectedStatus, selectedPlan, selectedLocation, startDate, endDate, hasInitialized]);

  const debouncedSetFilter = useMemo(() => debounce((value) => {
    startTransition(() => {
      setPageIndex(0);
      setFilter(value);
    });
  }, 300), []);

  useEffect(() => () => debouncedSetFilter.cancel(), []); // cleanup debounce

  const memoizedParams = useMemo(() => ({
    category: selectedCategory?.value || "",
    subcategory: selectedSubCategory?.value || "",
    filter: selectedStatus?.value || "",
    plan: selectedPlan?.value || "",
    location: selectedLocation?.city || "",
    start_date: startDate ? format(startDate, "dd-MM-yyyy") : "",
    end_date: endDate ? format(endDate, "dd-MM-yyyy") : "",
  }), [selectedCategory, selectedSubCategory, selectedStatus, selectedPlan, selectedLocation, startDate, endDate]);

  const columns = useMemo(() => [
    { Header: "Id", accessor: "id" },
    {
      Header: "Title",
      accessor: "title",
      Cell: ({ row, value }) => {
        const plan = row.original.plan;
        const maxLength = 25;
        const displayText = value.length > maxLength ? value.slice(0, maxLength) + "..." : value;
        const expires_in = row.original.expire_within;
        const status = row.original.status;
        const normalizedPlan = plan?.toLowerCase().replace(" plan", "").trim();
        const hasPlan = !!plan;
        const planLabel = hasPlan ? `${plan}` : "No Active Plan";
        let badgeClass = "";
        switch (normalizedPlan) {
          case "basic": badgeClass = "bg-cyan-500 text-cyan-500 bg-opacity-[0.12]"; break;
          case "standard": badgeClass = "bg-teal-500 text-teal-500 bg-opacity-[0.12]"; break;
          case "premium": badgeClass = "bg-amber-500 text-amber-600 bg-opacity-[0.12]"; break;
          default: badgeClass = "bg-slate-800 dark:bg-slate-900 dark:text-slate-300 bg-opacity-[0.12]"; break;
        }
        const onClickTitle = () => {
          router.push(`/dashboard/ads/details/${row.original.id}`);
        };
        return (
          <div className="flex items-start gap-1 cursor-pointer" onClick={onClickTitle}>
            <div>
              <Tooltip content={value}>
                <span className="text-gray-800 dark:text-white mt-5 text-base font-small">{displayText}</span>
              </Tooltip>
              {status === "Live" && <div className="text-sm">Ad Expires <span className="text-red-500">Within {expires_in} days</span></div>}
            </div>
            <Badge label={planLabel} className={badgeClass} />
          </div>
        );
      },
    },
    { Header: "Posted Date", accessor: "posted_date" },
    { Header: "Expired Date", accessor: "expire_date", Cell: ({ value }) => value || "--" },
    { Header: "Renewed Date", accessor: "renewed_date", Cell: ({ value }) => value || "--" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => <StatusCell adId={row.original.id} statusLabel={row.original.status} onStatusChange={() => setRefreshKey(prev => prev + 1)} />,
    },
  ], []);

  const fetchAds = useCallback(async ({ pageIndex, q }) => {
    setLoading(true);
    const params = {
      page: pageIndex + 1,
      ...(q ? { q } : {}),
      ...memoizedParams,
    };
    try {
      return await getAds("", params);
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
            apiCall={fetchAds}
            pageIndex={pageIndex}
            setPageIndex={(index) => startTransition(() => setPageIndex(index))}
            params={memoizedParams}
            title="Ads"
            showGlobalFilter
            actionButton={(
              <div className="space-x-5 flex">
                <Button
                  onClick={handleClearFilter }
                  disabled={!hasActiveFilter}
                  icon="heroicons-outline:refresh"
                  text="Clear filter"
                  className={`bg-white text-primary-500 py-1 mx-0 ${!hasActiveFilter ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                {/* <Button icon="heroicons-outline:plus" text="Add New" className="bg-primary-500 text-white btn-sm h-10 my-0" /> */}
                <CommonDropdown contentWrapperClass="rounded-lg filter-panel" header="Filters" label="Filter" split labelClass="btn-sm h-10 my-0 btn-outline-light">
                  <FilterComp
                    selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                    selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory}
                    selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                    selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}
                    selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                    setFilter={setFilter} emirateId={emirateId} setEmirateId={setEmirateId}
                    reset={() => { setFilter(''); setPageIndex(0); }}
                  />
                </CommonDropdown>
              </div>
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
  title={`Delete ${deleteTarget?.length || 0} Ad(s)`}
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

export default GetAds;