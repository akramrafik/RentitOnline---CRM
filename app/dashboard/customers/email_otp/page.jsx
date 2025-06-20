'use client'
import React from "react";
import Card from "@/components/ui/Card";
import BaseTable from "@/components/partials/table/BaseTable";
import {useMemo, useCallback, useState, useTransition } from "react";
import {GetEmailOtp} from "@/lib/api";


const WhatsappOtp = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [isPending, startTransition] = useTransition();

     const columns = useMemo(
        () => [
          { Header: "Email", accessor: "identifier" },
          { Header: "OTP", accessor: "otp"},
          { Header: "Date", accessor: "date",},
        ],
        []
      );

     // API call
        const fetchEmailOtp = useCallback(
          async ({ pageIndex }) => {
             const params = {
          page: pageIndex + 1,
             }
            const response = await GetEmailOtp(params);
            return response;
          },
          []
        );
    return(
        <Card>
            <BaseTable
            title="Recent Customer OTPs"
            columns={columns}
            apiCall={fetchEmailOtp}
            params={{}}
            pageIndex={pageIndex}
            setPageIndex={(index) => startTransition(() => setPageIndex(index))}
            showGlobalFilter={false}
            rowSelect={false}
            />
        </Card>
    );
};

export default WhatsappOtp;