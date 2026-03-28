import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RankingRecord } from './rankingType';
import {
  createRankingThunk,
  deleteRankingThunk,
  fetchRankingThunk,
  fetchRankingsThunk,
  updateRankingThunk,
} from './rankingThunk';

export interface RankingState {
  allRanking: RankingRecord[];
  currentRanking: RankingRecord | null;
  isFetchedRanking: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: RankingState = {
  allRanking: [],
  currentRanking: null,
  isFetchedRanking: false,
  isLoading: false,
  error: null,
};

function upsertRanking(list: RankingRecord[], nextRanking: RankingRecord) {
  const nextId = nextRanking._id;

  if (!nextId) {
    return [nextRanking, ...list];
  }

  const existingIndex = list.findIndex((item) => item._id === nextId);
  if (existingIndex === -1) {
    return [nextRanking, ...list];
  }

  return list.map((item) => (item._id === nextId ? nextRanking : item));
}

function removeRanking(list: RankingRecord[], id: string) {
  return list.filter((item) => item._id !== id);
}

export const rankingSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {
    setCurrentRanking: (state, action: PayloadAction<RankingRecord | null>) => {
      state.currentRanking = action.payload;
    },
    setLoadingRanking: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorRanking: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetRankingState: (state) => {
      state.allRanking = [];
      state.currentRanking = null;
      state.isFetchedRanking = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRankingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRankingsThunk.fulfilled, (state, action) => {
        state.allRanking = action.payload;
        state.isFetchedRanking = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchRankingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch rankings';
      })
      .addCase(fetchRankingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRankingThunk.fulfilled, (state, action) => {
        state.currentRanking = action.payload;
        state.allRanking = upsertRanking(state.allRanking, action.payload);
        state.isFetchedRanking = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchRankingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch ranking';
      })
      .addCase(createRankingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRankingThunk.fulfilled, (state, action) => {
        state.allRanking = [action.payload, ...state.allRanking];
        state.currentRanking = action.payload;
        state.isFetchedRanking = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createRankingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create ranking';
      })
      .addCase(updateRankingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRankingThunk.fulfilled, (state, action) => {
        state.allRanking = upsertRanking(state.allRanking, action.payload);
        state.currentRanking = action.payload;
        state.isFetchedRanking = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateRankingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update ranking';
      })
      .addCase(deleteRankingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRankingThunk.fulfilled, (state, action) => {
        state.allRanking = removeRanking(state.allRanking, action.payload);

        if (state.currentRanking?._id === action.payload) {
          state.currentRanking = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteRankingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to delete ranking';
      });
  },
});

export const {
  setCurrentRanking,
  setLoadingRanking,
  setErrorRanking,
  resetRankingState,
} = rankingSlice.actions;

export default rankingSlice.reducer;
