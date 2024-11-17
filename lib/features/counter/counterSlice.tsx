import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0
    },
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementBy: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        }
    },
    selectors: {
        selectCount: (state) => state.value
    }
})

export const { increment, decrement } = counterSlice.actions

export const selectCount = (state: RootState) => state.counter.value