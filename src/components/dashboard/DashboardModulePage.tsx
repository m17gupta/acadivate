'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Image as ImageIcon, PencilLine, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { cn } from '@/src/lib/utils';
import { DashboardModuleForm } from './DashboardModuleForm';
import { DashboardModuleList } from './DashboardModuleList';
import { getRecordLabel, slugifyValue } from './dashboardModuleFormUtils';
import type {
  DashboardAccent,
  DashboardModuleConfig,
  DashboardModuleField,
  DashboardModuleRow,
  DashboardStatusTone,
} from './dashboardModules';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/hook/store';
import {
  getDashboardModuleCrud,
  selectDashboardModuleSnapshot,
} from './dashboardModuleRegistry';

const statusToneClasses: Record<DashboardStatusTone, string> = {
  neutral: 'bg-bg-2 text-navy',
  success: 'bg-sage-2 text-sage',
  warning: 'bg-gold-pale text-gold',
  danger: 'bg-crimson-2 text-crimson',
};

const summaryToneDotClasses: Record<DashboardStatusTone, string> = {
  neutral: 'bg-primary-dark',
  success: 'bg-sage',
  warning: 'bg-gold',
  danger: 'bg-crimson',
};

const accentClasses: Record<DashboardAccent, string> = {
  primary: 'from-primary-deep via-primary-dark to-primary',
  gold: 'from-gold via-gold-2 to-gold-3',
  sage: 'from-sage via-primary-dark to-primary',
  crimson: 'from-crimson via-[#cf4d4d] to-[#8f1b1b]',
};

function buildEmptyDraft(fields: DashboardModuleField[]) {
  return fields.reduce<Record<string, string | string[]>>((draft, field) => {
    draft[field.key] = field.type === 'file' && field.multiple ? [] : '';
    return draft;
  }, {});
}

function buildId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read the selected file.'));
    };

    reader.onerror = () => reject(reader.error ?? new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });
}

function getTextValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

