import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const scoreSlice = createSlice({
    name: 'score',
    initialState: {
        value: 0
    },
    reducers: {
        increase: state => {
            state.value += 1
        },
        decrease: state => {
            state.value -= 1
        },
        incrementBy: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        }
    },
    selectors: {
        selectValue: state => state.value
    }
})

export const { increase, decrease, incrementBy } = scoreSlice.actions
export const { selectValue } = scoreSlice.selectors