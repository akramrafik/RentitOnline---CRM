'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import debounce from 'lodash.debounce';
import Card from '@/components/ui/Card';
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Modal from '@/components/ui/Modal';
import BaseTable from '@/components/partials/table/BaseTable';
import { getFaqsBycategoryId } from '@/lib/api'; 
import EditFaq from './edit-faq';
import CreateFaq from './create-faq';

const SpecificationGroupsTable = () => {
  const { category_id } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const debouncedSetFilter = useMemo(
    () =>
      debounce((val) => {
        setFilter(val);
        setPageIndex(0);
      }, 300),
    []
  );

  const handleFilterChange = useCallback((value) => {
    debouncedSetFilter(value);
  }, [debouncedSetFilter]);

  const fetchData = useCallback(
    async ({ pageIndex, q }) => {
      try {
        const data = await getFaqsBycategoryId(category_id); // Update with the correct fetch function
        const filteredData = q
          ? data.filter((item) =>
              item.question?.toLowerCase().includes(q.toLowerCase())
            )
          : data;

        return {
          data: filteredData,
          meta: { last_page: 1 } // Replace with actual pagination if available
        };
      } catch (error) {
        console.error('Error fetching data:', error);
        return { data: [], meta: { last_page: 1 } };
      }
    },
    [category_id]
  );

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    {
  Header: 'Question',
  accessor: 'question',
  Cell: ({ value }) => (
    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
      {value}
    </p>
  )
},
   {
  Header: 'Answer',
  accessor: 'answer',
  Cell: ({ value }) => {
    const AnswerCell = () => {
      const [expanded, setExpanded] = useState(false);
      const limit = 120;

      if (!value) return null;

      const isLong = value.length > limit;
      const displayText = expanded || !isLong ? value : value.slice(0, limit) + '...';

      return (
        <div className="whitespace-pre-wrap">
          <p className="text-sm text-gray-700 leading-relaxed">{displayText}</p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary-500 font-medium mt-1 text-xs focus:outline-none"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      );
    };

    return <AnswerCell />;
  }
},,
{Header: 'status', accessor: 'status',
  Cell: ({ value }) => (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
        value === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {value === 1 ? 'Active' : 'Inactive'}
    </span>
  ),
},
    {
  Header: 'Actions',
  accessor: 'actions',
  Cell: ({ row }) => (
    <div className="flex gap-2">
      <Tooltip content="Edit">
        <button
          className="action-btn"
          onClick={() => {
            setSelectedItem(row.original);
            setEditModalOpen(true); 
          }}
        >
          <Icon icon="heroicons:pencil-square" />
        </button>
      </Tooltip>
      <Tooltip content="Delete" theme="danger">
        <button
          className="action-btn"
          onClick={() => {
            setSelectedItem(row.original);
            setActionType("delete");
          }}
        >
          <Icon icon="heroicons:trash" />
        </button>
      </Tooltip>
    </div>
  )
}
  ], []);

  return (
    <>
    <Card>
      <BaseTable
        title="FAQ List"
        columns={columns}
        apiCall={fetchData}
        params={{ category_id, refreshKey }}
        filter={filter}
        setFilter={handleFilterChange}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        showGlobalFilter={true}
        rowSelect={false}
       actionButton={
            <div className="space-xy-5 flex mr-1">
            <Button
  icon="heroicons-outline:plus"
  text="Create New"
  className="bg-primary-500 text-white btn-sm h-10 my-0"
  onClick={() => setCreateModalOpen(true)}
/>
              </div>
          }
      />
    </Card>
    <Modal
  title="Edit FAQ"
  activeModal={editModalOpen}
  footerContent={null}
  onClose={() => {
    setEditModalOpen(false);
    setSelectedItem(null);
  }}
>
  {selectedItem && (
    <EditFaq
      data={selectedItem}
      categoryId={category_id}
      onClose={() => {
        setEditModalOpen(false);
        setSelectedItem(null);
      }}
    />
  )}
</Modal>
<Modal
  title="Add Specification Group"
  activeModal={createModalOpen}
  footerContent={null}
  onClose={() => setCreateModalOpen(false)}
>
  <CreateFaq
    categoryId={category_id}
    onClose={() => {
      setCreateModalOpen(false);
      setRefreshKey(prev => prev + 1);
    }}
  />
</Modal>
</>
  );
};

export default SpecificationGroupsTable;
