import type { DashboardModuleField } from "./dashboardModules";

export type DraftValue = string | string[] | boolean | any[];

export type DashboardModuleDraft = Record<string, DraftValue>;

export function buildEmptyDraft(fields: DashboardModuleField[]) {
  return fields.reduce<DashboardModuleDraft>((draft, field) => {
    if (field.type === "file" && field.multiple) {
      draft[field.key] = [];
    } else if (field.type === "checkbox") {
      draft[field.key] = false;
    } else if (field.type === "repeater") {
      draft[field.key] = [];
    } else if (field.type === "capsule-select") {
      draft[field.key] = [];
    } else {
      draft[field.key] = "";
    }
    return draft;
  }, {});
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the selected file."));
    };

    reader.onerror = () =>
      reject(reader.error ?? new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function getTextValue(value: DraftValue | undefined) {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      return value
        .map((item: any) => {
          const cat = item.categoryName || item.title || "Unknown";
          const items = Array.isArray(item.selectedItems)
            ? item.selectedItems.join(", ")
            : "";
          return items ? `${cat} (${items})` : cat;
        })
        .join(" | ");
    }
    return value.join(", ");
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return typeof value === "string" ? value : "";
}

export function getFileValues(value: DraftValue | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  return value && typeof value === "string" ? [value] : [];
}

export function getSingularTitle(title: string) {
  return title.endsWith("s") ? title.slice(0, -1) : title;
}

export function getRecordLabel(values: DashboardModuleDraft) {
  const candidateKeys = [
    "title",
    "name",
    "nomineeName",
    "institution",
    "award",
    "subject",
  ];

  for (const key of candidateKeys) {
    const label = getTextValue(values[key]);
    if (label) {
      return label;
    }
  }

  return "this record";
}

export function slugifyValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDemoValue(field: DashboardModuleField): any {
  if (field.sourceModule) return undefined;

  switch (field.type) {
    case "text":
    case "email":
      return field.key === "email" ? "demo@example.com" : `Demo ${field.label}`;
    case "textarea":
      return `This is some demo content for ${field.label}. It helps in visualizing the layout and spacing of the form components.`;
    case "date":
      return new Date().toISOString().split("T")[0];
    case "time":
      return "10:00";
    case "datetime-local":
      return new Date().toISOString().slice(0, 16);
    case "number":
      return "100";
    case "checkbox":
      return false;
    case "select":
      return field.options?.[0] || "";
    case "repeater":
      return field.subFields
        ? [
            field.subFields.reduce(
              (acc, sub) => ({ ...acc, [sub.key]: getDemoValue(sub) }),
              {},
            ),
          ]
        : [];
    default:
      return "";
  }
}
