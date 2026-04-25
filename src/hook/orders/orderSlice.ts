import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OrderType } from './orderType';
import { fetchOrdersThunk, createOrderThunk } from './orderThunk';

export interface OrderState {
  allOrders: OrderType[];
  currentOrder: OrderType | null;
  isFetchedOrder: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  allOrders: [],
  currentOrder: null,
  isFetchedOrder: false,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<OrderType | null>) => {
      state.currentOrder = action.payload;
    },
    setLoadingOrder: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorOrder: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.allOrders = action.payload;
        state.isFetchedOrder = true;
        state.isLoading = false;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.allOrders = [action.payload, ...state.allOrders];
        state.isLoading = false;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create order';
      });
  },
});

export const { setCurrentOrder, setLoadingOrder, setErrorOrder } = orderSlice.actions;
export default orderSlice.reducer;
