import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import pagesReducer from './pages/pagesSlice';
import commentsReducer from './comments/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pages: pagesReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
