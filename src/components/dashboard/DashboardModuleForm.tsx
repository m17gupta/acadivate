'use client';

import { Image as ImageIcon, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import type { FormEvent, MutableRefObject } from 'react';
import { Button } from '../ui/Button';
import { cn } from '@/src/lib/utils';
import type { DashboardModuleConfig } from './dashboardModules';
import {
  getFileValues,
  getSingularTitle,
  getTextValue,
  type DashboardModuleDraft,
} from './dashboardModuleFormUtils';

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
  onFileChange: (key: string, files: FileList | File[] | null | undefined) => Promise<void>;
  onClearFileField: (key: string) => void;
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
  onFileChange,
  onClearFileField,
  onSubmit,
  onUpdate
}: DashboardModuleFormProps) {
  const singularTitle = getSingularTitle(config.title);


  const handleonSubmit=(e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(editingId){
        onUpdate(e);
      }
      else{
        onSubmit(e);
      }
  }
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
            {editingId ? `Update ${singularTitle}` : `Add a new ${singularTitle}`}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Fill out the fields below to create or update records for this module. The data updates immediately in the current session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {editingId ? (
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw size={14} />
              Cancel edit
            </Button>
          ) : null}
          <Button type="button" variant="ghost" size="sm" onClick={onToggleOpen}>
            {isOpen ? 'Hide form' : 'Open form'}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <form onSubmit={handleonSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => {
              const fileValues = getFileValues(draft[field.key]);

              return (
                <div key={field.key} className={cn('space-y-2', field.span === 2 ? 'md:col-span-2' : '')}>
                  <label
                    htmlFor={`${config.id}-${field.key}`}
                    className="text-xs font-bold uppercase tracking-[0.22em] text-text-muted"
                  >
                    {field.label}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={`${config.id}-${field.key}`}
                      value={getTextValue(draft[field.key])}
                      onChange={(event) => onFieldChange(field.key, event.target.value)}
                      required={field.required}
                      className="h-11 w-full rounded-2xl border border-border-light bg-bg-soft px-4 text-sm text-navy outline-none transition focus:border-primary"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'file' ? (
                    <div className="rounded-2xl border border-dashed border-border-light bg-bg-soft/60 p-4">
                      <input
                        ref={(node) => {
                          fileInputRefs.current[field.key] = node;
                        }}
                        id={`${config.id}-${field.key}`}
                        type="file"
                        accept={field.accept ?? 'image/*'}
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
                                          const nextFiles = fileValues.filter((_, currentIndex) => currentIndex !== index);
                                          onFieldChange(field.key, nextFiles);
                                          const input = fileInputRefs.current[field.key];
                                          if (input) {
                                            input.value = '';
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
                                    Upload one or more images to build the gallery for this record.
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
                              Click to import a JPG, PNG, or WEBP image. The imported file stays in this session only.
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
                                  ? 'Add more images'
                                  : 'Import images'
                                : fileValues.length
                                  ? 'Replace image'
                                  : 'Import image'}
                            </Button>
                            {fileValues.length ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onClearFileField(field.key)}
                              >
                                <Trash2 size={14} />
                                {field.multiple ? 'Remove all' : 'Remove'}
                              </Button>
                            ) : null}
                          </div>

                          <p className="text-[11px] font-medium text-text-subtle">
                            {field.multiple
                              ? 'Add multiple images for the gallery. You can remove any image before saving.'
                              : field.placeholder}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={`${config.id}-${field.key}`}
                      value={getTextValue(draft[field.key])}
                      onChange={(event) => onFieldChange(field.key, event.target.value)}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full rounded-2xl border border-border-light bg-bg-soft px-4 py-3 text-sm text-navy outline-none transition placeholder:text-text-subtle focus:border-primary"
                    />
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
            })}
          </div>

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
          <p className="text-sm font-semibold text-navy">The form is hidden for now.</p>
          <p className="mt-2 text-sm text-text-muted">
            Click {config.actionLabel} or the button below to open the add / edit form.
          </p>
          <Button type="button" variant="gold" className="mt-5 rounded-2xl" onClick={onToggleOpen}>
            <Plus size={14} />
            Open form
          </Button>
        </div>
      )}
    </article>
  );
}
