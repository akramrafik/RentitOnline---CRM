"use client";
import React, { useEffect, useState, useCallback, useTransition, useMemo, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import CategoryFilter from "./filter";
import BaseTable from "@/components/partials/table/BaseTable";
import { getCategories, updateCategoryStatus } from "@/lib/api";
import debounce from "lodash.debounce";
import Swicth from "@/components/ui/Switch";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { set } from "react-hook-form";
import Button from "@/components/ui/Button";

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  // Set initial state from URL
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1;
    const initialType = searchParams.get("type") || "";
    const initialParentId = searchParams.get("parent") || "";
    setFilter(initialSearch);
    setPageIndex(isNaN(initialPage) ? 0 : initialPage);
    setType(initialType);
    setParentId(initialParentId);
    setHasInitialized(true);
  }, []);

 

  // Update URL when filter or pageIndex changes
  useEffect(() => {
    if (!hasInitialized) return;
    const params = new URLSearchParams();
    if (filter) params.set("search", filter);
    if (type) params.set("type", type);
    if (pageIndex > 0) params.set("page", pageIndex + 1);
    if (parentId) params.set("parent", parentId);
    router.replace(`?${params.toString()}`);
  }, [filter, pageIndex, type, hasInitialized, router, parentId]);

  // Debounced filter change
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

  // Table columns
  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      { Header: "Category Name", accessor: "name" },
      { Header: "Parent", accessor: "parent",
        Cell: ({ value }) => value ?? "Main Category",
       },
      { Header: "Description", accessor: "description" },
      {
  Header: "Status",
accessor: "status",
Cell: ({ row }) => {
  const [status, setStatus] = useState(() => Boolean(Number(row.original.status)));
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    alert('category status: ' + row.original.status);
    try {
      const response = await updateCategoryStatus(row.original.id);
      if (response.status) {
        setStatus(Boolean(Number(response.data.status))); // ensure it's boolean
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
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
      activeClass="bg-green-500"
    />
  );
},
},
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content="Edit" placement="top" arrow animation="shift-away"><button className="action-btn" onClick={() => alert(`Edit ${row.original.id}`)}><Icon icon="heroicons:pencil-square"/></button></Tooltip>
            <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="danger"><button className="action-btn" onClick={() => alert(`Delete ${row.original.id}`)}><Icon icon="heroicons:trash" /></button></Tooltip>
            <Tooltip content="Specifications" placement="top" arrow animation="shift-away"><button className="action-btn"><Icon icon="heroicons:document-text" /></button></Tooltip>
            <Tooltip content="FAQ" placement="top" arrow animation="shift-away"><button className="action-btn"><Icon icon="heroicons:circle-stack" /></button></Tooltip>
          </div>
        ),
      },
    ],
    []
  );
  // API call
  const fetchCategoryData = useCallback(
    async ({ pageIndex }) => {
      const params = {
        search: filter,
        page: pageIndex + 1,
        type: type,
        parent: parentId,
      };
      const response = await getCategories(params);
      return response;
    },
    [filter,type, parentId]
  );

  return (
    <div className="space-y-5">
      <CategoryFilter 
      onSearch={debouncedSetFilter} 
      type={type}
      setType={setType}
      parentId={parentId}
  setParentId={setParentId}
  parentCategories={categories}
      />
      <Card>
        <BaseTable
          columns={columns}
          filter={filter}
          setFilter={debouncedSetFilter}
          apiCall={fetchCategoryData}
          pageIndex={pageIndex}
          setPageIndex={(index) => startTransition(() => setPageIndex(index))}
          params={{ type }}
          title="Categories"
          showGlobalFilter={false}
          actionButton={
            <div className="space-xy-5">
             <Button
  icon="heroicons-outline:refresh"
  text="Clear filter"
  className={`bg-white text-primary-500 ${
    !filter && !type && !parentId ? 'opacity-50 cursor-not-allowed' : ''
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
      link={"/dashboard/categories/create_category"}
      //onClick={() => alert("Add New Category")}
    />
    </div>
  }
        />
      </Card>
    </div>
  );
};

export default CategoriesPage;