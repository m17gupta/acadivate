import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CategoryRecord } from './categoryType';

type ApiResponse<T> = {
  success?: boolean;
  items?: T[];
  item?: T;
  deletedId?: string;
  error?: string;
  message?: string;
};

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const data = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || fallbackMessage);
  }

  return data as T;
}

export const fetchCategoriesThunk = createAsyncThunk<
  CategoryRecord[],
  void,
  { rejectValue: string }
>('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/categories');
    const data = await parseResponse<{ items?: CategoryRecord[] }>(
      response,
      'Failed to fetch categories'
    );

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
});

export const createCategoryThunk = createAsyncThunk<
  CategoryRecord,
  CategoryRecord,
  { rejectValue: string }
>('categories/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: CategoryRecord }>(
      response,
      'Failed to create category'
    );

    if (!data.item) {
      throw new Error('Unable to create category');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create category');
  }
});

export const updateCategoryThunk = createAsyncThunk<
  CategoryRecord,
  CategoryRecord,
  { rejectValue: string }
>('categories/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: CategoryRecord }>(
      response,
      'Failed to update category'
    );

    if (!data.item) {
      throw new Error('Unable to update category');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update category');
  }
});

export const deleteCategoryThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('categories/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await parseResponse<{ deletedId?: string }>(
      response,
      'Failed to delete category'
    );

    return data.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete category');
  }
});
