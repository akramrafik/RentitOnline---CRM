'use client';
import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LeadFilter from './filter';
import { getLeads } from '@/lib/api';
import Card from '@/components/ui/Card';
import BaseTable from '@/components/partials/table/BaseTable';
import debounce from 'lodash.debounce';
import Button from '@/components/ui/Button';
import CommonDropdown from '@/components/ui/Common-dropdown';

const LeadsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [dates, setDates] = useState([]);

  // ✅ Format date for API params
  const formatDate = (date, time = '00:00') => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}+${encodeURIComponent(time)}`;
  };

  // ✅ Define table columns
  const columns = useMemo(() => [
    { Header: 'Id', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Phone No.', accessor: 'phone' },
    { Header: 'Source', accessor: 'source_type' },
    { Header: 'Date.', accessor: 'date' },
    { Header: 'Ad ID/Link', accessor: 'ad_id' },
  ], []);

  const fetchLeads = useCallback(async ({ pageIndex }) => {
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
  }, [filter, selectedSource, selectedCategory, dates]);

  // ✅ Debounced search input
  const debouncedSetFilter = useMemo(() =>
    debounce((value) => {
      startTransition(() => {
        setPageIndex(0);
        setFilter(value);
      });
    }, 300), []);

  return (
    <div className="p-1 sm:p-3 md:p-4 lg:p-5 space-y-4">
      <Card>
        <BaseTable
          columns={columns}
          title="Leads"
          apiCall={fetchLeads}
          params={{}}
          pageIndex={pageIndex}
          showGlobalFilter={true}
          setPageIndex={(index) => startTransition(() => setPageIndex(index))}
          setFilter={debouncedSetFilter}
          filter={filter}
          actionButton={
            <div className="space-xy-5 flex">
              <Button
                icon="heroicons-outline:refresh"
                text="Clear filter"
                className="bg-white text-primary-500 m-0 p-0"
                onClick={() => {
                  setFilter('');
                  setSelectedCategory('');
                  setSelectedSource('');
                  setDates([]);
                  setPageIndex(0);
                }}
                disabled={
                  !filter &&
                  !selectedCategory &&
                  !selectedSource &&
                  dates.length === 0
                }
              />
              <CommonDropdown
               contentWrapperClass="rounded-lg filter-panel"
                  header="Filters"
  label="Filter"
  split={true}
  labelClass="btn-sm h-10 my-0 btn-outline-light"
              >
                <LeadFilter
                  filter={filter}
                  setFilter={debouncedSetFilter}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  dates={dates}
                  setDates={setDates}
                />
              </CommonDropdown>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default LeadsPage;
