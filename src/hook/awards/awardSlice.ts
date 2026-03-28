import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AwardRecord } from './awardType';
import {
  createAwardThunk,
  deleteAwardThunk,
  fetchAwardThunk,
  fetchAwardsThunk,
  updateAwardThunk,
} from './awardThunk';

export interface AwardState {
  allAward: AwardRecord[];
  currentAward: AwardRecord | null;
  isFetchedAward: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AwardState = {
  allAward: [],
  currentAward: null,
  isFetchedAward: false,
  isLoading: false,
  error: null,
};

function upsertAward(list: AwardRecord[], nextAward: AwardRecord) {
  const nextId = nextAward._id;

  if (!nextId) {
    return [nextAward, ...list];
  }

  const existingIndex = list.findIndex((item) => item._id === nextId);
  if (existingIndex === -1) {
    return [nextAward, ...list];
  }

  return list.map((item) => (item._id === nextId ? nextAward : item));
}

function removeAward(list: AwardRecord[], id: string) {
  return list.filter((item) => item._id !== id);
}

export const awardSlice = createSlice({
  name: 'awards',
  initialState,
  reducers: {
    setCurrentAward: (state, action: PayloadAction<AwardRecord | null>) => {
      state.currentAward = action.payload;
    },
    setLoadingAward: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorAward: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAwardState: (state) => {
      state.allAward = [];
      state.currentAward = null;
      state.isFetchedAward = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAwardsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAwardsThunk.fulfilled, (state, action) => {
        state.allAward = action.payload;
        state.isFetchedAward = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAwardsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch awards';
      })
      .addCase(fetchAwardThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAwardThunk.fulfilled, (state, action) => {
        state.currentAward = action.payload;
        state.allAward = upsertAward(state.allAward, action.payload);
        state.isFetchedAward = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAwardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch award';
      })
      .addCase(createAwardThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAwardThunk.fulfilled, (state, action) => {
        state.allAward = [action.payload, ...state.allAward];
        state.currentAward = action.payload;
        state.isFetchedAward = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createAwardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create award';
      })
      .addCase(updateAwardThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAwardThunk.fulfilled, (state, action) => {
        state.allAward = upsertAward(state.allAward, action.payload);
        state.currentAward = action.payload;
        state.isFetchedAward = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateAwardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update award';
      })
      .addCase(deleteAwardThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAwardThunk.fulfilled, (state, action) => {
        state.allAward = removeAward(state.allAward, action.payload);

        if (state.currentAward?._id === action.payload) {
          state.currentAward = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteAwardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to delete award';
      });
  },
});

export const {
  setCurrentAward,
  setLoadingAward,
  setErrorAward,
  resetAwardState,
} = awardSlice.actions;

export default awardSlice.reducer;
