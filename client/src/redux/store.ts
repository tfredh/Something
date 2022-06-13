import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./clientSlice";
import counterSlice from "./counterSlice";

const store = configureStore({
    reducer: {
        counter: counterSlice,
        client: authSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
