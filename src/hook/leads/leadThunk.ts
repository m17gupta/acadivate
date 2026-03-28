import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LeadCreateInput, LeadRecord, LeadUpdateInput } from './leadType';

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

export const fetchLeadsThunk = createAsyncThunk<
  LeadRecord[],
  void,
  { rejectValue: string }
>('leads/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/leads');
    const data = await parseResponse<{ items?: LeadRecord[] }>(
      response,
      'Failed to fetch leads'
    );

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch leads');
  }
});

export const fetchLeadThunk = createAsyncThunk<
  LeadRecord,
  string,
  { rejectValue: string }
>('leads/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/leads?id=${encodeURIComponent(id)}`);
    const data = await parseResponse<{ item?: LeadRecord }>(
      response,
      'Failed to fetch lead'
    );

    if (!data.item) {
      throw new Error('Lead not found');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lead');
  }
});

export const createLeadThunk = createAsyncThunk<
  LeadRecord,
  LeadCreateInput,
  { rejectValue: string }
>('leads/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: LeadRecord }>(
      response,
      'Failed to create lead'
    );

    if (!data.item) {
      throw new Error('Unable to create lead');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create lead');
  }
});

export const updateLeadThunk = createAsyncThunk<
  LeadRecord,
  LeadUpdateInput,
  { rejectValue: string }
>('leads/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/leads', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: LeadRecord }>(
      response,
      'Failed to update lead'
    );

    if (!data.item) {
      throw new Error('Unable to update lead');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update lead');
  }
});

export const deleteLeadThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('leads/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await parseResponse<{ deletedId?: string }>(
      response,
      'Failed to delete lead'
    );

    return data.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete lead');
  }
});
