import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const ActionBar = ({
  hideApproveReject,
  rejectedAds,
  onApprove,
  onReject,
  onPlanMapping,
  onViewAll,
  isLoading = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center
          px-6 py-2 bg-white rounded-md shadow-[0px_15px_50px_rgba(0,0,0,0.3)]
          min-w-[320px] w-fit max-w-full whitespace-nowrap"
      >
        {/* Skeletons to mimic buttons */}
        <Skeleton width={100} height={36} className="mr-3" />
        <Skeleton width={100} height={36} className="mr-3" />
        <Skeleton width={60} height={36} />
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center
        px-6 py-2 bg-white text-dark shadow-[0px_15px_50px_rgba(0,0,0,0.3)]
        rounded-md mb-4 min-w-[320px] w-fit max-w-full whitespace-nowrap"
    >
      {rejectedAds ?(
        <Button
          className="flex items-center gap-1 bg-red-500 cursor-default mr-3"
          disabled
        >
          <Icon icon="heroicons-outline:x-circle" className="w-4 h-4 text-white" />
          <span className="text-sm text-white">Rejected</span>
        </Button>
      ):
        hideApproveReject ? (
        <Button
          className="flex items-center gap-1 bg-green-500 cursor-default mr-3"
          disabled
        >
          <Icon icon="heroicons-outline:check-circle" className="w-4 h-4 text-white" />
          <span className="text-sm text-white">Ad Approved</span>
        </Button>
      ) : (
        <>
          <Button
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 mr-3"
            onClick={onApprove}
          >
            <Icon icon="heroicons-outline:check" className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Approve</span>
          </Button>

          <Button
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 mr-3"
            onClick={onReject}
          >
            <Icon icon="heroicons-outline:x-circle" className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Reject</span>
          </Button>
        </>
      )}

      <div className="relative" ref={menuRef}>
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-3"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon icon="heroicons-outline:dots-vertical" className="w-4 h-4" />
          <span className="text-sm font-medium">More</span>
        </Button>

        {menuOpen && (
          <div
            className="absolute right-0 bottom-full mb-2 w-48 bg-white border rounded shadow-lg z-50 flex flex-col"
          >
            <button
  className="w-full text-left px-4 py-2 hover:bg-gray-100"
  onClick={() => {
    onPlanMapping(); // this comes from parent and does setEditModalOpen(true)
    setMenuOpen(false); // close dropdown
  }}
>
  Plan Mapping
</button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onViewAll();
                setMenuOpen(false);
              }}
            >
              View All Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
