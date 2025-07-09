import React, { useMemo } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

const groupMenuSections = (menuItems) => {
  const sections = [];
  let currentSection = { title: "Main", items: [] };

  for (const item of menuItems) {
    if (item.isHeadr) {
      if (currentSection.items.length) sections.push(currentSection);
      currentSection = { title: item.title, items: [] };
    } else if (!item.isHide) {
      currentSection.items.push(item);
    }
  }

  if (currentSection.items.length) sections.push(currentSection);
  return sections;
};

const MenuSectionsDisplay = ({ menuItems = [] }) => {
  const sections = useMemo(() => groupMenuSections(menuItems), [menuItems]);

  return (
    <Card >
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            {/* Section Title */}
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
              {section.title}
            </h3>

            {/* Menu Items */}
            <div className="flex flex-wrap items-center text-[13px] font-medium text-gray-700">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center">
                  <Link
                    href={item.link || "#"}
                    className="transition-colors hover:text-primary-500"
                  >
                    {item.title}
                  </Link>
                  {i !== section.items.length - 1 && (
                    <span className="mx-2 text-gray-300">/</span>
                  )}
                </div>
              ))}
            </div>

            {/* Line between sections (not after last) */}
            {idx !== sections.length - 1 && (
              <div className="mt-5 border-b border-gray-200 dark:border-gray-700"></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MenuSectionsDisplay;
