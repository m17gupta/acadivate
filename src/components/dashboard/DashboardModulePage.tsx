"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image as ImageIcon,
  PencilLine,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { cn } from "@/src/lib/utils";
import { DashboardModuleForm } from "./DashboardModuleForm";
import { DashboardModuleList } from "./DashboardModuleList";
import {
  buildEmptyDraft,
  getFileValues,
  getRecordLabel,
  getSingularTitle,
  getTextValue,
  readFileAsDataUrl,
  slugifyValue,
  getDemoValue,
  type DraftValue,
} from "./dashboardModuleFormUtils";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import type {
  DashboardModuleField,
  DashboardModuleId,
  DashboardModuleRow,
  DashboardStatusTone,
} from "./dashboardModules";
import { dashboardModuleList, accentClasses } from "./dashboardModules";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/hook/store";
import {
  getDashboardModuleCrud,
  selectDashboardModuleSnapshot,
} from "./dashboardModuleRegistry";
import GetAllNomination from "../forms/Nomination/GetAllNomination";
import ShowNominationtable from "../forms/Nomination/ShowNominationtable";
import DashBoardHeader from "./header/DashBoardHeader";
import DashboardSummary from "./header/DashboardSummary";

export function DashboardModulePage({
  moduleId,
}: {
  moduleId: DashboardModuleId;
}) {
  const config =
    dashboardModuleList.find((module) => module.id === moduleId) ??
    dashboardModuleList[0];

  const user = useSelector((state: RootState) => state.auth.user);
  const { allNomination, isFetchedNomination } = useSelector(
    (state: RootState) => state.nominations,
  );
  const [draft, setDraft] = useState<Record<string, DraftValue>>(() =>
    buildEmptyDraft(config.fields),
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef<HTMLElement | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const slugManuallyEditedRef = useRef(false);
  const searchParams = useSearchParams();
  const formId = `${moduleId}-form`;
  const tableId = `${moduleId}-table`;
  const shouldOpenFromQuery = searchParams?.get("open") === "form";
  // Deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<DashboardModuleRow | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasSlugField = config.fields.some((field) => field.key === "slug");
  const dispatch = useDispatch<AppDispatch>();
  const moduleCrud = useMemo(
    () => getDashboardModuleCrud(moduleId),
    [moduleId],
  );
  const moduleSnapshot = useSelector(
    (state: RootState) => selectDashboardModuleSnapshot(state, moduleId),
    shallowEqual,
  );

  const records = moduleSnapshot.records.map((record) =>
    moduleCrud.mapRecordToRow(record),
  );

  console.log(" recorsfd",records)
  const summaryCards = config.buildSummary(records);
  const scrollToForm = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  useEffect(() => {
    config.fields.forEach((field) => {
      if (field.sourceModule) {
        const sourceCrud = getDashboardModuleCrud(field.sourceModule);
        dispatch(sourceCrud.fetchAllThunk());
      }
    });
  }, [config.fields, dispatch]);

  const resetForm = () => {
    setDraft(buildEmptyDraft(config.fields));
    setEditingId(null);
    slugManuallyEditedRef.current = false;
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
  };

  const handleFieldChange = (key: string, value: DraftValue) => {
    if (key === "slug") {
      slugManuallyEditedRef.current = true;
    }

    setDraft((previous) => {
      const nextValue = value;

      const nextDraft = { ...previous, [key]: nextValue };

      if (
        hasSlugField &&
        key === "title" &&
        typeof value === "string" &&
        !slugManuallyEditedRef.current
      ) {
        nextDraft.slug = slugifyValue(value);
      }

      return nextDraft;
    });
  };

  const handleAutoFill = () => {
    setDraft((previous) => {
      const nextDraft = { ...previous };
      let filledSlug = false;

      config.fields.forEach((field) => {
        const demoValue = getDemoValue(field);
        if (demoValue !== undefined) {
          nextDraft[field.key] = demoValue;
          if (field.key === "slug") {
            filledSlug = true;
          }
        }
      });

      if (filledSlug) {
        slugManuallyEditedRef.current = true;
      }

      return nextDraft;
    });
    toast.info("Form filled with demo data", {
      description: "Database-dependent fields were skipped.",
    });
  };

  console.log(draft);

  const clearFileField = (key: string) => {
    const field = config.fields.find((item) => item.key === key);
    handleFieldChange(key, field?.type === "file" && field?.multiple ? [] : "");

    const input = fileInputRefs.current[key];
    if (input) {
      input.value = "";
    }
  };

  const handleFileChange = async (
    key: string,
    files: FileList | File[] | null | undefined,
  ) => {
    const field = config.fields.find((item) => item.key === key);

    if (!field) {
      return;
    }

    const selectedFiles = Array.from(files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    const isImageOnly = !field.accept || field.accept.startsWith("image/");

    if (isImageOnly && selectedFiles.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please choose an image file.");
      return;
    }

    try {
      const importedFiles = await Promise.all(
        selectedFiles.map((file) => readFileAsDataUrl(file)),
      );

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
          [key]: importedFiles[0] ?? "",
        };
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to import the selected image.");
      return;
    } finally {
      const input = fileInputRefs.current[key];
      if (input) {
        input.value = "";
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const finalPayload = config.sections
        ? nestDraftBySections(draft, config.sections)
        : draft;

      await dispatch(
        moduleCrud.createThunk(finalPayload as Record<string, unknown>),
      ).unwrap();

      toast.success(`${config.title} added`, {
        description: "A new record was saved to the database.",
      });

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        `Failed to create ${config.title.toLowerCase().slice(0, -1)}`,
        {
          description:
            error instanceof Error ? error.message : "Please try again.",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    setIsSubmitting(true);
    try {
      const nestedDraft = config.sections
        ? nestDraftBySections(draft, config.sections)
        : draft;

      await dispatch(
        moduleCrud.updateThunk({ _id: editingId, ...nestedDraft } as Record<
          string,
          unknown
        >),
      ).unwrap();

      toast.success(`${config.title} updated`, {
        description: "The existing record was saved to the database.",
      });

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        `Failed to update ${config.title.toLowerCase().slice(0, -1)}`,
        {
          description:
            error instanceof Error ? error.message : "Please try again.",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (row: DashboardModuleRow) => {
    setDraft({ ...buildEmptyDraft(config.fields), ...row.values });
    setEditingId(row.id);
    slugManuallyEditedRef.current = true;
    openForm();
  };

  const handleDelete = (row: DashboardModuleRow) => {
    setRowToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(moduleCrud.deleteThunk(rowToDelete.id)).unwrap();

      if (editingId === rowToDelete.id) {
        resetForm();
      }

      toast.success(`${getSingularTitle(config.title)} removed`, {
        description: "The record was deleted from the database.",
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(
        `Failed to delete ${getSingularTitle(config.title).toLowerCase()}`,
        {
          description:
            error instanceof Error ? error.message : "Please try again.",
        },
      );
    } finally {
      setIsDeleting(false);
      setRowToDelete(null);
    }
  };

  function nestDraftBySections(draft: Record<string, any>, sections: any[]) {
    const nested: Record<string, any> = {};
    const rootFields = ["_id", "slug", "createdAt", "updatedAt"];

    rootFields.forEach((key) => {
      if (draft[key] !== undefined) nested[key] = draft[key];
    });

    sections.forEach((section) => {
      const sectionId = section.id || slugifyValue(section.title);
      const sectionData: Record<string, any> = {
        label: section.title,
      };

      let hasData = false;
      section.fields.forEach((field: any) => {
        if (draft[field.key] !== undefined && draft[field.key] !== "") {
          sectionData[field.key] = draft[field.key];
          hasData = true;
        }
      });

      if (hasData) {
        nested[sectionId] = sectionData;
      }
    });

    return nested;
  }

  return (
    <>
      <GetAllNomination />
      <section className="space-y-6">
        <article
          className={cn(
            "overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm",
          )}
        >
          <div
            className={cn(
              "px-6 py-6 text-white shadow-sh-sm lg:px-8 lg:py-7",
              `bg-linear-to-r ${accentClasses[config.accent]}`,
            )}
          >
            <DashBoardHeader
              config={config}
              records={records}
              openForm={openForm}
              isFormOpen={isFormOpen}
              formId={formId}
            />
          </div>

          <DashboardSummary summaryCards={summaryCards} />
        </article>

        {config.fields.length > 0 && user?.role == "admin" && (
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
            onAutoFill={handleAutoFill}
            onFileChange={handleFileChange}
            onClearFileField={clearFileField}
            onSubmit={handleSubmit}
            onUpdate={handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}

        <DashboardModuleList
          config={config}
          tableId={tableId}
          records={records}
          editingId={editingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddMore={openForm}
        />
        {/* <ShowNominationtable/> */}

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
          title={`Delete ${getSingularTitle(config.title)}`}
          message={`Are you sure you want to remove "${rowToDelete ? getRecordLabel(rowToDelete.values) : "this record"}"? This action cannot be undone.`}
        />
      </section>
    </>
  );
}
