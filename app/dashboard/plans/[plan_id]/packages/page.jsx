"use client";

import React, { useState, useCallback, useMemo, useTransition } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getPlanPackages } from "@/lib/api";
import Button from "@/components/ui/Button";

const CategoriesPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const planId = params.plan_id; // this will be '2' if URL is /plans/2/packages


  // ✅ Initial page index from URL, default to 0
  const initialPage = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;
  }, [searchParams]);

  const [pageIndex, setPageIndex] = useState(initialPage);

  // ✅ When pageIndex changes (from UI), update URL (but NOT plan_id)
  const handlePageChange = (index) => {
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

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      { Header: "Price", accessor: "price" },
      { Header: "Cross marked price", accessor: "cross_marked_price" },
      { Header: "Duration (Days)", accessor: "duration" },
      { Header: "Ad Count", accessor: "ad_count" },
      { Header: "Refreshment Count", accessor: "refreshment_count" },
      { Header: "Saved", accessor: "saved",
         Cell: ({ value }) => (value === null ? "Null" : `AED ${value}`)
       },
      { Header: "Action", accessor: "" },
    ],
    []
  );

  // ✅ Fetch packages for given plan_id and page
  const fetchPackages = useCallback(
    async ({ pageIndex }) => {
    //   if (!planId) return { data: [], total: 0 };
      try {
        return await getPlanPackages(planId, {
          page: pageIndex + 1,
        });
      } catch (error) {
        console.error("Failed to fetch packages:", err);
        return { data: [], total: 0 };
      }
    },
    [planId]
  );

  return (
    <div className="space-y-5">
      <Card>
        <BaseTable
          columns={columns}
          apiCall={fetchPackages}
          pageIndex={pageIndex}
          setPageIndex={handlePageChange}
          params={{}}
          title="Packages"
          showGlobalFilter={false}
          actionButton={
            <Button
              icon="heroicons-outline:plus"
              text="Add New"
              className="bg-primary-500 text-white"
              link={"/dashboard/categories/create_category"}
            />
          }
        />
      </Card>
    </div>
  );
};

export default CategoriesPage;
