"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import CategoryFilter from "./filter";
import CategoryTable from "./category_table";

const CategoriesPage = () => {
  return (
    <div className="space-y-5">
    <Card title="Categories">
    <CategoryFilter />
    </Card>
    <Card>
    <CategoryTable />
    </Card>
    </div>
  );
}
export default CategoriesPage;