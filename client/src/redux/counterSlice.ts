import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface CounterState {
    value: number;
}

// Define the initial state using that type
const initialState: CounterState = {
    value: 0,
};

export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        // function
        increment: function (state) {
            state.value += 1;
        },
        decrement: function (state) {
            state.value -= 1;
        },

        // object destructor
        incrementByAmount: function (
            state,
            { payload }: PayloadAction<number>
        ) {
            state.value += payload;
        },
    },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
