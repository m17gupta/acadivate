import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadRecord } from './leadType';
import {
  createLeadThunk,
  deleteLeadThunk,
  fetchLeadThunk,
  fetchLeadsThunk,
  updateLeadThunk,
} from './leadThunk';

export interface LeadState {
  allLead: LeadRecord[];
  currentLead: LeadRecord | null;
  isFetchedLead: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  allLead: [],
  currentLead: null,
  isFetchedLead: false,
  isLoading: false,
  error: null,
};

function upsertLead(list: LeadRecord[], nextLead: LeadRecord) {
  const nextId = nextLead._id;

  if (!nextId) {
    return [nextLead, ...list];
  }

  const existingIndex = list.findIndex((item) => item._id === nextId);
  if (existingIndex === -1) {
    return [nextLead, ...list];
  }

  return list.map((item) => (item._id === nextId ? nextLead : item));
}

function removeLead(list: LeadRecord[], id: string) {
  return list.filter((item) => item._id !== id);
}

export const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setCurrentLead: (state, action: PayloadAction<LeadRecord | null>) => {
      state.currentLead = action.payload;
    },
    setLoadingLead: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorLead: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetLeadState: (state) => {
      state.allLead = [];
      state.currentLead = null;
      state.isFetchedLead = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadsThunk.fulfilled, (state, action) => {
        state.allLead = action.payload;
        state.isFetchedLead = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch leads';
      })
      .addCase(fetchLeadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadThunk.fulfilled, (state, action) => {
        state.currentLead = action.payload;
        state.allLead = upsertLead(state.allLead, action.payload);
        state.isFetchedLead = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchLeadThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch lead';
      })
      .addCase(createLeadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLeadThunk.fulfilled, (state, action) => {
        state.allLead = [action.payload, ...state.allLead];
        state.currentLead = action.payload;
        state.isFetchedLead = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createLeadThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create lead';
      })
      .addCase(updateLeadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeadThunk.fulfilled, (state, action) => {
        state.allLead = upsertLead(state.allLead, action.payload);
        state.currentLead = action.payload;
        state.isFetchedLead = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateLeadThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update lead';
      })
      .addCase(deleteLeadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLeadThunk.fulfilled, (state, action) => {
        state.allLead = removeLead(state.allLead, action.payload);

        if (state.currentLead?._id === action.payload) {
          state.currentLead = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteLeadThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to delete lead';
      });
  },
});

export const {
  setCurrentLead,
  setLoadingLead,
  setErrorLead,
  resetLeadState,
} = leadSlice.actions;

export default leadSlice.reducer;
