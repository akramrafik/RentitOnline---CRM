"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

import Card from "@/components/ui/Card";
import Swicth from "@/components/ui/Switch";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/partials/ConfirmPopup";
import BaseTable from "@/components/partials/table/BaseTable";
import {getCustomersList,updateCustomerStatus, deleteCustomer } from "@/lib/api";
import EditCustomer from "./edit_customer";

const CustomerList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);
  const isInternalUpdate = useRef(false);
  const [isPending, startTransition] = useTransition();

  const memoParams = useMemo(() => ({}), []);

  // 1. URL params => state on load
  useEffect(() => {
    const initialSearch = searchParams.get("q") || "";
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const initialPage = isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;

    setFilter(initialSearch);
    setPageIndex(initialPage);
    setHasInitialized(true);
  }, [searchParams]);

  // 2. State => URL sync
  useEffect(() => {
    if (!hasInitialized || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filter) params.set("q", filter);
    if (pageIndex > 0) params.set("page", String(pageIndex + 1));

    const nextUrl = `?${params.toString()}`;
    if (nextUrl !== window.location.search) {
      isInternalUpdate.current = true;
      router.replace(nextUrl);
    }
  }, [filter, pageIndex, hasInitialized]);

  // 3. Debounced filter setter
  const debouncedSetFilter = useMemo(() => {
    return debounce((value) => {
      startTransition(() => {
        setPageIndex(0);
        setFilter(value);
      });
    }, 300);
  }, []);

  useEffect(() => () => debouncedSetFilter.cancel(), []);

  // 4. Fetch function
  const fetchCustomers = useCallback(async ({ pageIndex, q }) => {
    setLoading(true);
    const params = { page: pageIndex + 1 };
    if (q) params.q = q;

    try {
      return await getCustomersList(params);
    } catch (err) {
      console.error("Failed to fetch Customers:", err);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      // Assume deletePlan exists
      await deleteCustomer(deleteTarget.id);
      toast.success("Customer deleted successfully");
      setDeleteTarget(null);

      startTransition(() => {
        pageIndex === 0
          ? setRefreshKey((k) => k + 1)
          : setPageIndex(0);
      });
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      { Header: "Name", accessor: "first_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone number", accessor: "mobile" },
      {
        Header: "Register Date",
        accessor: "register_date",
        Cell: ({ value }) => {
          if (!value) return "-";
          return format(new Date(value), "dd MMM yyyy hh:mm a");
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const [status, setStatus] = useState(() =>
            Boolean(Number(row.original.status))
          );
          const [loading, setLoading] = useState(false);

          const handleToggle = async () => {
            setLoading(true);
            try {
              const response = await updateCustomerStatus(row.original.id);
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
              disabled={loading}
              prevIcon="heroicons-outline:check"
              nextIcon="heroicons-outline:x"
            />
          );
        },
      },
      {
        Header: "Action",
        accessor: "",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip content="Edit">
              <button
                className="action-btn"
                onClick={() => {
                  setEditCustomerId(row.original.id)
                  setEditTarget(row.original.first_name);
                  setEditModalOpen(true);
                }}
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip content="Delete" theme="danger">
              <button
                className="action-btn"
                onClick={() => setDeleteTarget(row.original)}
                disabled={loading}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
            <Tooltip content="Packages">
              <button
                className="action-btn"
                onClick={() =>
                  router.push(`/dashboard/plans/${row.original.id}/packages`)
                }
              >
                <Icon icon="heroicons:circle-stack" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [loading]
  );

  return (
    <>
      <Card>
        <BaseTable
          title="Customers"
          columns={columns}
          apiCall={fetchCustomers}
          params={memoParams}
          pageIndex={pageIndex}
          setPageIndex={(index) => startTransition(() => setPageIndex(index))}
          filter={filter}
          setFilter={debouncedSetFilter}
          showGlobalFilter
          refreshKey={refreshKey}
        />
      </Card>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.first_name}"?`}
      />

      <Modal
        title={`Edit ${editTarget}`}
        activeModal={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        footerContent={null}
      >
        <EditCustomer 
        id={editCustomerId}
          onSuccess={() => {
      setEditModalOpen(false);
      setRefreshKey((k) => k + 1);
    }}
        />
      </Modal>
    </>
  );
};

export default CustomerList;
