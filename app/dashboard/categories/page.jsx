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
import CategoryFilter from "./filter";
import { getCategories, updateCategoryStatus, deleteCategory } from "@/lib/api";
import Switch from "@/components/ui/Switch";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import CommonDropdown from "@/components/ui/Common-dropdown";
import ConfirmDialog from "@/components/partials/ConfirmPopup";

// Memoized status cell for performance
const StatusCell = React.memo(({ row }) => {
 const [status, setStatus] = useState(Boolean(Number(row.original.status)));
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await updateCategoryStatus(row.original.id);
      if (response.status) {
        setStatus(Boolean(Number(response.data.status)));
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

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [type, setType] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [, startTransition] = useTransition();
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);



  // Initialize state from URL params
 useEffect(() => {
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1;
  const initialType = searchParams.get("type") || "";
  const initialParentId = searchParams.get("parent") || "";

  setFilter(initialSearch);
  setPageIndex(isNaN(initialPage) ? 0 : initialPage);
  setType(initialType);
  setParentId(initialParentId);
}, []);


  // Sync URL when state changes
useEffect(() => {
  const params = new URLSearchParams();
  if (filter.trim()) params.set("search", filter.trim());
  if (type) params.set("type", type);
  if (pageIndex > 0) params.set("page", String(pageIndex + 1));
  if (parentId) params.set("parent", parentId);
  router.replace(`?${params.toString()}`);
}, [filter, pageIndex, type, parentId]);


  // Fetch parent categories (for filter dropdown)
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await getCategories({ only_parents: true });
        setCategories(res.data || []);
      } catch (e) {
        console.error("Failed to fetch parent categories", e);
      }
    };
    fetchParentCategories();
  }, []);

  // Debounced filter setter
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

  // Define columns
  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      { Header: "Category Name", accessor: "name" },
      {
        Header: "Parent",
        accessor: "parent",
        Cell: ({ value }) => value ?? "Main Category",
      },
      { Header: "Description", accessor: "description" },
      { Header: "Status", accessor: "status", Cell: StatusCell },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content="Edit">
              <button
                className="action-btn"
                onClick={() => {
                  setSelectedItem(row.original);
                  setActionType("edit");
                }}
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
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
            <Tooltip content="Specifications">
              <button className="action-btn"
               onClick={() => {
                setSelectedItem(row.original);
                setActionType("specs");
               }}
               >
                <Icon icon="heroicons:document-text" />
              </button>
            </Tooltip>
            <Tooltip content="FAQ">
              <button className="action-btn"
              onClick={() => {
                setSelectedItem(row.original);
                setActionType("faqs");
              }}
              >
                <Icon icon="heroicons:circle-stack" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  // action
  useEffect(() => {
  if (!selectedItem) return;

  if (actionType === "edit") {
    router.push(`/dashboard/categories/${selectedItem.id}/edit`);
  } else if (actionType === "specs") {
    router.push(`/dashboard/categories/${selectedItem.id}/specification-groups`);
  } else if (actionType === "faqs") {
    router.push(`/dashboard/categories/${selectedItem.id}/faqs`);
  }
}, [selectedItem, actionType]);


  // API call to fetch category list
  const fetchCategoryData = useCallback(
    async ({ pageIndex }) => {
      const params = {
        search: filter,
        page: pageIndex + 1,
        type,
        parent: parentId,
      };
      try {
        return await getCategories(params);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        return { data: [], total: 0 };
      }
    },
    [filter, type, parentId]
  );

  // handleDeleteCancel
  const handleDeleteCancel = () => {
  setSelectedItem(null);
  setActionType("");
};
const handleDeleteConfirm = async () => {
 if (!selectedItem || actionType !== "delete") return;
  setDeleting(true);
  try {
   const res = await deleteCategory(selectedItem.id);
    if (res?.status === true) {
      toast.success("Category deleted successfully");
    } else {
      toast.error("Failed to delete category");
    }
  } catch (err) {
    toast.error("An error occurred during deletion");
    console.error("Delete error:", err);
  } finally {
    setLoading(false);
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
          apiCall={fetchCategoryData}
          pageIndex={pageIndex}
          setPageIndex={(index) => startTransition(() => setPageIndex(index))}
          params={{ type }}
          title="Categories"
          showGlobalFilter={true}
          rowSelect={false}
          actionButton={
            <div className="space-xy-5 flex mr-2">
              <Button
                icon="heroicons-outline:refresh"
                text="Clear filter"
                className={`bg-white text-primary-500 ${
                  !filter.trim() && !type && !parentId
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  setFilter("");
                  setType("");
                  setParentId("");
                  setPageIndex(0);
                }}
                disabled={!filter.trim() && !type && !parentId}
              />
              <CommonDropdown
                contentWrapperClass="rounded-lg filter-panel"
                header="Filters"
                label="Filter"
                split
                labelClass="btn-sm h-10 my-0 btn-outline-light"
              >
                <CategoryFilter
                  onSearch={debouncedSetFilter}
                  type={type}
                  setType={setType}
                  parentId={parentId}
                  setParentId={setParentId}
                  parentCategories={categories}
                />
              </CommonDropdown>
              <Button
                icon="heroicons-outline:plus"
                text="Add New"
                className="bg-primary-500 text-white btn-sm h-10 my-0"
                link="/dashboard/categories/create_category"
              />
            </div>
          }
        />
        
      </Card>
      <ConfirmDialog
isOpen={actionType === "delete" && !!selectedItem}
  onClose={handleDeleteCancel}
  onConfirm={handleDeleteConfirm}
  title="Delete Category"
 message={`Are you sure you want to delete the category "${selectedItem?.name}"? This action cannot be undone.`}
  confirmDisabled={loading}
/>
    </div>
  );
};

export default CategoriesPage;
