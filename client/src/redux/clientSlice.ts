import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JWTDetails } from "../types/general";

interface ClientState {
    loggedIn: boolean;
    username: string | null;
    id: number | null;
}

const initialState: ClientState = {
    username: null,
    id: null,
    loggedIn: false,
};

export const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        logout: function (state) {
            return { ...state, username: null, id: null, loggedIn: false };
        },

        initializeClient: function (
            state,
            { payload }: PayloadAction<Omit<JWTDetails, "iat">>
        ) {
            return {
                ...state,
                username: payload.username,
                id: payload.id,
                loggedIn: true,
            };
        },
    },
});

export const { logout, initializeClient } = clientSlice.actions;

export default clientSlice.reducer;
