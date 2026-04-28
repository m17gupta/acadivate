import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AwardCategoryEvent } from './awardCategoryType';
import {
  createAwardCategoryThunk,
  deleteAwardCategoryThunk,
  fetchAwardCategoryThunk,
  fetchAwardCategoriesThunk,
  updateAwardCategoryThunk,
} from './awardCategoryThunk';

export interface AwardCategoriesState {
  allAwardCategories: AwardCategoryEvent[];
  currentAwardCategory: AwardCategoryEvent | null;
  isFetched: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AwardCategoriesState = {
  allAwardCategories: [],
  currentAwardCategory: null,
  isFetched: false,
  isLoading: false,
  error: null,
};

function upsertCategory(list: AwardCategoryEvent[], nextItem: AwardCategoryEvent) {
  const nextId = nextItem._id;

  if (!nextId) {
    return [nextItem, ...list];
  }

  const existingIndex = list.findIndex((item) => item._id === nextId);
  if (existingIndex === -1) {
    return [nextItem, ...list];
  }

  return list.map((item) => (item._id === nextId ? nextItem : item));
}

function removeCategory(list: AwardCategoryEvent[], id: string) {
  return list.filter((item) => item._id !== id);
}

export const awardCategoriesSlice = createSlice({
  name: 'awardCategories',
  initialState,
  reducers: {
    setCurrentAwardCategory: (state, action: PayloadAction<AwardCategoryEvent | null>) => {
      state.currentAwardCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAwardCategoriesState: (state) => {
      state.allAwardCategories = [];
      state.currentAwardCategory = null;
      state.isFetched = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAwardCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAwardCategoriesThunk.fulfilled, (state, action) => {
        state.allAwardCategories = action.payload;
        state.isFetched = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAwardCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch award categories';
      })
      // Fetch One
      .addCase(fetchAwardCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAwardCategoryThunk.fulfilled, (state, action) => {
        state.currentAwardCategory = action.payload;
        state.allAwardCategories = upsertCategory(state.allAwardCategories, action.payload);
        state.isFetched = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAwardCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch award category';
      })
      // Create
      .addCase(createAwardCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAwardCategoryThunk.fulfilled, (state, action) => {
        state.allAwardCategories = [action.payload, ...state.allAwardCategories];
        state.currentAwardCategory = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createAwardCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create award category';
      })
      // Update
      .addCase(updateAwardCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAwardCategoryThunk.fulfilled, (state, action) => {
        state.allAwardCategories = upsertCategory(state.allAwardCategories, action.payload);
        state.currentAwardCategory = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateAwardCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update award category';
      })
      // Delete
      .addCase(deleteAwardCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAwardCategoryThunk.fulfilled, (state, action) => {
        state.allAwardCategories = removeCategory(state.allAwardCategories, action.payload);
        if (state.currentAwardCategory?._id === action.payload) {
          state.currentAwardCategory = null;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteAwardCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete award category';
      });
  },
});

export const {
  setCurrentAwardCategory,
  setLoading,
  setError,
  resetAwardCategoriesState,
} = awardCategoriesSlice.actions;

export default awardCategoriesSlice.reducer;
