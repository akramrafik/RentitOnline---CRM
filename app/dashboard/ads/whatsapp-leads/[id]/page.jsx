'use client';
import React, { useMemo, useCallback, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import { whatsappLedasByAd } from "@/lib/api";

const WhatsappLeadsPage = () => {
  const { id } = useParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  // ✅ Define table columns
  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Whatsapp Number', accessor: 'phone_number' },
    { Header: 'Message', accessor: 'message' },
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
  ], []);

  // API call
  const fetchWhatsappLedasByAd = useCallback(async ({ pageIndex }) => {
    if (!id) return { data: [], total: 0 };
    try {
      const response = await whatsappLedasByAd(id, pageIndex + 1);
      return response?.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch call leads:", error);
      return { data: [], total: 0 };
    }
  }, [id]);

  return (
    <Card>
      <BaseTable
        title={`Whatsapp Leads for Ad ID:${id}`}
        columns={columns}
        params={{}}
        apiCall={fetchWhatsappLedasByAd}
        pageIndex={pageIndex}
        setPageIndex={(index) => startTransition(() => setPageIndex(index))}
        showGlobalFilter={false}
        rowSelect={false}
      />
    </Card>
  );
};

export default WhatsappLeadsPage;
