'use client';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

const CommonDropdown = ({
  label = 'Dropdown',
  items = [],
  onItemClick,
  split = false,
  splitIcon = 'heroicons-outline:chevron-down',
  children,
  className = '',
  labelClass = '',
  buttonClass = '',
  menuItemsClass = 'mt-2 w-[750px] max-w-[90vw] sm:w-[90vw] md:w-[750px]',
  itemClass = 'px-4 py-2',
  contentWrapperClass = '',
  header = null,
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <Popover className="relative">
        {({ open }) => (
          <>
            <div className={split ? 'flex split-btngroup' : ''}>
              <Popover.Button className={`btn ${split ? 'flex-1' : ''} ${labelClass}`}>
                {label}
              </Popover.Button>
              {split && (
                <Popover.Button className={`${labelClass} ${buttonClass} px-3`}>
                  <Icon icon={splitIcon} />
                </Popover.Button>
              )}
            </div>

            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel 
                className={`absolute z-[9999] ltr:right-0 rtl:left-0 origin-top-right max-h-[80vh] rounded border border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-dropdown ${menuItemsClass}`}
              >
                <div className={`relative ${contentWrapperClass}`}>
                  {header && (
                    <div className='px-4 py-2 border-b flex justify-between items-center'>
                    <div className=" text-md font-medium text-slate-700 dark:text-slate-200">
                      {header}
                    </div>
                    <div className="flex justify-end p-2">
                    <Popover.Button className="text-xs text-slate-500 hover:text-red-500">
                      Close
                    </Popover.Button>
                  </div>
                    </div>
                  )}
                  
                  <div className="px-4 py-2">
                    {children
                      ? children
                      : items.map((item, index) => {
                          const content = (
                            <div className={`flex items-center ${itemClass}`}>
                              {item.icon && (
                                <span className="block text-xl ltr:mr-3 rtl:ml-3">
                                  <Icon icon={item.icon} />
                                </span>
                              )}
                              <span className="block text-sm">{item.label}</span>
                            </div>
                          );

                          const baseClasses = `block ${
                            item.hasDivider
                              ? 'border-t border-slate-100 dark:border-slate-700'
                              : ''
                          } text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700`;

                          return (
                            <div key={index}>
                              {item.link ? (
                                <Link
                                  href={item.link}
                                  className={baseClasses}
                                  onClick={() => onItemClick?.(item)}
                                >
                                  {content}
                                </Link>
                              ) : (
                                <div
                                  className={`${baseClasses} cursor-pointer`}
                                  onClick={() => {
                                    item.onClick?.();
                                    onItemClick?.(item);
                                  }}
                                >
                                  {content}
                                </div>
                              )}
                            </div>
                          );
                        })}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default CommonDropdown;
