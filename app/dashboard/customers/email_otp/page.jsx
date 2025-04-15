"use client";
import React, { use, useEffect, useState } from "react";
import TableData from "@/components/partials/table/TableData";
import { WhatsappData } from "@/constant/table-data";
import api, { GetEmailOtp } from "@/lib/api";

const WhatsappOtp = () => {
    const [whatsappDataState, setWhatsappDataState] = useState(WhatsappData);

    const WhatsappOtpColumns = [
        { Header: "Emial", accessor: "email" },
        { Header: "OTP", accessor: "otp" },
        { Header: "Date", accessor: "date" },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetEmailOtp();
                const mappedData = response.data.map((item) => ({
                    email: item.identifier, 
                    otp: item.otp,
                    date: item.date,
                }));
                setWhatsappDataState(mappedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []); 
    
    return (
        <div>
            <TableData title="Recent Customer OTPs" columns={WhatsappOtpColumns} data={whatsappDataState} />
        </div>
    );
};

export default WhatsappOtp;
