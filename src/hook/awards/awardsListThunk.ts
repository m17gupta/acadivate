import { createAsyncThunk } from '@reduxjs/toolkit';

// Note: These use the same base logic as other thunks. 
// For now, they target /api/awards-list which should be implemented in the backend.

export const fetchAwardsListThunk = createAsyncThunk(
  'awardsList/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/awards-list');
      if (!response.ok) throw new Error('Failed to fetch awards list');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch awards list');
      return data.items ?? [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch');
    }
  }
);

export const createAwardListThunk = createAsyncThunk(
  'awardsList/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/awards-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to create');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to create');
      return data.item;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create');
    }
  }
);

export const updateAwardListThunk = createAsyncThunk(
  'awardsList/update',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/awards-list', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      return data.item;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update');
    }
  }
);

export const deleteAwardListThunk = createAsyncThunk(
  'awardsList/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/awards-list?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete');
      return data.deletedId ?? id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete');
    }
  }
);
