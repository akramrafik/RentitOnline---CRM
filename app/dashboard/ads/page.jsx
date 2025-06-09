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

  // ✅ Added ref to prevent feedback loop
  const isInternalUpdate = useRef(false);

  // ✅ Set initial state from URL only when not triggered by internal change
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

  // ✅ Sync state to URL with safeguard
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

  // ✅ Memoized params to prevent re-renders
  const memoizedParams = useMemo(() => ({ type }), [type]);

  // ✅ Table columns
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
    };

    try {
      return await getAds("", params);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      return { data: [], total: 0 };
    }
  },
  []
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
            params={memoizedParams} // ✅ use memoized params
            title="Ads"
            showGlobalFilter={true}
            actionButton={
              <div className="space-xy-5">
                <Button
                  icon="heroicons-outline:refresh"
                  text="Clear filter"
                  className={`bg-white text-primary-500 ${
                    !filter && !type && !parentId ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    setFilter("");
                    setType("");
                    setParentId("");
                    setPageIndex(0);
                  }}
                  disabled={!filter && !type && !parentId}
                />
                <Button
                  icon="heroicons-outline:plus"
                  text="Add New"
                  className="bg-primary-500 text-white"
                  link="/dashboard/categories/create_category"
                />
              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default GetAds;
