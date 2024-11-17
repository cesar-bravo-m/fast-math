import { ExerciseResponseData } from "@/app/api/exercise/route";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exerciseApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getExercise: builder.query<ExerciseResponseData, void>({ query: () => 'exercise' })
    })
})

export const { useGetExerciseQuery } = exerciseApi
