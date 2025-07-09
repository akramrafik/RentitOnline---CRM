'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useTransition,
  useEffect,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Card from '@/components/ui/Card';
import BaseTable from '@/components/partials/table/BaseTable';
import debounce from 'lodash.debounce';
import { getAdReports } from '@/lib/api';

// Mapping from API column names to actual data keys
const COLUMN_MAPPING = {
  'TITLE': 'title',
  'EMIRATE': 'emirate_name',
  'CATEGORY': 'category',
  'POSTED BY': 'name',
  'POSTED ON': 'created_at',
  'VIEWS': 'views',
  'MAIN CATEGORY': 'main_category_name',
  'PAYMENT TYPE': 'payment_type',
  'CUSTOMER': 'customer_name',
  'STATUS': 'status_text',
};


const GetAdsReport = () => {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPageDataLength, setCurrentPageDataLength] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [serverColumns, setServerColumns] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(pageFromUrl) ? 0 : pageFromUrl - 1;
  }, [searchParams]);

  useEffect(() => {
    setPageIndex(initialPage);
  }, [initialPage]);

  const handlePageChange = (index) => {
    if (index === pageIndex) return;
    startTransition(() => {
      setPageIndex(index);
      const params = new URLSearchParams(searchParams.toString());
      if (index > 0) {
        params.set('page', index + 1);
      } else {
        params.delete('page');
      }
      router.replace(`?${params.toString()}`);
    });
  };

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

  const columns = useMemo(() => {
    return (serverColumns || []).map((col) => {
      const accessor = COLUMN_MAPPING[col] || col.toLowerCase().replace(/\s+/g, '_');
      return {
        Header: col,
        accessor,
        ...(accessor === 'created_at'
          ? {
              Cell: ({ value }) =>
                value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '--',
            }
          : {}),
      };
    });
  }, [serverColumns]);

  const fetchReports = useCallback(
    async ({ pageIndex }) => {
      try {
        const res = await getAdReports({ page: pageIndex + 1 });
        if (res.columns?.length && serverColumns.length === 0) {
          setServerColumns(res.columns);
        }
        return {
          data: res.data,
          meta: res.meta,
        };
      } catch (error) {
        console.error('Failed to fetch ad reports:', error);
        return {
          data: [],
          meta: { last_page: 1 },
        };
      }
    },
    [serverColumns]
  );

  return (
    <Card>
      <BaseTable
        title="Ads Report"
        columns={columns}
        apiCall={fetchReports}
        params={{}}
        setPageIndex={handlePageChange}
        pageIndex={pageIndex}
        setFilter={debouncedSetFilter}
        filter={filter}
        showGlobalFilter={false}
        refreshKey={refreshKey}
        onDataFetched={(data) => setCurrentPageDataLength(data.length)}
        rowSelect={false}
      />
    </Card>
  );
};

export default GetAdsReport;
