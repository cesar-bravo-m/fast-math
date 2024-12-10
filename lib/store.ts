import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./features/counter/counterSlice";
import { exerciseApi } from "./features/exercise/exerciseSlice";
import { scoreSlice } from './features/score/scoreSlice'
import { comboSlice } from "./features/combo/comboSlice";

const rootReducer = combineSlices(counterSlice, exerciseApi, scoreSlice, comboSlice)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(exerciseApi.middleware)
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']