"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import CategoryFilter from "./filter";
import BaseTable from "@/components/partials/table/BaseTable";
import { getCategories } from "@/lib/api";

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  // Initialize state from URL only once
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1;
    setFilter(initialSearch);
    setPageIndex(isNaN(initialPage) ? 0 : initialPage);
  }, []);

  // Update the URL when state changes (not on initial render)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set("search", filter);
    if (pageIndex > 0) params.set("page", pageIndex + 1);
    router.replace(`?${params.toString()}`);
  }, [filter, pageIndex]);

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Category Name", accessor: "name" },
    { Header: "Parent Category", accessor: "parent" },
    { Header: "Description", accessor: "description" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button onClick={() => alert(`Edit ${row.original.id}`)}>Edit</button>
          <button onClick={() => alert(`Delete ${row.original.id}`)}>Delete</button>
        </div>
      ),
    },
  ];

  const fetchData = useCallback(
    async ({ pageIndex }) => {
      const params = {
        search: filter,
        page: pageIndex + 1,
      };
      console.log("Fetching data with params:", params);
      const response = await getCategories(params);
      console.log("Data fetched successfully", response);
      return response;
    },
    [filter]
  );

  return (
    <div className="space-y-5">
      <CategoryFilter />
      <Card>
        <BaseTable
          columns={columns}
          filter={filter}
          setFilter={setFilter}
          apiCall={fetchData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      </Card>
    </div>
  );
};

export default CategoriesPage;
