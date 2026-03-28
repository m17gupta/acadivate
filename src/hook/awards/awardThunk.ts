import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AwardCreateInput, AwardRecord, AwardUpdateInput } from './awardType';

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

export const fetchAwardsThunk = createAsyncThunk<
  AwardRecord[],
  void,
  { rejectValue: string }
>('awards/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/awards');
    const data = await parseResponse<{ items?: AwardRecord[] }>(
      response,
      'Failed to fetch awards'
    );

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch awards');
  }
});

export const fetchAwardThunk = createAsyncThunk<
  AwardRecord,
  string,
  { rejectValue: string }
>('awards/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/awards?id=${encodeURIComponent(id)}`);
    const data = await parseResponse<{ item?: AwardRecord }>(
      response,
      'Failed to fetch award'
    );

    if (!data.item) {
      throw new Error('Award not found');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch award');
  }
});

export const createAwardThunk = createAsyncThunk<
  AwardRecord,
  AwardCreateInput,
  { rejectValue: string }
>('awards/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/awards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: AwardRecord }>(
      response,
      'Failed to create award'
    );

    if (!data.item) {
      throw new Error('Unable to create award');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create award');
  }
});

export const updateAwardThunk = createAsyncThunk<
  AwardRecord,
  AwardUpdateInput,
  { rejectValue: string }
>('awards/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/awards', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: AwardRecord }>(
      response,
      'Failed to update award'
    );

    if (!data.item) {
      throw new Error('Unable to update award');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update award');
  }
});

export const deleteAwardThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('awards/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/awards?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await parseResponse<{ deletedId?: string }>(
      response,
      'Failed to delete award'
    );

    return data.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete award');
  }
});
