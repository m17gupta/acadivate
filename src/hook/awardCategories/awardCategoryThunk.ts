import { createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  AwardCategoryEvent, 
  AwardCategoryEventCreateInput, 
  AwardCategoryEventUpdateInput 
} from './awardCategoryType';

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

export const fetchAwardCategoriesThunk = createAsyncThunk<
  AwardCategoryEvent[],
  void,
  { rejectValue: string }
>('awardCategories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/awards-list');
    const data = await parseResponse<{ items?: AwardCategoryEvent[] }>(
      response,
      'Failed to fetch award categories'
    );

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch award categories');
  }
});

export const fetchAwardCategoryThunk = createAsyncThunk<
  AwardCategoryEvent,
  string,
  { rejectValue: string }
>('awardCategories/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/awards-list?id=${encodeURIComponent(id)}`);
    const data = await parseResponse<{ item?: AwardCategoryEvent }>(
      response,
      'Failed to fetch award category'
    );

    if (!data.item) {
      throw new Error('Award category not found');
    }

    console.log("categoriesAwar", data.item)

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch award category');
  }
});

export const createAwardCategoryThunk = createAsyncThunk<
  AwardCategoryEvent,
  AwardCategoryEventCreateInput,
  { rejectValue: string }
>('awardCategories/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/awards-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: AwardCategoryEvent }>(
      response,
      'Failed to create award category'
    );

    if (!data.item) {
      throw new Error('Unable to create award category');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create award category');
  }
});

export const updateAwardCategoryThunk = createAsyncThunk<
  AwardCategoryEvent,
  AwardCategoryEventUpdateInput,
  { rejectValue: string }
>('awardCategories/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/awards-list', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: AwardCategoryEvent }>(
      response,
      'Failed to update award category'
    );

    if (!data.item) {
      throw new Error('Unable to update award category');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update award category');
  }
});

export const deleteAwardCategoryThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('awardCategories/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/awards-list?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await parseResponse<{ deletedId?: string }>(
      response,
      'Failed to delete award category'
    );

    return data.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete award category');
  }
});
