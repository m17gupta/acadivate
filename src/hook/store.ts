import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import pagesReducer from './pages/pagesSlice';
import commentsReducer from './comments/commentSlice';
import eventReducer from './events/eventSlice';
import awardReducer from './awards/awardSlice';
import awardsListReducer from './awards/awardsListSlice';
import rankingReducer from './rankings/rankingSlice';
import leadReducer from './leads/leadSlice';
import nominationReducer from './nominations/nominationSlice';
import categoryReducer from './categories/categorySlice';
import registrationReducer from './registrations/registrationSlice';
import sliderReducer from './sliders/sliderSlice';
import dashboardStatsReducer from './dashboard/dashboardStatsSlice';
import orderReducer from './orders/orderSlice';
import fileReducer from './files/fileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pages: pagesReducer,
    comments: commentsReducer,
    events: eventReducer,
    awards: awardReducer,
    awardsList: awardsListReducer,
    rankings: rankingReducer,
    leads: leadReducer,
    nominations: nominationReducer,
    categories: categoryReducer,
    registrations: registrationReducer,
    sliders: sliderReducer,
    dashboardStats: dashboardStatsReducer,
    orders: orderReducer,
    files: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
