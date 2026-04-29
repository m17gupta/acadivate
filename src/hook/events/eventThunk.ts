import { createAsyncThunk } from '@reduxjs/toolkit';
import type { EventCreateInput, EventRecord, EventUpdateInput } from './eventType';

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

export const fetchEventsThunk = createAsyncThunk<
  EventRecord[],
  void,
  { rejectValue: string }
>('events/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/events');
    const data = await parseResponse<{ items?: EventRecord[] }>(
      response,
      'Failed to fetch events'
    );

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch events');
  }
});

export const fetchEventThunk = createAsyncThunk<
  EventRecord,
  string,
  { rejectValue: string }
>('events/fetchOne', async (slug, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/events?slug=${encodeURIComponent(slug)}`);
    const data = await parseResponse<{ item?: EventRecord }>(
      response,
      'Failed to fetch event'
    );

    if (!data.item) {
      throw new Error('Event not found');
    }
 
    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch event');
  }
});

export const fetchEventBySlugThunk = createAsyncThunk<
  EventRecord,
  string,
  { rejectValue: string }
>('events/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/events?slug=${encodeURIComponent(slug)}`);
    const data = await parseResponse<{ item?: EventRecord }>(
      response,
      'Failed to fetch event'
    );

    if (!data.item) {
      throw new Error('Event not found');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch event');
  }
});

export const createEventThunk = createAsyncThunk<
  EventRecord,
  EventCreateInput,
  { rejectValue: string }
>('events/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: EventRecord }>(
      response,
      'Failed to create event'
    );

    if (!data.item) {
      throw new Error('Unable to create event');
    }
     console.log("data.item",data)
    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create event');
  }
});

export const updateEventThunk = createAsyncThunk<
  EventRecord,
  EventUpdateInput,
  { rejectValue: string }
>('events/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: EventRecord }>(
      response,
      'Failed to update event'
    );

    if (!data.item) {
      throw new Error('Unable to update event');
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update event');
  }
});

export const deleteEventThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('events/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await parseResponse<{ deletedId?: string }>(
      response,
      'Failed to delete event'
    );

    return data.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete event');
  }
});
