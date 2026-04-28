import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EventRecord } from './eventType';
import {
  createEventThunk,
  deleteEventThunk,
  fetchEventThunk,
  fetchEventBySlugThunk,
  fetchEventsThunk,
  updateEventThunk,
} from './eventThunk';

export interface EventState {
  allEvent: EventRecord[];
  currentEvent: EventRecord | null;
  isFetchedEvent: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: EventState = {
  allEvent: [],
  currentEvent: null,
  isFetchedEvent: false,
  isLoading: false,
  error: null,
};

function extractId(id: string | { $oid: string } | undefined): string | undefined {
  if (!id) return undefined;
  return typeof id === 'string' ? id : id.$oid;
}

function upsertEvent(list: EventRecord[], nextEvent: EventRecord) {
  const nextId = extractId(nextEvent._id);

  if (!nextId) {
    return [nextEvent, ...list];
  }

  const existingIndex = list.findIndex((item) => extractId(item._id) === nextId);
  if (existingIndex === -1) {
    return [nextEvent, ...list];
  }

  return list.map((item) => (extractId(item._id) === nextId ? nextEvent : item));
}

function removeEvent(list: EventRecord[], id: string) {
  return list.filter((item) => extractId(item._id) !== id);
}

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<EventRecord | null>) => {
      state.currentEvent = action.payload;
    },
    setLoadingEvent: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorEvent: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetEventState: (state) => {
      state.allEvent = [];
      state.currentEvent = null;
      state.isFetchedEvent = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.allEvent = action.payload;
        state.isFetchedEvent = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch events';
      })
      .addCase(fetchEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventThunk.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
        state.allEvent = upsertEvent(state.allEvent, action.payload);
        state.isFetchedEvent = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEventThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch event';
      })
      .addCase(fetchEventBySlugThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventBySlugThunk.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
        state.allEvent = upsertEvent(state.allEvent, action.payload);
        state.isFetchedEvent = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEventBySlugThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch event';
      })
      .addCase(createEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.allEvent = [action.payload, ...state.allEvent];
        state.currentEvent = action.payload;
        // state.isFetchedEvent = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create event';
      })
      .addCase(updateEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        state.allEvent = upsertEvent(state.allEvent, action.payload);
        state.currentEvent = action.payload;
        state.isFetchedEvent = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update event';
      })
      .addCase(deleteEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        state.allEvent = removeEvent(state.allEvent, action.payload);

        if (state.currentEvent?._id === action.payload) {
          state.currentEvent = null;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteEventThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to delete event';
      });
  },
});

export const {
  setCurrentEvent,
  setLoadingEvent,
  setErrorEvent,
  resetEventState,
} = eventSlice.actions;

export default eventSlice.reducer;
