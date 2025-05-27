"use client";

import React, { useState, useCallback, useMemo, useTransition } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { getPlanPackages, deletePackage } from "@/lib/api";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import ConfirmDialog from "@/components/partials/ConfirmPopup";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import EditPlan from "../../edit_plan";

const CategoriesPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const planId = params.plan_id; 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false)
  
  const handleEdit = (row) =>{
    const id = row.original.id;
    setEditTarget(id);
  }

const handleDelete = (row) => {
  const id = row.original.id;
  setDeleteTarget(id);
};

const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };
  // Initial page index from URL, default to 0
  const initialPage = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;
  }, [searchParams]);

  const [pageIndex, setPageIndex] = useState(initialPage);

  const handlePageChange = (index) => {
    if (index === pageIndex) return;
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
      { Header: "Action", accessor: "",
        Cell: ({row}) => (
          <div className="flex gap-2">
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button
            type="button" 
            onClick={() => {
              // setEditTarget(row.original.id)
              handleEdit(row);
              setEditModalOpen(true);
            }}
            className="action-btn"
            > <Icon icon="heroicons:pencil-square" /></button>
          </Tooltip>
          <Tooltip content="Delete" placement="top" arrow animation="shift-away">
            <button
            type="button" 
              onClick={() => handleDelete(row)}
            className="action-btn"
            > <Icon icon="heroicons:trash" /></button>
          </Tooltip>
          </div>
        ),
       },
    ],
    [handleEdit, handleDelete]
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
        console.error("Failed to fetch packages:", error);
        return { data: [], total: 0 };
      }
    },
    [planId]
  );

  const handleDeleteConfirm = async () => {
   if (!deleteTarget) return;
   try {
    await deletePackage(deleteTarget);
    toast.success("Plan deleted successfully");
    setDeleteTarget(null);
      startTransition(() => {
        if (pageIndex === 0) {
          setRefreshKey((k) => k + 1);
        } else {
          setPageIndex(0);
        }
      });
   } catch(error){
    toast.error("Failed to delete Packages");
   }
  };

  return (
    <div className="space-y-5">
      <Card>
        <BaseTable
          columns={columns}
          apiCall={fetchPackages}
          pageIndex={pageIndex}
          setPageIndex={handlePageChange}
          refreshKey={refreshKey}
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
        <ConfirmDialog
          title="Delete Package"
          message={`Are you sure you want to delete package ID: ${deleteTarget}?`}
          isOpen={!!deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        />
        <Modal
        title={`edit ${editTarget}`}
        footerContent={null}
        activeModal={editModalOpen}
         onClose={() => setEditModalOpen(false)}
        >
          <EditPlan id={editTarget}/>
        </Modal>
      </Card>
    </div>
  );
};

export default CategoriesPage;
