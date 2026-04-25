import { createAsyncThunk } from "@reduxjs/toolkit";
import type { OrderType } from "./orderType";

type ApiResponse<T> = {
  success: boolean;
  items?: T[];
  data?: T;
  error: string;
  message: string;
};

export const fetchOrdersThunk = createAsyncThunk<
  OrderType[],
  { role: string, ids: string[] },
  { rejectValue: string }
>("orders/fetchAll", async ({ role, ids }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/orders?role=${role}&ids=${ids}`);
    const data = await response.json();
    if (data.success) {
      return data.items ?? [];
    } else {
      throw new Error(data.error || "Failed to fetch orders");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch orders",
    );
  }
});

export const createOrderThunk = createAsyncThunk<
  OrderType,
  OrderType,
  { rejectValue: string }
>("orders/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.success) {
      return data.item;
    } else {
      throw new Error(data.error || "Unable to create order");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create order",
    );
  }
});
