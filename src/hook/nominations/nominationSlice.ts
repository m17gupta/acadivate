import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NominationFormType } from './nominationType';
import {
  createNominationThunk,
  deleteNominationThunk,
  fetchNominationThunk,
  fetchNominationsThunk,
  updateNominationThunk,
} from './nominationThunk';


export interface NominationState {
  allNomination: NominationFormType[];
  currentNomination: NominationFormType | null;
  isFetchedNomination: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: NominationState = {
  allNomination: [],
  currentNomination: null,
  isFetchedNomination: false,
  isLoading: false,
  error: null,
};

function upsertNomination(list: NominationFormType[], nextNomination: NominationFormType & { _id?: string }) {
  const nextId = (nextNomination as any)._id;
  if (!nextId) {
    return [nextNomination, ...list];
  }
  const existingIndex = list.findIndex((item: any) => item._id === nextId);
  if (existingIndex === -1) {
    return [nextNomination, ...list];
  }
  return list.map((item: any) => (item._id === nextId ? nextNomination : item));
}

function removeNomination(list: (NominationFormType & { _id?: string })[], id: string) {
  return list.filter((item: any) => item._id !== id);
}

export const nominationSlice = createSlice({
  name: 'nominations',
  initialState,
  reducers: {
    setCurrentNomination: (state, action: PayloadAction<NominationFormType | null>) => {
      state.currentNomination = action.payload;
    },
    setLoadingNomination: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorNomination: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetNominationState: (state) => {
      state.allNomination = [];
      state.currentNomination = null;
      state.isFetchedNomination = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNominationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNominationsThunk.fulfilled, (state, action) => {
        state.allNomination = action.payload;
        state.isFetchedNomination = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchNominationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || 'Failed to fetch nominations';
      })
      .addCase(fetchNominationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNominationThunk.fulfilled, (state, action) => {
        state.currentNomination = action.payload;
        state.allNomination = upsertNomination(state.allNomination, action.payload);
        state.isFetchedNomination = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchNominationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || 'Failed to fetch nomination';
      })
      .addCase(createNominationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNominationThunk.fulfilled, (state, action) => {
        state.allNomination = [action.payload, ...state.allNomination];
        state.currentNomination = action.payload;
        state.isFetchedNomination = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createNominationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || 'Failed to create nomination';
      })
      .addCase(updateNominationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNominationThunk.fulfilled, (state, action) => {
        state.allNomination = upsertNomination(state.allNomination, action.payload);
        state.currentNomination = action.payload;
        state.isFetchedNomination = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateNominationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || 'Failed to update nomination';
      })
      .addCase(deleteNominationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNominationThunk.fulfilled, (state, action) => {
        state.allNomination = removeNomination(state.allNomination, action.payload);

        if (state.currentNomination?._id === action.payload) {
          state.currentNomination = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteNominationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || 'Failed to delete nomination';
      });
  },
});

export const {
  setCurrentNomination,
  setLoadingNomination,
  setErrorNomination,
  resetNominationState,
} = nominationSlice.actions;

export default nominationSlice.reducer;
