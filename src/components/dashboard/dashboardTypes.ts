import type { LucideIcon } from "lucide-react";

export type DashboardModuleId =
  | "events"
  | "awards"
  | "awards-list"
  | "nominations"
  | "rankings"
  | "leads"
  | "categories"
  | "registrations"
  | "sliders"
  | "forms"
  | "payments"
  | "files";

export type DashboardStatusTone = "neutral" | "success" | "warning" | "danger";

export type DashboardAccent = "primary" | "gold" | "sage" | "crimson" | "blue";

export type DashboardModuleFieldType =
  | "text"
  | "email"
  | "date"
  | "number"
  | "select"
  | "textarea"
  | "file"
  | "checkbox"
  | "repeater"
  | "time"
  | "datetime-local"
  | "capsule-select";

export type DashboardModuleField = {
  key: string;
  label: string;
  type: DashboardModuleFieldType;
  placeholder: string;
  required?: boolean;
  options?: string[];
  span?: 1 | 2;
  accept?: string;
  multiple?: boolean;
  subFields?: DashboardModuleField[];
  sourceModule?: DashboardModuleId;
  showIf?: {
    key: string;
    value: string | boolean | string[];
  };
};

export type DashboardModuleRow = {
  id: string;
  values: Record<string, string | string[]>;
};

export type DashboardSummaryCard = {
  label: string;
  value: string;
  tone: DashboardStatusTone;
};

export type DashboardModuleSection = {
  id: string;
  title: string;
  subtitle?: string;
  fields: DashboardModuleField[];
  alwaysOpen?: boolean;
  icon?: LucideIcon;
};

export type DashboardModuleConfig = {
  id: DashboardModuleId;
  title: string;
  subtitle: string;
  intro: string;
  route: `/dashboard/${DashboardModuleId}`;
  actionLabel: string;
  searchPlaceholder: string;
  accent: DashboardAccent;
  icon: LucideIcon;
  fields: DashboardModuleField[];
  sections?: DashboardModuleSection[];
  columns: Array<{ key: string; label: string }>;
  tableTemplateColumns: string;
  initialRows: DashboardModuleRow[];
  statusToneMap: Record<string, DashboardStatusTone>;
  buildSummary: (rows: DashboardModuleRow[]) => DashboardSummaryCard[];
};

export const countByValue = (
  rows: DashboardModuleRow[],
  key: string,
  value: string,
) => rows.filter((row) => row.values[key] === value).length;

export const accentClasses: Record<DashboardAccent, string> = {
  primary: "from-primary-deep via-primary-dark to-primary",
  gold: "from-gold via-gold-2 to-gold-3",
  sage: "from-sage via-primary-dark to-primary",
  crimson: "from-crimson via-[#cf4d4d] to-[#8f1b1b]",
  blue: "from-navy via-navy/90 to-primary",
};
