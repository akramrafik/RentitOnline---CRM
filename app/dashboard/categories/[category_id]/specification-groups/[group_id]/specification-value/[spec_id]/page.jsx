'use client';
import React, {
  useState,
  useMemo,
  useTransition,
  useEffect,
  useCallback
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import BaseTable from '@/components/partials/table/BaseTable';
import { getAllSpecValues, deleteSpecificationValue } from '@/lib/api';
import Tooltip from '@/components/ui/Tooltip';
import { Icon } from '@iconify/react';
import ConfirmDialog from '@/components/partials/ConfirmPopup';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
// import EditSpec from './edit_spec';
import CreateSpecValue from './create_spec_value';
import EditSpecValue from './edit_spec_value';

const SpecificationValuesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { category_id, group_id, spec_id } = useParams();
  const router = useRouter();

  const [filter, setFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [, startTransition] = useTransition();

  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const debouncedSetFilter = useMemo(
    () =>
      debounce((val) => {
        startTransition(() => {
          setFilter(val);
          setPageIndex(0);
        });
      }, 300),
    []
  );

  const handleFilterChange = useCallback((value) => {
    debouncedSetFilter(value);
  }, [debouncedSetFilter]);

  useEffect(() => {
    return () => debouncedSetFilter.cancel();
  }, [debouncedSetFilter]);

  const fetchSpecificationValues = useCallback(
    async ({ pageIndex, q }) => {
      try {
        const data = await getAllSpecValues(spec_id);
        const filteredData = q
          ? data.filter((item) =>
              item.value.toLowerCase().includes(q.toLowerCase())
            )
          : data;

        return {
          data: filteredData,
          meta: { last_page: 1 }
        };
      } catch (err) {
        console.error('Failed to fetch specification values', err);
        return { data: [], meta: { last_page: 1 } };
      }
    },
    [spec_id]
  );

  useEffect(() => {
    if (!selectedItem || !actionType) return;

    if (actionType === 'edit') {
      setEditModalOpen(true);
    } else if (actionType === 'delete') {
      setIsConfirmOpen(true);
    }

    setActionType(null);
  }, [selectedItem, actionType]);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Value', accessor: 'value' },
    { Header: 'Icon', accessor: 'icon',
       Cell: ({ value }) => (
        value ? (
          <img
            src={value}
            alt="icon"
            className="w-8 h-8 object-contain rounded"
          />
        ) : (
          <span className="text-gray-400">No Icon</span>
        )
      ),
     },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => {
        const handleAction = (type) => {
          setSelectedItem(row.original);
          setActionType(type);
        };

        return (
          <div className="flex gap-2">
            <Tooltip content="Edit">
              <button className="action-btn" onClick={() => handleAction('edit')}>
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button className="action-btn" onClick={() => handleAction('delete')}>
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
          </div>
        );
      }
    }
  ], []);

  return (
    <>
      <Card>
        <BaseTable
          title="Specification Values"
          columns={columns}
          apiCall={fetchSpecificationValues}
          params={{ spec_id, refreshKey }}
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
                text="Add New"
                className="bg-primary-500 text-white btn-sm h-10 my-0"
                onClick={() => setCreateModalOpen(true)}
              />
            </div>
          }
        />
      </Card>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={async () => {
          try {
            await deleteSpecificationValue(spec_id, selectedItem.id);
            toast.success('Specification value deleted successfully');
            setRefreshKey(prev => prev + 1);
          } catch (err) {
            toast.error('Failed to delete specification value');
          } finally {
            setIsConfirmOpen(false);
            setSelectedItem(null);
          }
        }}
        title="Delete Specification Value"
        message={`Are you sure you want to delete "${selectedItem?.value}"?`}
      />

      <Modal
        title="Edit Specification Value"
        activeModal={editModalOpen}
        footerContent={null}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedItem(null);
        }}
      >
        <EditSpecValue
          specId={spec_id}
          valueId={selectedItem?.id}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedItem(null);
            setRefreshKey(prev => prev + 1);
          }}
        />
      </Modal>

      <Modal
        title="Add Specification Value"
        activeModal={createModalOpen}
        footerContent={null}
        onClose={() => setCreateModalOpen(false)}
      >
        <CreateSpecValue
          specId={spec_id}
          onClose={() => {
            setCreateModalOpen(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      </Modal>
    </>
  );
};

export default SpecificationValuesPage;