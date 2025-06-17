'use client';
import React, { useMemo, useCallback, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { callLedasByAd } from "@/lib/api";

const CallLeadsPage = () => {
  const { id } = useParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  // ✅ Define table columns
  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Date', accessor: 'date',
      Cell: ({ value }) => {
      if (!value) return '-';
      const date = new Date(value);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
     },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Phone Number', accessor: 'phone' },
  ], []);

  // API call
  const fetchCallLeadsByAd = useCallback(async ({ pageIndex }) => {
    if (!id) return { data: [], total: 0 };
    try {
      const response = await callLedasByAd(id, pageIndex + 1);
      return {
        data: response?.data?.data || [],
        total: response?.data?.meta?.total || 0,
      };
    } catch (error) {
      console.error("Failed to fetch call leads:", error);
      return { data: [], total: 0 };
    }
  }, [id]);

  return (
    <Card>
      <BaseTable
        title={`Call Leads for Ad ID:${id}`}
        columns={columns}
        params={{}} // optional for filters
        apiCall={fetchCallLeadsByAd}
        pageIndex={pageIndex}
        setPageIndex={(index) => startTransition(() => setPageIndex(index))}
        showGlobalFilter={false}
        rowSelect={false}
      />
    </Card>
  );
};

export default CallLeadsPage;
