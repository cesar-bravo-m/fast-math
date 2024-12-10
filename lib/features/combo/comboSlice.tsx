import { RootState } from '@/lib/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ComboState {
    value: number;
    maxCombo: number;
}

const initialState: ComboState = {
    value: 0,
    maxCombo: 0
}

export const comboSlice = createSlice({
    name: 'combo',
    initialState,
    reducers: {
        setCombo: (state, action: PayloadAction<number>) => {
            state.value = action.payload
            if (action.payload > state.maxCombo) {
                state.maxCombo = action.payload
            }
        },
        incrementCombo: (state) => {
            state.value += 1
            if (state.value > state.maxCombo) {
                state.maxCombo = state.value
            }
        },
        resetCombo: (state) => {
            state.value = 0
        }
    }
})

export const { setCombo, incrementCombo, resetCombo } = comboSlice.actions
export const selectCombo = (state: RootState) => state.combo.value
export const selectMaxCombo = (state: RootState) => state.combo.maxCombo
export default comboSlice.reducer 