function getFileValues(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

type DraftValue = string | string[];

export function DashboardModulePage({ config }: { config: DashboardModuleConfig }) {
  const [draft, setDraft] = useState<Record<string, DraftValue>>(() => buildEmptyDraft(config.fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef<HTMLElement | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const slugManuallyEditedRef = useRef(false);
  const searchParams = useSearchParams();
  const formId = `${config.id}-form`;
  const tableId = `${config.id}-table`;
  const shouldOpenFromQuery = searchParams?.get('open') === 'form';
  const hasSlugField = config.fields.some((field) => field.key === 'slug');
  const dispatch = useDispatch<AppDispatch>();
  const moduleCrud = useMemo(() => getDashboardModuleCrud(config.id), [config.id]);
  const moduleSnapshot = useSelector(
    (state: RootState) => selectDashboardModuleSnapshot(state, config.id),
    shallowEqual
  );
  const records = moduleSnapshot.records.map((record) => moduleCrud.mapRecordToRow(record));
  const summaryCards = config.buildSummary(records);
  const scrollToForm = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const openForm = () => {
    setIsFormOpen(true);
    scrollToForm();
  };

  useEffect(() => {
    if (shouldOpenFromQuery) {
      openForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldOpenFromQuery]);

  useEffect(() => {
    if (!moduleSnapshot.isFetched) {
      dispatch(moduleCrud.fetchAllThunk());
    }
  }, [dispatch, moduleCrud, moduleSnapshot.isFetched]);

  const resetForm = () => {
    setDraft(buildEmptyDraft(config.fields));
    setEditingId(null);
    slugManuallyEditedRef.current = false;
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) {
        input.value = '';
      }
    });
  };

  const handleFieldChange = (key: string, value: DraftValue) => {
    if (key === 'slug') {
      slugManuallyEditedRef.current = true;
    }

    setDraft((previous) => {
      const nextDraft = { ...previous, [key]: value };

      if (
        hasSlugField &&
        key === 'title' &&
        typeof value === 'string' &&
        !slugManuallyEditedRef.current
      ) {
        nextDraft.slug = slugifyValue(value);
      }

      return nextDraft;
    });
  };

  const clearFileField = (key: string) => {
    const field = config.fields.find((item) => item.key === key);
    handleFieldChange(key, field?.type === 'file' && field?.multiple ? [] : '');

    const input = fileInputRefs.current[key];
    if (input) {
      input.value = '';
    }
  };

  const handleFileChange = async (key: string, files: FileList | File[] | null | undefined) => {
    const field = config.fields.find((item) => item.key === key);

    if (!field) {
      return;
    }

    const selectedFiles = Array.from(files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    if (selectedFiles.some((file) => !file.type.startsWith('image/'))) {
      toast.error('Please choose an image file.');
      return;
    }

    try {
      const importedFiles = await Promise.all(selectedFiles.map((file) => readFileAsDataUrl(file)));

      setDraft((previous) => {
        const currentFiles = getFileValues(previous[key]);

        if (field.multiple) {
          return {
            ...previous,
            [key]: [...currentFiles, ...importedFiles],
          };
        }

        return {
          ...previous,
          [key]: importedFiles[0] ?? '',
        };
      });
    } catch (error) {
      console.error(error);
      toast.error('Unable to import the selected image.');
      return;
    } finally {
      const input = fileInputRefs.current[key];
      if (input) {
        input.value = '';
      }
    }
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(moduleCrud.createThunk({ ...draft } as Record<string, unknown>)).unwrap();

      toast.success(`${config.title} added`, {
        description: 'A new record was saved to the database.',
      });

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to create ${config.title.toLowerCase().slice(0, -1)}`, {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };


  const handleUpdate=async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    try {
      await dispatch(
        moduleCrud.updateThunk({ _id: editingId, ...draft } as Record<string, unknown>)
      ).unwrap();

      toast.success(`${config.title} updated`, {
        description: 'The existing record was saved to the database.',
      });

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to update ${config.title.toLowerCase().slice(0, -1)}`, {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }

  const handleEdit = (row: DashboardModuleRow) => {
    setDraft({ ...buildEmptyDraft(config.fields), ...row.values });
    setEditingId(row.id);
    slugManuallyEditedRef.current = false;
    openForm();
  };

  const handleDelete = async (row: DashboardModuleRow) => {
    const recordLabel = getRecordLabel(row.values);

    const confirmed = typeof window === 'undefined'
      ? true
      : window.confirm(`Delete ${recordLabel}?`);

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(moduleCrud.deleteThunk(row.id)).unwrap();

      if (editingId === row.id) {
        resetForm();
      }

      toast.success(`${config.title} removed`, {
        description: 'The record was deleted from the database.',
      });
    } catch (error) {
      toast.error(`Failed to delete ${config.title.toLowerCase().slice(0, -1)}`, {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  return (
    <section className="space-y-6">
      <article
        className={cn(
          'overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm'
        )}
      >
        <div
          className={cn(
            'px-6 py-6 text-white shadow-sh-sm lg:px-8 lg:py-7',
            `bg-linear-to-r ${accentClasses[config.accent]}`
          )}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/75">
                Dedicated module
              </p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight lg:text-4xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <config.icon size={22} />
                </span>
                {config.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 lg:text-base">
                {config.subtitle}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
                {config.intro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                {records.length} records
              </span>
              <Button
                type="button"
                variant="gold"
                size="sm"
                className="rounded-xl bg-white text-navy hover:bg-gold-pale"
                onClick={openForm}
                aria-expanded={isFormOpen}
                aria-controls={formId}
              >
                <Plus size={14} />
                {config.actionLabel}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 lg:grid-cols-4 lg:px-8">
          {summaryCards.map((summary) => (
            <div
              key={summary.label}
              className="rounded-[1.5rem] border border-border-light bg-bg-soft/70 px-4 py-4 shadow-sh-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-subtle">
                  {summary.label}
                </p>
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    summaryToneDotClasses[summary.tone]
                  )}
                />
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-3xl font-black text-navy">{summary.value}</span>
              </div>
            </div>
          ))}
        </div>
      </article>

      <DashboardModuleForm
        config={config}
        formId={formId}
        formRef={formRef}
        draft={draft}
        editingId={editingId}
        isOpen={isFormOpen}
        fileInputRefs={fileInputRefs}
        onToggleOpen={() => setIsFormOpen((current) => !current)}
        onReset={resetForm}
        onFieldChange={handleFieldChange}
        onFileChange={handleFileChange}
        onClearFileField={clearFileField}
        onSubmit={handleSubmit}
        onUpdate={handleUpdate}
      />

      <DashboardModuleList
        config={config}
        tableId={tableId}
        records={records}
        editingId={editingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddMore={openForm}
      />
    </section>
  );

  // return (
  //   <section className="space-y-6">
  //     <article
  //       className={cn(
  //         'overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm'
  //       )}
  //     >
  //       <div
  //         className={cn(
  //           'px-6 py-6 text-white shadow-sh-sm lg:px-8 lg:py-7',
  //           `bg-linear-to-r ${accentClasses[config.accent]}`
  //         )}
  //       >
  //         <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
  //           <div className="max-w-3xl">
  //             <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/75">
  //               Dedicated module
  //             </p>
  //             <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight lg:text-4xl">
  //               <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
  //                 <config.icon size={22} />
  //               </span>
  //               {config.title}
  //             </h1>
  //             <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 lg:text-base">
  //               {config.subtitle}
  //             </p>
  //             <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
  //               {config.intro}
  //             </p>
  //           </div>

  //           <div className="flex flex-wrap items-center gap-3">
  //             <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
  //               {records.length} records
  //             </span>
  //             <Button
  //               type="button"
  //               variant="gold"
  //               size="sm"
  //               className="rounded-xl bg-white text-navy hover:bg-gold-pale"
  //               onClick={openForm}
  //               aria-expanded={isFormOpen}
  //               aria-controls={formId}
  //             >
  //               <Plus size={14} />
  //               {config.actionLabel}
  //             </Button>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="grid gap-4 px-6 py-6 lg:grid-cols-4 lg:px-8">
  //         {summaryCards.map((summary) => (
  //           <div
  //             key={summary.label}
  //             className="rounded-[1.5rem] border border-border-light bg-bg-soft/70 px-4 py-4 shadow-sh-xs"
  //           >
  //             <div className="flex items-center justify-between gap-3">
  //               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-subtle">
  //                 {summary.label}
  //               </p>
  //               <span
  //                 className={cn(
  //                   'h-2.5 w-2.5 rounded-full',
  //                   summaryToneDotClasses[summary.tone]
  //                 )}
  //               />
  //             </div>
  //             <div className="mt-3 flex items-end gap-3">
  //               <span className="text-3xl font-black text-navy">{summary.value}</span>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </article>

  //     <article
  //       id={formId}
  //       ref={formRef}
  //       className="scroll-mt-24 rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-7"
  //     >
  //       <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
  //         <div>
  //           <p className="text-[10px] font-black uppercase tracking-[0.32em] text-text-subtle">
  //             Add / edit data
  //           </p>
  //           <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
  //             {editingId ? `Update ${config.title.slice(0, -1)}` : `Add a new ${config.title.slice(0, -1)}`}
  //           </h2>
  //           <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
  //             Fill out the fields below to create or update records for this module. The data updates immediately in the current session.
  //           </p>
  //         </div>

  //         <div className="flex flex-wrap items-center gap-3">
  //           {editingId ? (
  //             <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
  //               <RotateCcw size={14} />
  //               Cancel edit
  //             </Button>
  //           ) : null}
  //           <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormOpen((current) => !current)}>
  //             {isFormOpen ? 'Hide form' : 'Open form'}
  //           </Button>
  //         </div>
  //       </div>

  //       {isFormOpen ? (
  //         <form onSubmit={handleSubmit} className="mt-6 space-y-5">
  //           <div className="grid gap-4 md:grid-cols-2">
  //             {config.fields.map((field) => (
  //               <div key={field.key} className={cn('space-y-2', field.span === 2 ? 'md:col-span-2' : '')}>
  //                 <label
  //                   htmlFor={`${config.id}-${field.key}`}
  //                   className="text-xs font-bold uppercase tracking-[0.22em] text-text-muted"
  //                 >
  //                   {field.label}
  //                 </label>

  //                 {field.type === 'select' ? (
  //                   <select
  //                     id={`${config.id}-${field.key}`}
  //                     value={getTextValue(draft[field.key])}
  //                     onChange={(event) => handleFieldChange(field.key, event.target.value)}
  //                     required={field.required}
  //                     className="h-11 w-full rounded-2xl border border-border-light bg-bg-soft px-4 text-sm text-navy outline-none transition focus:border-primary"
  //                   >
  //                     <option value="">{field.placeholder}</option>
  //                     {field.options?.map((option) => (
  //                       <option key={option} value={option}>
  //                         {option}
  //                       </option>
  //                     ))}
  //                   </select>
  //                 ) : field.type === 'file' ? (
  //                   <div className="rounded-2xl border border-dashed border-border-light bg-bg-soft/60 p-4">
  //                     <input
  //                       ref={(node) => {
  //                         fileInputRefs.current[field.key] = node;
  //                       }}
  //                       id={`${config.id}-${field.key}`}
  //                       type="file"
  //                       accept={field.accept ?? 'image/*'}
  //                       multiple={field.multiple}
  //                       className="hidden"
  //                       onChange={async (event) => {
  //                         await handleFileChange(field.key, event.target.files);
  //                       }}
  //                     />

  //                     <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
  //                       <div className="min-w-0 flex-1">
  //                         {field.multiple ? (
  //                           getFileValues(draft[field.key]).length ? (
  //                             <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
  //                               {getFileValues(draft[field.key]).map((src, index) => (
  //                                 <div
  //                                   key={`${field.key}-${index}`}
  //                                   className="group relative overflow-hidden rounded-2xl border border-border-light bg-white shadow-sh-xs"
  //                                 >
  //                                   <img
  //                                     src={src}
  //                                     alt={`${field.label} preview ${index + 1}`}
  //                                     className="h-36 w-full object-cover"
  //                                   />
  //                                   <div className="flex items-center justify-between gap-3 border-t border-border-light px-3 py-2">
  //                                     <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
  //                                       Image {index + 1}
  //                                     </span>
  //                                     <button
  //                                       type="button"
  //                                       onClick={() => {
  //                                         const nextFiles = getFileValues(draft[field.key]).filter(
  //                                           (_, currentIndex) => currentIndex !== index
  //                                         );
  //                                         handleFieldChange(field.key, nextFiles);
  //                                         const input = fileInputRefs.current[field.key];
  //                                         if (input) {
  //                                           input.value = '';
  //                                         }
  //                                       }}
  //                                       className="inline-flex items-center gap-1 rounded-full border border-border-light bg-bg-soft px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-crimson transition hover:border-crimson hover:bg-crimson-2"
  //                                     >
  //                                       <Trash2 size={11} />
  //                                       Remove
  //                                     </button>
  //                                   </div>
  //                                 </div>
  //                               ))}
  //                             </div>
  //                           ) : (
  //                             <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-border-light bg-white px-4">
  //                               <div className="flex flex-col items-center gap-3 text-center text-text-subtle">
  //                                 <ImageIcon size={30} />
  //                                 <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
  //                                   No images selected
  //                                 </span>
  //                                 <p className="max-w-sm text-sm leading-6">
  //                                   Upload one or more event images to build the gallery for this record.
  //                                 </p>
  //                               </div>
  //                             </div>
  //                           )
  //                         ) : (
  //                           <div className="flex h-32 w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-2xl border border-border-light bg-white">
  //                             {getFileValues(draft[field.key])[0] ? (
  //                               <img
  //                                 src={getFileValues(draft[field.key])[0]}
  //                                 alt={`${field.label} preview`}
  //                                 className="h-full w-full object-cover"
  //                               />
  //                             ) : (
  //                               <div className="flex flex-col items-center gap-2 px-4 text-center text-text-subtle">
  //                                 <ImageIcon size={28} />
  //                                 <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
  //                                   No image selected
  //                                 </span>
  //                               </div>
  //                             )}
  //                           </div>
  //                         )}
  //                       </div>

  //                       <div className="min-w-0 flex-1 space-y-3">
  //                         <div>
  //                           <p className="text-xs font-bold uppercase tracking-[0.22em] text-text-muted">
  //                             {field.label}
  //                           </p>
  //                           <p className="mt-2 text-sm leading-6 text-text-muted">
  //                             Click to import a JPG, PNG, or WEBP image. The imported file stays in this session only.
  //                           </p>
  //                         </div>

  //                         <div className="flex flex-wrap items-center gap-3">
  //                           <Button
  //                             type="button"
  //                             variant="gold"
  //                             size="sm"
  //                             className="rounded-xl"
  //                             onClick={() => fileInputRefs.current[field.key]?.click()}
  //                           >
  //                             <Upload size={14} />
  //                             {field.multiple
  //                               ? getFileValues(draft[field.key]).length
  //                                 ? 'Add more images'
  //                                 : 'Import images'
  //                               : getFileValues(draft[field.key]).length
  //                                 ? 'Replace image'
  //                                 : 'Import image'}
  //                           </Button>
  //                           {getFileValues(draft[field.key]).length ? (
  //                             <Button
  //                               type="button"
  //                               variant="ghost"
  //                               size="sm"
  //                               onClick={() => clearFileField(field.key)}
  //                             >
  //                               <Trash2 size={14} />
  //                               {field.multiple ? 'Remove all' : 'Remove'}
  //                             </Button>
  //                           ) : null}
  //                         </div>

  //                         <p className="text-[11px] font-medium text-text-subtle">
  //                           {field.multiple
  //                             ? 'Add multiple images for the event gallery. You can remove any image before saving.'
  //                             : field.placeholder}
  //                         </p>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 ) : field.type === 'textarea' ? (
  //                   <textarea
  //                     id={`${config.id}-${field.key}`}
  //                     value={getTextValue(draft[field.key])}
  //                     onChange={(event) => handleFieldChange(field.key, event.target.value)}
  //                     required={field.required}
  //                     placeholder={field.placeholder}
  //                     rows={4}
  //                     className="w-full rounded-2xl border border-border-light bg-bg-soft px-4 py-3 text-sm text-navy outline-none transition placeholder:text-text-subtle focus:border-primary"
  //                   />
  //                 ) : (
  //                   <input
  //                     id={`${config.id}-${field.key}`}
  //                     type={field.type}
  //                     value={getTextValue(draft[field.key])}
  //                     onChange={(event) => handleFieldChange(field.key, event.target.value)}
  //                     required={field.required}
  //                     placeholder={field.placeholder}
  //                     className="h-11 w-full rounded-2xl border border-border-light bg-bg-soft px-4 text-sm text-navy outline-none transition placeholder:text-text-subtle focus:border-primary"
  //                   />
  //                 )}
  //               </div>
  //             ))}
  //           </div>

  //           <div className="flex flex-wrap items-center gap-3">
  //             <Button type="submit" variant="gold" className="rounded-2xl">
  //               <Plus size={14} />
  //               {editingId ? `Update ${config.title}` : `Create ${config.title}`}
  //             </Button>
  //             <Button type="button" variant="ghost" onClick={resetForm}>
  //               <RotateCcw size={14} />
  //               Reset form
  //             </Button>
  //           </div>
  //         </form>
  //       ) : (
  //         <div className="mt-6 rounded-[1.5rem] border border-dashed border-border-light bg-bg-soft/60 px-5 py-8 text-center">
  //           <p className="text-sm font-semibold text-navy">The form is hidden for now.</p>
  //           <p className="mt-2 text-sm text-text-muted">
  //             Click {config.actionLabel} or the button below to open the add / edit form.
  //           </p>
  //           <Button type="button" variant="gold" className="mt-5 rounded-2xl" onClick={openForm}>
  //             <Plus size={14} />
  //             Open form
  //           </Button>
  //         </div>
  //       )}
  //     </article>

  //     <article
  //       id={tableId}
  //       className="scroll-mt-24 rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-7"
  //     >
  //       <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
  //         <div>
  //           <p className="text-[10px] font-black uppercase tracking-[0.32em] text-text-subtle">
  //             Data table
  //           </p>
  //           <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
  //             {config.title} records
  //           </h2>
  //           <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
  //             Review the current dataset, edit a row, or delete entries that should no longer appear in the admin workspace.
  //           </p>
  //         </div>

  //         <Button type="button" variant="ghost" onClick={openForm}>
  //           <Plus size={14} />
  //           Add more records
  //         </Button>
  //       </div>

  //       <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-border-light">
  //         <div className="overflow-x-auto">
  //           <div className="min-w-[760px]">
  //             <div
  //               className="grid gap-4 bg-bg-soft px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle"
  //               style={{ gridTemplateColumns: `${config.tableTemplateColumns} 11rem` }}
  //             >
  //               {config.columns.map((column) => (
  //                 <div key={column.key}>{column.label}</div>
  //               ))}
  //               <div>Actions</div>
  //             </div>

  //             <div className="divide-y divide-border-light">
  //               {records.length ? (
  //                 records.map((row) => (
  //                   <div
  //                     key={row.id}
  //                     className={cn(
  //                       'grid gap-4 px-5 py-4 text-sm',
  //                       editingId === row.id ? 'bg-gold-pale/40' : 'bg-white'
  //                     )}
  //                     style={{ gridTemplateColumns: `${config.tableTemplateColumns} 11rem` }}
  //                   >
  //                     {config.columns.map((column) => {
  //                       const value = getTextValue(row.values[column.key]) || '—';

  //                       if (column.key === 'status') {
  //                         const tone = config.statusToneMap[value] ?? 'neutral';

  //                         return (
  //                           <div key={column.key} className="flex items-center">
  //                             <span
  //                               className={cn(
  //                                 'inline-flex rounded-full px-3 py-1 text-xs font-bold',
  //                                 statusToneClasses[tone]
  //                               )}
  //                             >
  //                               {value}
  //                             </span>
  //                           </div>
  //                         );
  //                       }

  //                       return (
  //                         <div key={column.key} className="min-w-0 font-medium text-navy">
  //                           {value}
  //                         </div>
  //                       );
  //                     })}

  //                     <div className="flex items-center gap-2">
  //                       <button
  //                         type="button"
  //                         onClick={() => handleEdit(row)}
  //                         className="inline-flex items-center gap-1.5 rounded-xl border border-border-light bg-bg-soft px-3 py-2 text-xs font-bold text-navy transition hover:border-primary hover:text-primary"
  //                       >
  //                         <PencilLine size={13} />
  //                         Edit
  //                       </button>
  //                       <button
  //                         type="button"
  //                         onClick={() => handleDelete(row)}
  //                         className="inline-flex items-center gap-1.5 rounded-xl border border-border-light bg-white px-3 py-2 text-xs font-bold text-crimson transition hover:border-crimson hover:bg-crimson-2"
  //                       >
  //                         <Trash2 size={13} />
  //                         Delete
  //                       </button>
  //                     </div>
  //                   </div>
  //                 ))
  //               ) : (
  //                 <div className="px-5 py-10 text-center">
  //                   <p className="text-sm font-semibold text-navy">No records yet.</p>
  //                   <p className="mt-2 text-sm text-text-muted">
  //                     Use the form above to create the first entry for this module.
  //                   </p>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </article>
  //   </section>
  // );
}
