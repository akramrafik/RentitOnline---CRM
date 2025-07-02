import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

const formatLabel = (text) =>
  text.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const Breadcrumbs = () => {
  const location = usePathname();
  const segments = location.split("/").filter(Boolean); // ["dashboard", "referrals", "create"]

  // Build breadcrumb items with href and label
  // We'll skip the first "dashboard" segment since Home points there already
  const crumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return { href, label: formatLabel(segment) };
  });

  // Home link fixed
  const home = { href: "/dashboard", label: "Home" };

  return (
    <nav className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse" aria-label="Breadcrumb">
      <ul className="breadcrumbs flex items-center space-x-2 rtl:space-x-reverse">
        {/* Home always first */}
        <li className="text-primary-500">
          <Link href={home.href} className="text-lg flex items-center">
            <Icon icon="heroicons-outline:home" />
            <span className="sr-only">Home</span>
          </Link>
          <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
            <Icon icon="heroicons:chevron-right" 
              className="text-primary-500"
            />
          </span>
        </li>

        {/* Loop over crumbs but skip first segment "dashboard" because Home covers it */}
        {crumbs.slice(1)
  .filter((crumb) => isNaN(crumb.label)) // Skip numeric labels
  .map((crumb, idx, arr) => {
    const isLast = idx === arr.length - 1;
    return (
      <li key={crumb.href} className={`capitalize ${isLast ? "text-slate-500 dark:text-slate-400" : "text-primary-500"}`}>
        {!isLast ? (
          <>
            <Link href={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
            <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
              <Icon icon="heroicons:chevron-right" />
            </span>
          </>
        ) : (
          <span aria-current="page">{crumb.label}</span>
        )}
      </li>
    );
  })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
