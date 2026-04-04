import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CategoryRecord } from './categoryType';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk,
} from './categoryThunk';

export interface CategoryState {
  allCategory: CategoryRecord[];
  currentCategory: CategoryRecord | null;
  isFetchedCategory: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  allCategory: [],
  currentCategory: null,
  isFetchedCategory: false,
  isLoading: false,
  error: null,
};

function upsertCategory(list: CategoryRecord[], nextCategory: CategoryRecord) {
  const nextId = nextCategory._id;

  if (!nextId) {
    return [nextCategory, ...list];
  }

  const existingIndex = list.findIndex((item) => item._id === nextId);
  if (existingIndex === -1) {
    return [nextCategory, ...list];
  }

  return list.map((item) => (item._id === nextId ? nextCategory : item));
}

function removeCategory(list: CategoryRecord[], id: string) {
  return list.filter((item) => item._id !== id);
}

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<CategoryRecord | null>) => {
      state.currentCategory = action.payload;
    },
    setLoadingCategory: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorCategory: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetCategoryState: (state) => {
      state.allCategory = [];
      state.currentCategory = null;
      state.isFetchedCategory = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.allCategory = action.payload;
        state.isFetchedCategory = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch categories';
      })
      .addCase(createCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.allCategory = [action.payload, ...state.allCategory];
        state.currentCategory = action.payload;
        state.isFetchedCategory = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create category';
      })
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.allCategory = upsertCategory(state.allCategory, action.payload);
        state.currentCategory = action.payload;
        state.isFetchedCategory = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update category';
      })
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.allCategory = removeCategory(state.allCategory, action.payload);

        if (state.currentCategory?._id === action.payload) {
          state.currentCategory = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to delete category';
      });
  },
});

export const {
  setCurrentCategory,
  setLoadingCategory,
  setErrorCategory,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;
