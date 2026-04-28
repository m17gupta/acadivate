"use client";

import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { FormEvent, MutableRefObject, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/hook/hooks";
import { selectDashboardModuleSnapshot } from "./dashboardModuleRegistry";
import type {
  DashboardModuleConfig,
  DashboardModuleField,
} from "./dashboardTypes";
import {
  getFileValues,
  getSingularTitle,
  getTextValue,
  slugifyValue,
  type DashboardModuleDraft,
} from "./dashboardModuleFormUtils";

type DashboardModuleFormProps = {
  config: DashboardModuleConfig;
  formId: string;
  formRef: MutableRefObject<HTMLElement | null>;
  draft: DashboardModuleDraft;
  editingId: string | null;
  isOpen: boolean;
  fileInputRefs: MutableRefObject<Record<string, HTMLInputElement | null>>;
  onToggleOpen: () => void;
  onReset: () => void;
  onFieldChange: (key: string, value: DashboardModuleDraft[string]) => void;
  onFileChange: (
    key: string,
    files: FileList | File[] | null | undefined,
  ) => Promise<void>;
  onClearFileField: (key: string) => void;
  onAutoFill?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (event: FormEvent<HTMLFormElement>) => void;
};

export function DashboardModuleForm({
  config,
  formId,
  formRef,
  draft,
  editingId,
  isOpen,
  fileInputRefs,
  onToggleOpen,
  onReset,
  onFieldChange,
  onAutoFill,
  onFileChange,
  onClearFileField,
  onSubmit,
  onUpdate,
}: DashboardModuleFormProps) {
  const singularTitle = getSingularTitle(config.title);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      config.sections?.forEach((section, index) => {
        initial[section.id] = section.alwaysOpen || index === 0;
      });
      return initial;
    },
  );

  const toggleSection = (id: string) => {
    const section = config.sections?.find((s) => s.id === id);
    if (section?.alwaysOpen) return;
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const nominationawardsSnapshot = useAppSelector((state) =>
    selectDashboardModuleSnapshot(state, "awards-list"),
  );

  const awardsSnapshot = useAppSelector((state) =>
    selectDashboardModuleSnapshot(state, "awards"),
  );

  const isFieldVisible = (field: DashboardModuleField) => {
    if (!field.showIf) return true;
    const { key, value } = field.showIf;
    const actualValue = draft[key];

    if (Array.isArray(value)) {
      return value.includes(String(actualValue));
    }
    return actualValue === value;
  };

  const handleonSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(e);
    } else {
      onSubmit(e);
    }
  };

  const renderField = (field: DashboardModuleField) => {
    if (!isFieldVisible(field)) return null;
    const fileValues = getFileValues(draft[field.key]);
    console.log(awardsSnapshot);
    return (
      <div
        key={field.key}
        className={cn("space-y-2", field.span === 2 ? "md:col-span-2" : "")}
      >
        <label
          htmlFor={`${config.id}-${field.key}`}
          className="text-xs font-bold uppercase tracking-[0.22em] text-text-muted"
        >
          {field.label}
        </label>

        {field.type === "select" ? (
          <select
            id={`${config.id}-${field.key}`}
            value={getTextValue(draft[field.key])}
            onChange={(event) => onFieldChange(field.key, event.target.value)}
            required={field.required}
            className="h-11 w-full rounded-2xl border border-border-light bg-bg-soft px-4 text-sm text-navy outline-none transition focus:border-primary"
          >
            <option value="">{field.placeholder}</option>
            {field.sourceModule === "awards"
              ? nominationawardsSnapshot.records.map((record: any) => {
                  const awardTitle =
                    record.title ||
                    record.values?.title ||
                    record.name ||
                    record.values?.name ||
                    "Untitled Award";
                  return (
                    <option key={record._id} value={record._id}>
                      {awardTitle}
                    </option>
                  );
                })
              : field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
          </select>
        ) : field.type === "file" ? (
          <div className="rounded-2xl border border-dashed border-border-light bg-bg-soft/60 p-4">
            <input
              ref={(node) => {
                fileInputRefs.current[field.key] = node;
              }}
              id={`${config.id}-${field.key}`}
              type="file"
              accept={field.accept ?? "image/*"}
              multiple={field.multiple}
              className="hidden"
              onChange={async (event) => {
                await onFileChange(field.key, event.target.files);
              }}
            />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1">
                {field.multiple ? (
                  fileValues.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {fileValues.map((src, index) => (
                        <div
                          key={`${field.key}-${index}`}
                          className="group relative overflow-hidden rounded-2xl border border-border-light bg-white shadow-sh-xs"
                        >
                          <img
                            src={src}
                            alt={`${field.label} preview ${index + 1}`}
                            className="h-36 w-full object-cover"
                          />
                          <div className="flex items-center justify-between gap-3 border-t border-border-light px-3 py-2">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                              Image {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextFiles = fileValues.filter(
                                  (_, currentIndex) => currentIndex !== index,
                                );
                                onFieldChange(field.key, nextFiles);
                                const input = fileInputRefs.current[field.key];
                                if (input) {
                                  input.value = "";
                                }
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-border-light bg-bg-soft px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-crimson transition hover:border-crimson hover:bg-crimson-2"
                            >
                              <Trash2 size={11} />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-border-light bg-white px-4">
                      <div className="flex flex-col items-center gap-3 text-center text-text-subtle">
                        <ImageIcon size={30} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                          No images selected
                        </span>
                        <p className="max-w-sm text-sm leading-6">
                          Upload one or more images to build the gallery for
                          this record.
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex h-32 w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-2xl border border-border-light bg-white">
                    {fileValues[0] ? (
                      <img
                        src={fileValues[0]}
                        alt={`${field.label} preview`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 px-4 text-center text-text-subtle">
                        <ImageIcon size={28} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-text-muted">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    Click to import a JPG, PNG, or WEBP image. The imported file
                    stays in this session only.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => fileInputRefs.current[field.key]?.click()}
                  >
                    <Upload size={14} />
                    {field.multiple
                      ? fileValues.length
                        ? "Add more images"
                        : "Import images"
                      : fileValues.length
                        ? "Replace image"
                        : "Import image"}
                  </Button>
                  {fileValues.length ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onClearFileField(field.key)}
                    >
                      <Trash2 size={14} />
                      {field.multiple ? "Remove all" : "Remove"}
                    </Button>
                  ) : null}
                </div>

                <p className="text-[11px] font-medium text-text-subtle">
                  {field.multiple
                    ? "Add multiple images for the gallery. You can remove any image before saving."
                    : field.placeholder}
                </p>
              </div>
            </div>
          </div>
        ) : field.type === "textarea" ? (
          <textarea
            id={`${config.id}-${field.key}`}
            value={getTextValue(draft[field.key])}
            onChange={(event) => onFieldChange(field.key, event.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={4}
            className="w-full rounded-2xl border border-border-light bg-bg-soft px-4 py-3 text-sm text-navy outline-none transition placeholder:text-text-subtle focus:border-primary"
          />
        ) : field.type === "checkbox" ? (
          <div className="flex h-11 items-center gap-3">
            <input
              id={`${config.id}-${field.key}`}
              type="checkbox"
              checked={!!draft[field.key]}
              onChange={(event) =>
                onFieldChange(field.key, event.target.checked)
              }
              className="h-5 w-5 rounded border-border-light bg-bg-soft text-primary transition focus:ring-primary"
            />
            <span className="text-sm font-medium text-navy">
              {field.placeholder}
            </span>
          </div>
        ) : field.type === "repeater" ? (
          <div className="space-y-4 rounded-2xl border border-border-light bg-bg-soft/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-navy">
                {field.placeholder || `Manage ${field.label}`}
              </span>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => {
                  const currentItems = (draft[field.key] as any[]) || [];
                  const newItem = field.subFields?.reduce((acc, sub) => {
                    acc[sub.key] =
                      sub.type === "checkbox"
                        ? false
                        : sub.type === "number"
                          ? 0
                          : "";
                    return acc;
                  }, {} as any);
                  onFieldChange(field.key, [...currentItems, newItem]);
                }}
                className="h-8 rounded-lg"
              >
                <Plus size={14} />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {((draft[field.key] as any[]) || []).map((item, index) => (
                <div
                  key={`${field.key}-${index}`}
                  className="relative space-y-4 rounded-xl border border-border-light bg-white p-4 shadow-sh-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const nextItems = (draft[field.key] as any[]).filter(
                        (_, i) => i !== index,
                      );
                      onFieldChange(field.key, nextItems);
                    }}
                    className="absolute right-3 top-3 text-text-subtle transition hover:text-crimson"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid gap-4 md:grid-cols-2">
                    {field.subFields?.map((subField) => (
                      <div key={subField.key} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          {subField.label}
                        </label>
                        {subField.type === "checkbox" ? (
                          <div className="flex h-10 items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!item[subField.key]}
                              onChange={(e) => {
                                const nextItems = [
                                  ...(draft[field.key] as any[]),
                                ];
                                nextItems[index] = {
                                  ...item,
                                  [subField.key]: e.target.checked,
                                };
                                onFieldChange(field.key, nextItems);
                              }}
                              className="h-4 w-4 rounded border-border-light"
                            />
                            <span className="text-xs font-medium text-navy">
                              {subField.placeholder}
                            </span>
                          </div>
                        ) : subField.type === "select" ? (
                          <select
                            value={item[subField.key] || ""}
                            onChange={(e) => {
                              const nextItems = [
                                ...(draft[field.key] as any[]),
                              ];
                              nextItems[index] = {
                                ...item,
                                [subField.key]: e.target.value,
                              };
                              onFieldChange(field.key, nextItems);
                            }}
                            className="h-10 w-full rounded-xl border border-border-light bg-bg-soft px-3 text-sm outline-none focus:border-primary"
                          >
                            <option value="">{subField.placeholder}</option>
                            {subField.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={subField.type}
                            value={item[subField.key] || ""}
                            onChange={(e) => {
                              const nextItems = [
                                ...(draft[field.key] as any[]),
                              ];
                              const val =
                                subField.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value;
                              nextItems[index] = {
                                ...item,
                                [subField.key]: val,
                              };

                              // Auto-slugify name if slug field exists
                              if (
                                subField.key === "name" &&
                                item.hasOwnProperty("slug")
                              ) {
                                nextItems[index].slug = slugifyValue(
                                  e.target.value,
                                );
                              }

                              onFieldChange(field.key, nextItems);
                            }}
                            placeholder={subField.placeholder}
                            className="h-10 w-full rounded-xl border border-border-light bg-bg-soft px-3 text-sm outline-none focus:border-primary"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!((draft[field.key] as any[]) || []).length && (
                <div className="py-4 text-center text-xs font-medium text-text-subtle">
                  No items added yet. Click "Add Item" to begin.
                </div>
              )}
            </div>
          </div>
        ) : field.type === "capsule-select" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {awardsSnapshot.records.map((record: any) => {
                const title =
                  record.title ||
                  record.values?.title ||
                  record.values.category ||
                  "Untitled";

                const isSelected = (draft[field.key] as any[])?.some(
                  (item: any) => item._id === record._id,
                );

                return (
                  <button
                    key={record._id}
                    type="button"
                    onClick={() => {
                      const current = (draft[field.key] as any[]) || [];
                      if (isSelected) {
                        onFieldChange(
                          field.key,
                          current.filter((item) => item._id !== record._id),
                        );
                      } else {
                        onFieldChange(field.key, [...current, record]);
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sh-sm"
                        : "bg-white text-text-muted border-border-light hover:border-primary/50",
                    )}
                  >
                    {title}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {((draft[field.key] as any[]) || []).map((selected, index) => {
                return (
                  <div
                    key={selected._id}
                    className="p-4 rounded-2xl border border-border-light bg-bg-soft/40 relative"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const current = (draft[field.key] as any[]) || [];
                        onFieldChange(
                          field.key,
                          current.filter((_, i) => i !== index),
                        );
                      }}
                      className="absolute right-3 top-3 text-text-subtle hover:text-crimson transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-navy">
                        {selected.title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          (awardsSnapshot.records.find(
                            (r) => r._id === selected._id,
                          )?.items as any[]) || []
                        ).map((item: any) => {
                          const isItemSelected = selected.items.includes(
                            item.slug,
                          );

                          return (
                            <button
                              key={item.slug}
                              type="button"
                              onClick={() => {
                                const current = [
                                  ...(draft[field.key] as any[]),
                                ];
                                const nextSelectedItems = isItemSelected
                                  ? selected.items.filter(
                                      (i: string) => i !== item.slug,
                                    )
                                  : [...selected.items, item.slug];

                                current[index] = {
                                  ...selected,
                                  items: nextSelectedItems,
                                };
                                onFieldChange(field.key, current);
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border",
                                isItemSelected
                                  ? "bg-primary-dark text-white border-primary-dark"
                                  : "bg-white text-text-subtle border-border-light hover:border-primary-dark/30",
                              )}
                            >
                              {item.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <input
            id={`${config.id}-${field.key}`}
            type={field.type}
            value={getTextValue(draft[field.key])}
            onChange={(event) => onFieldChange(field.key, event.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className="h-11 w-full rounded-2xl border border-border-light bg-bg-soft px-4 text-sm text-navy outline-none transition placeholder:text-text-subtle focus:border-primary"
          />
        )}
      </div>
    );
  };

  return (
    <article
      id={formId}
      ref={formRef}
      className="scroll-mt-24 rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-7"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-text-subtle">
            Add / edit data
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
            {editingId
              ? `Update ${singularTitle}`
              : `Add a new ${singularTitle}`}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Fill out the fields below to create or update records for this
            module. The data updates immediately in the current session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {editingId ? (
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw size={14} />
              Cancel edit
            </Button>
          ) : null}

          {onAutoFill && !editingId && (
            <Button
              variant="outline"
              type="button"
              onClick={onAutoFill}
              className="h-10 gap-2 rounded-xl border-primary/20 px-4 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary-deep"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Auto-fill demo</span>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleOpen}
          >
            {isOpen ? "Hide form" : "Open form"}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <form onSubmit={handleonSubmit} className="mt-6 space-y-8">
          {config.sections ? (
            <div className="space-y-6">
              {config.sections.map((section) => {
                const isSectionOpen = !!openSections[section.id];
                return (
                  <div
                    key={section.id}
                    className="overflow-hidden rounded-3xl border border-border-light bg-bg-soft/30 transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-bg-soft",
                        isSectionOpen &&
                          "border-b border-border-light bg-bg-soft",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sh-xs">
                          {section.icon ? (
                            <section.icon size={20} className="text-primary" />
                          ) : (
                            <span className="text-xl">
                              {section.title.split(" ")[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-navy">
                            {section.icon
                              ? section.title
                              : section.title.split(" ").slice(1).join(" ")}
                          </h3>
                          {section.subtitle && (
                            <p className="mt-0.5 text-xs font-medium text-text-muted">
                              {section.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      {!section.alwaysOpen && (
                        <div className="text-text-subtle">
                          {isSectionOpen ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      )}
                    </button>

                    {isSectionOpen && (
                      <div className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          {section.fields.map(renderField)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {config.fields.map(renderField)}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="gold" className="rounded-2xl">
              <Plus size={14} />
              {editingId ? `Update ${config.title}` : `Create ${config.title}`}
            </Button>
            <Button type="button" variant="ghost" onClick={onReset}>
              <RotateCcw size={14} />
              Reset form
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-border-light bg-bg-soft/60 px-5 py-8 text-center">
          <p className="text-sm font-semibold text-navy">
            The form is hidden for now.
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Click {config.actionLabel} or the button below to open the add /
            edit form.
          </p>
          <Button
            type="button"
            variant="gold"
            className="mt-5 rounded-2xl"
            onClick={onToggleOpen}
          >
            <Plus size={14} />
            Open form
          </Button>
        </div>
      )}
    </article>
  );
}
