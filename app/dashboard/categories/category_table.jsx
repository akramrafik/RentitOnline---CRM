import React from "react";
import Card from "@/components/ui/Card";
import TableData from "@/components/partials/table/TableData";

const SkeletonHeader = ({ columnsCount }) => (
  <tr>
    {Array.from({ length: columnsCount }).map((_, i) => (
      <th key={i} className="px-4 py-2 border">
        <Skeleton height={16} width="70%" />
      </th>
    ))}
  </tr>
);
const CategoryTable = () => {
    return (
        <Card>
            <div className="overflow-x-auto">
        <table>
            <thead></thead>       
            
             </table>
          
      </div>
        </Card>
    );
}
export default CategoryTable;