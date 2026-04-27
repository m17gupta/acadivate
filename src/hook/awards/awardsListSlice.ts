import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createAwardListThunk,
  deleteAwardListThunk,
  fetchAwardsListThunk,
  updateAwardListThunk,
} from './awardsListThunk';

export interface AwardsListState {
  allAwardsList: any[];
  isFetchedAwardsList: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AwardsListState = {
  allAwardsList: [],
  isFetchedAwardsList: false,
  isLoading: false,
  error: null,
};

export const awardsListSlice = createSlice({
  name: 'awardsList',
  initialState,
  reducers: {
    resetAwardsListState: (state) => {
      state.allAwardsList = [];
      state.isFetchedAwardsList = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAwardsListThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAwardsListThunk.fulfilled, (state, action) => {
        state.allAwardsList = action.payload;
        state.isFetchedAwardsList = true;
        state.isLoading = false;
      })
      .addCase(fetchAwardsListThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createAwardListThunk.fulfilled, (state, action) => {
        state.allAwardsList = [action.payload, ...state.allAwardsList];
      })
      .addCase(updateAwardListThunk.fulfilled, (state, action) => {
        state.allAwardsList = state.allAwardsList.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteAwardListThunk.fulfilled, (state, action) => {
        state.allAwardsList = state.allAwardsList.filter((item) => item._id !== action.payload);
      });
  },
});

export const { resetAwardsListState } = awardsListSlice.actions;
export default awardsListSlice.reducer;
