import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  NominationCreateInput,
  NominationFormType,
  NominationRecord,
  NominationUpdateInput,
} from "./nominationType";

type ApiResponse<T> = {
  success: boolean;
  items?: T[];
  data?: T;
  deletedId?: string;
  error: string;
  message: string;
};

async function parseResponse<T>(
  response: any,
  fallbackMessage: string,
): Promise<T> {
  const data = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!response.success) {
    throw new Error(data?.error || data?.message || fallbackMessage);
  }

  return data as T;
}

export const fetchNominationsThunk = createAsyncThunk<
  NominationRecord[],
  { userId?: string; role?: string } | void,
  { rejectValue: string }
>("nominations/fetchAll", async (params, { rejectWithValue }) => {
  try {
    let url = "/api/nominations";
    if (params) {
      const { userId, role } = params as { userId?: string; role?: string };
      const searchParams = new URLSearchParams();
      if (userId) searchParams.append("userId", userId);
      if (role) searchParams.append("role", role);
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }
    const response = await fetch(url);
    const data = await response.json();

    return data.items ?? [];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch nominations",
    );
  }
});

export const fetchNominationThunk = createAsyncThunk<
  NominationFormType,
  string,
  { rejectValue: string }
>("nominations/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `/api/nominations?id=${encodeURIComponent(id)}`,
    );
    const data = await parseResponse<{ item?: NominationFormType }>(
      response,
      "Failed to fetch nomination",
    );

    if (!data.item) {
      throw new Error("Nomination not found");
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch nomination",
    );
  }
});

export const createNominationThunk = createAsyncThunk<
  any,
  NominationFormType,
  { rejectValue: string }
>("nominations/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/nominations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });


  
    const req = await response.json();

   
    if (req.success) {
      return req.item;
    } else {
      throw new Error("Unable to create nomination");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create nomination",
    );
  }
});

export const updateNominationThunk = createAsyncThunk<
  NominationFormType,
  NominationFormType,
  { rejectValue: string }
>("nominations/update", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/nominations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ item?: NominationFormType }>(
      response,
      "Failed to update nomination",
    );

    if (!data.item) {
      throw new Error("Unable to update nomination");
    }

    return data.item;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update nomination",
    );
  }
});

export const deleteNominationThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("nominations/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `/api/nominations?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

    const data= await response.json();
    return data?.deletedId ?? id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete nomination",
    );
  }
});
