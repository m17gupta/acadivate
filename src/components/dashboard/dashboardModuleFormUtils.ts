import type { DashboardModuleField } from './dashboardModules';

export type DraftValue = string | string[];

export type DashboardModuleDraft = Record<string, DraftValue>;

export function buildEmptyDraft(fields: DashboardModuleField[]) {
  return fields.reduce<DashboardModuleDraft>((draft, field) => {
    draft[field.key] = field.type === 'file' && field.multiple ? [] : '';
    return draft;
  }, {});
}

export function readFileAsDataUrl(file: File) {
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

export function getTextValue(value: DraftValue | undefined) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return typeof value === 'string' ? value : '';
}

export function getFileValues(value: DraftValue | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

export function getSingularTitle(title: string) {
  return title.endsWith('s') ? title.slice(0, -1) : title;
}

export function getRecordLabel(values: DashboardModuleDraft) {
  const candidateKeys = ['title', 'name', 'nomineeName', 'institution', 'award', 'subject'];

  for (const key of candidateKeys) {
    const label = getTextValue(values[key]);
    if (label) {
      return label;
    }
  }

  return 'this record';
}

export function slugifyValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
