import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RankingCreateInput, RankingRecord, RankingUpdateInput } from './rankingType';

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

export const fetchRankingsThunk = createAsyncThunk<
  RankingRecord[],
  void,
  { rejectValue: string }
>('rankings/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/rankings');
    const data = await parseResponse<{ items?: RankingRecord[] }>(
      response,
      'Failed to fetch rankings'
    );

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch rankings');
  }
});

export const fetchRankingThunk = createAsyncThunk<
  RankingRecord,
  string,
  { rejectValue: string }
>('rankings/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/rankings?id=${encodeURIComponent(id)}`);
    const data = await parseResponse<{ item?: RankingRecord }>(
      response,
      'Failed to fetch ranking'
    );

    if (!data.item) {
      throw new Error('Ranking not found');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch ranking');
  }
});

export const createRankingThunk = createAsyncThunk<
  RankingRecord,
  RankingCreateInput,
  { rejectValue: string }
>('rankings/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/rankings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: RankingRecord }>(
      response,
      'Failed to create ranking'
    );

    if (!data.item) {
      throw new Error('Unable to create ranking');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create ranking');
  }
});

export const updateRankingThunk = createAsyncThunk<
  RankingRecord,
  RankingUpdateInput,
  { rejectValue: string }
>('rankings/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/rankings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: RankingRecord }>(
      response,
      'Failed to update ranking'
    );

    if (!data.item) {
      throw new Error('Unable to update ranking');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update ranking');
  }
});

export const deleteRankingThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('rankings/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/rankings?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await parseResponse<{ deletedId?: string }>(
      response,
      'Failed to delete ranking'
    );

    return data.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete ranking');
  }
});
