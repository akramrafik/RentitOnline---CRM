"use client";
import React, { useEffect, useState, useCallback, useTransition, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getAds, updateAdStatus } from "@/lib/api";
import debounce from "lodash.debounce";
import Switch from "@/components/ui/Switch";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import StatusCell from "./statuscell";
import CommonDropdown from "@/components/ui/Common-dropdown";
import FilterComp from "./filter";
import { formatDate } from "@fullcalendar/core";

const GetAds = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const isInternalUpdate = useRef(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [emirateId, setEmirateId] = useState("");

 const HandleClearFilter = () =>{
   setFilter("");
  setSelectedCategory(null);
  setSelectedSubCategory(null);
  setSelectedStatus(null);
  setSelectedPlan(null);
  setSelectedLocation(null);
  setStartDate(null);
  setEndDate(null);
  setPageIndex(0);
 }

 const hasActiveFilter =
  !!filter ||
  !!selectedCategory ||
  !!selectedSubCategory ||
  !!selectedStatus ||
  !!selectedPlan ||
  !!selectedLocation ||
  !!startDate ||
  !!endDate;

  // Set initial state from URL only when not triggered by internal change
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false; // reset flag
      return;
    }
    const initialSearch = searchParams.get("q") || "";
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const initialPage = isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;

    if (filter !== initialSearch) setFilter(initialSearch);
    if (pageIndex !== initialPage) setPageIndex(initialPage);
    setHasInitialized(true);
  }, [searchParams]);

  // Sync state to URL with safeguard
  useEffect(() => {
    if (!hasInitialized) return;

    const params = new URLSearchParams();
    if (filter) params.set("q", filter);
    if (pageIndex > 0) params.set("page", pageIndex + 1);

    const nextUrl = `?${params.toString()}`;
    if (nextUrl !== window.location.search) {
      isInternalUpdate.current = true; // ✅ mark as internal change
      router.replace(nextUrl);
    }
  }, [filter, pageIndex, hasInitialized]);

  // ✅ Debounced filter change
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

  // Memoized params to prevent re-renders
  const memoizedParams = useMemo(() => ({ 
    category: selectedCategory?.value || "",
  subcategory: selectedSubCategory?.value || "",
  filter: selectedStatus?.value || "",
  plan: selectedPlan?.value || "",
  location : selectedLocation?.city || "",
  start_date: startDate ? formatDate(startDate, { month: "2-digit", day: "2-digit", year: "numeric" }) : "",
  end_date: endDate ? formatDate(endDate, { month: "2-digit", day: "2-digit", year: "numeric" }) : "",
   }), [ selectedCategory, selectedSubCategory, selectedStatus, selectedPlan, startDate, endDate, selectedLocation]);


  // Table columns
  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row, value }) => {
          const plan = row.original.plan;
          const maxLength = 30;
          const displayText = value.length > maxLength ? value.slice(0, maxLength) + "..." : value;
          const expires_in = row.original.expire_within;
          const status = row.original.status;
          const normalizedPlan = plan?.toLowerCase().replace(" plan", "").trim();
          const hasPlan = !!plan;
          const planLabel = hasPlan ? `${plan}` : "No Active Plan";
          let badgeClass = "";

          switch (normalizedPlan) {
            case "basic":
              badgeClass = "bg-cyan-500 text-cyan-500 bg-opacity-[0.12]";
              break;
            case "standard":
              badgeClass = "bg-teal-500 text-teal-500 bg-opacity-[0.12]";
              break;
            case "premium":
              badgeClass = "bg-amber-500 text-amber-600 bg-opacity-[0.12]";
              break;
            default:
              badgeClass =
                "bg-slate-800 dark:bg-slate-900 dark:text-slate-300 bg-opacity-[0.12]";
              break;
          }

          return (
            <div className="flex items-start gap-1">
              <div>
                <Tooltip content={value}>
                  <span className="text-gray-800 dark:text-white mt-5 text-base font-small">
                    {displayText}
                  </span>
                </Tooltip>
                {status == "Live" && (
                  <div className="text-sm">
                    Ad Expires <span className="text-red-500">Within {expires_in} days</span>
                  </div>
                )}
              </div>
              <Badge label={planLabel} className={badgeClass} />
            </div>
          );
        },
      },
      { Header: "Posted Date", accessor: "posted_date" },
      { Header: "Expired Date", accessor: "expire_date",
        Cell: ({ value }) => (value ? value : "--"),
       },
      { Header: "Renewed Date", accessor: "renewed_date",
          Cell: ({ value }) => (value ? value : "--"),
       },
      {
  Header: "Status",
  accessor: "status",
  Cell: ({ row }) => {
    return (
    <StatusCell
        adId={row.original.id}
        statusLabel={row.original.status}
        onStatusChange={() => setRefreshKey(prev => prev + 1)}
    />
    );
  },
},
    ],
    []
  );

const fetchAds = useCallback(
  async ({ pageIndex, q }) => {
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
    }
  },
  [memoizedParams]
);



  return (
    <div className="space-y-5">
      <Card>
        {hasInitialized && (
          <BaseTable
            refreshKey={refreshKey}
            columns={columns}
            filter={filter}
            setFilter={debouncedSetFilter}
            apiCall={fetchAds}
            pageIndex={pageIndex}
            setPageIndex={(index) => startTransition(() => setPageIndex(index))}
            params={memoizedParams}
            title="Ads"
            showGlobalFilter={true}
            actionButton={
              <div className="space-xy-5 flex">
                <Button
                onClick={HandleClearFilter}
                disabled={!hasActiveFilter}
                  icon="heroicons-outline:refresh"
                  text="Clear filter"
                 className={`bg-white text-primary-500 py-1 mx-0 ${
    !hasActiveFilter ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
               
                <Button
                  icon="heroicons-outline:plus"
                  text="Add New"
                  className="bg-primary-500 text-white btn-sm h-10 my-0"
                />
                 <CommonDropdown
                  contentWrapperClass="rounded-lg filter-panel"
                  header="Filters"
  label="Filter"
  split={true}
  labelClass="btn-sm h-10 my-0 btn-outline-light"
>
<FilterComp
selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedSubCategory={selectedSubCategory}
      setSelectedSubCategory={setSelectedSubCategory}
      selectedStatus={selectedStatus}
      setSelectedStatus={setSelectedStatus}
      selectedPlan={selectedPlan}
      setSelectedPlan={setSelectedPlan}
        selectedLocation={selectedLocation}
  setSelectedLocation={setSelectedLocation}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
    setFilter={setFilter}
    setType={setType}
    setParentId={setParentId}
    emirateId={emirateId}
  setEmirateId={setEmirateId}
    reset={() => {
      setFilter('');
      setType('');
      setParentId('');
      setPageIndex(0);
    }}
  />
</CommonDropdown>

              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default GetAds;
