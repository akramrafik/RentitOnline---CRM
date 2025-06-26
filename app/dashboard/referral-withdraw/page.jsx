"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getReferralWithdraw } from "@/lib/api";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import StatusCell from "./statuscell";

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

const GetReferralWithdrawList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const isInternalUpdate = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClearFilter = () => {
    setFilter("");
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
  }, [filter, pageIndex, hasInitialized]);

  const debouncedSetFilter = useMemo(() => debounce((value) => {
    startTransition(() => {
      setPageIndex(0);
      setFilter(value);
    });
  }, 300), []);

  useEffect(() => () => debouncedSetFilter.cancel(), []); // Cleanup

  const memoizedParams = useMemo(() => ({}), []);

  const columns = useMemo(() => [
    { Header: "Id", accessor: "id" },
    { Header: "Redeem Amount", accessor: "amount" },
    {
      Header: "Request Date", accessor: "request_date",
      Cell: ({ value }) => {
        if (!value) return "-";
        return format(new Date(value), "dd MMM yyyy hh:mm a");
      },
    },
    {
      Header: "Transaction Date", accessor: "transaction_date",
      Cell: ({ value }) => {
        if (!value) return "-";
        return format(new Date(value), "dd MMM yyyy hh:mm a");
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => <StatusCell referral_id={row.original.id} statusLabel={row.original.status} onStatusChange={() => setRefreshKey((prev) => prev + 1)}
 />,
    },
  ], []);

  const fetchRefferalWithdraw = useCallback(async ({ pageIndex, q }) => {
    setLoading(true);
    const params = {
      page: pageIndex + 1,
      ...(q ? { q } : {}),
      ...memoizedParams,
    };
    try {
      return await getReferralWithdraw("", params);
    } catch (err) {
      console.error("Failed to fetch data:", err);
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
            refreshKey={refreshKey}
            columns={columns}
            filter={filter}
            setFilter={debouncedSetFilter}
            apiCall={fetchRefferalWithdraw}
            pageIndex={pageIndex}
            setPageIndex={(index) => startTransition(() => setPageIndex(index))}
            params={memoizedParams}
            title="Referral Withdraw"
            showGlobalFilter
          />
        )}
      </Card>
    </div>
  );
};

export default GetReferralWithdrawList;
