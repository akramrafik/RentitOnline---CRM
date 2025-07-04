'use client';
import React, {
  useState,
  useMemo,
  useCallback,
  useTransition,
  useEffect,
} from 'react';
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
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const [initialized, setInitialized] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [removeDuplicate, setRemoveDuplicate] = useState(false);

  // Format date for API params
  const formatDate = (date, time = '00:00') => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${time}`;
  };

  // Initialize filter states from URL params once
  useEffect(() => {
  if (!initialized) {
    setFilter(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedSource(searchParams.get('source') || '');

    const start = searchParams.get('start_date');
    const end = searchParams.get('end_date');

    if (start) setStartDate(new Date(start));
    if (end) setEndDate(new Date(end));

    const page = parseInt(searchParams.get('page') || '1', 10);
    setPageIndex(page > 0 ? page - 1 : 0);

    // ✅ Add this
    const removeDup = searchParams.get('remove_duplicate');
    setRemoveDuplicate(removeDup === '1');

    setInitialized(true);
  }
}, [initialized, searchParams]);


  // Debounced filter input
  const debouncedSetFilter = useMemo(() => {
    const fn = debounce((value) => {
      startTransition(() => {
        setPageIndex(0);
        setFilter(value);
      });
    }, 300);
    return fn;
  }, []);

  useEffect(() => {
    return () => {
      debouncedSetFilter.cancel();
    };
  }, [debouncedSetFilter]);

  // Fetch leads
  const fetchLeads = useCallback(
    async ({ pageIndex }) => {
      const params = {
        q: filter,
        page: pageIndex + 1,
        source: selectedSource,
        category: selectedCategory,
        start_date: formatDate(startDate, '00:00'),
        end_date: formatDate(endDate, '23:59'),
        remove_duplicate: removeDuplicate ? 1 : 0,
      };
      return await getLeads(params);
    },
    [filter, selectedSource, selectedCategory, startDate, endDate, removeDuplicate]
  );

 useEffect(() => {
  if (!initialized) return;

  const params = new URLSearchParams();

  if (filter.trim()) params.set('q', filter);
  if (selectedCategory) params.set('category', selectedCategory);
  if (selectedSource) params.set('source', selectedSource);
  if (startDate) params.set('start_date', formatDate(startDate, '00:00'));
  if (endDate) params.set('end_date', formatDate(endDate, '23:59'));
  if (removeDuplicate) params.set('remove_duplicate', '1');
  if (pageIndex > 0) params.set('page', String(pageIndex + 1));

  const queryString = params.toString();
  const url = queryString ? `${pathname}?${queryString}` : pathname;

  router.replace(url, { scroll: false });
}, [
  filter,
  selectedCategory,
  selectedSource,
  startDate,
  endDate,
  pageIndex,
  removeDuplicate,
  router,
  pathname,
  initialized,
]);



  const columns = useMemo(
    () => [
      { Header: 'Id', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone No.', accessor: 'phone' },
      { Header: 'Source', accessor: 'source_type' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Ad ID/Link', accessor: 'ad_id' },
    ],
    []
  );

  return (
    <div>
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
          rowSelect={false}
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
                  setStartDate(null);
                  setEndDate(null);
                  setRemoveDuplicate(false);
                  setPageIndex(0);
                }}
                disabled={
                  !filter &&
                  !selectedCategory &&
                  !selectedSource &&
                  !startDate &&
                  !endDate &&
                  !removeDuplicate
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
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  removeDuplicate={removeDuplicate}
                  setRemoveDuplicate={setRemoveDuplicate}
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