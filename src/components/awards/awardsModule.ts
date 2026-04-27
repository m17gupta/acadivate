import { Medal } from "lucide-react";
import type { DashboardModuleConfig } from "../dashboard/dashboardTypes";
import { countByValue } from "../dashboard/dashboardTypes";

export const awardsModule: DashboardModuleConfig = {
  id: "awards",
  title: "Award Category",
  subtitle: "Manage award categories, criteria, and items.",
  intro:
    "Keep your award categories and their specific items organized in one place.",
  route: "/dashboard/awards",
  actionLabel: "Add Category",
  searchPlaceholder: "Search categories...",
  accent: "gold",
  icon: Medal,
  fields: [
    {
      key: "title",
      label: "Category title",
      type: "text",
      placeholder: "e.g. Individual Excellence",
      required: true,
      span: 2,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Draft", "Open", "Review", "Published", "Archived"],
      placeholder: "Select status",
      required: true,
    },
    {
      key: "items",
      label: "Award Items",
      type: "repeater",
      placeholder: "Manage specific awards under this category",
      span: 2,
      subFields: [
        {
          key: "name",
          label: "Award Name",
          type: "text",
          placeholder: "e.g. Life Time Achievement Award",
          required: true,
        },
        {
          key: "slug",
          label: "Slug",
          type: "text",
          placeholder: "life-time-achievement",
          required: true,
        },
        {
          key: "price",
          label: "Price (₹)",
          type: "number",
          placeholder: "5500",
          required: true,
        },
      ],
    },
  ],
  columns: [{ key: "title", label: "Category Name" }],
  tableTemplateColumns: "minmax(0, 1.6fr)",
  initialRows: [],
  statusToneMap: {
    Draft: "neutral",
    Open: "warning",
    Review: "warning",
    Published: "success",
    Archived: "danger",
  },
  buildSummary: (rows) => [
    { label: "Total awards", value: String(rows.length), tone: "neutral" },
    {
      label: "Open",
      value: String(countByValue(rows, "status", "Open")),
      tone: "warning",
    },
    {
      label: "In review",
      value: String(countByValue(rows, "status", "Review")),
      tone: "warning",
    },
    {
      label: "Published",
      value: String(countByValue(rows, "status", "Published")),
      tone: "success",
    },
  ],
};
