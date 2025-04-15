"use client";
import React, { use, useEffect, useState } from "react";
import TableData from "@/components/partials/table/TableData";
import { WhatsappData } from "@/constant/table-data";
import api, { GetmobileOtp } from "@/lib/api";

const WhatsappOtp = () => {
    const [whatsappDataState, setWhatsappDataState] = useState(WhatsappData);

    const WhatsappOtpColumns = [
        { Header: "Phone Number", accessor: "phone_number" },
        { Header: "OTP", accessor: "otp" },
        { Header: "Date", accessor: "date" },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetmobileOtp();
                const mappedData = response.data.map((item) => ({
                    phone_number: item.identifier, 
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
