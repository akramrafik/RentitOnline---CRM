'use client'
import React, { useEffect, useState, useMemo, useCallback,useTransition } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import LeadTable from './table';
import LeadFilter from './filter';
import { getLeads } from '@/lib/api';
import Card from '@/components/ui/Card';
import BaseTable from '@/components/partials/table/BaseTable';
import debounce from "lodash.debounce";
import Button from '@/components/ui/Button';

const LeadsPage = () => {
   const searchParams = useSearchParams();
    const router = useRouter();
   const [pageIndex, setPageIndex] = useState(0);
   const [isPending, startTransition] = useTransition();
   const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSource, setSelectedSource] = useState('')
  const [dates, setDates] = useState([]);

  const formatDate = (date, time = '00:00') => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}+${encodeURIComponent(time)}`;
};

  // Set initial state from URL
    useEffect(() => {

    }, []);


 const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email",},
      { Header: "Phone No.", accessor: "phone" },
      { Header: "Source", accessor: "source_type" },
      { Header: "Date.", accessor: "date" },
      { Header: "Ad ID/Link", accessor: "ad_id" },
    ],
    []
  );
    // API call
    const fetchLeads = useCallback(
      async ({ pageIndex }) => {
        const params = {
          q: filter,
          page: pageIndex + 1,
          source: selectedSource,
          category: selectedCategory,
          start_date: formatDate(dates[0], '00:00'),
          end_date: formatDate(dates[1], '23:59'),
        };
        const response = await getLeads(params);
        return response;
      },
      [filter, selectedSource, selectedCategory, dates]
    );
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

  return (
    <div className="p-4 space-y-4">
    <button onClick={() => console.log(dates)}>
  check
</button>
      <LeadFilter 
        onSearch={debouncedSetFilter}
        setSelectedSource={setSelectedSource}
        setSelectedCategory={setSelectedCategory}
        setDates={setDates}
      />
      <Card>
      <BaseTable 
        columns={columns}
        title="Leads"
        apiCall={fetchLeads}
        params={{}}
        pageIndex={pageIndex}
         setPageIndex={(index) => startTransition(() => setPageIndex(index))}
         setFilter={debouncedSetFilter}
         filter={filter}
         actionButton={
          <div>
             <Button
  icon="heroicons-outline:refresh"
  text="Clear filter"
  className={`bg-white text-primary-500 m-0 p-0`}
 onClick={() => {
  setSelectedCategory(null);
  setSelectedSource(null);
  setDates([]);
}}
/>
</div>
         }
      />
      </Card>
      {/* <LeadTable data={data} /> */}
    </div>
  );
};

export default LeadsPage;
