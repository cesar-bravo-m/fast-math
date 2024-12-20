import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type ExerciseResponseData = {
    factorOne: number
    factorTwo: number
}

export async function GET(req: NextRequest, res: NextResponse<ExerciseResponseData[]>) {
    const exercises: ExerciseResponseData[] = []
    for (let i = 0; i < 10; i++) {
        const factorOne = Math.floor(Math.random() * 10)
        const factorTwo = Math.floor(Math.random() * 10)
        exercises.push({ factorOne, factorTwo })
    }
    return NextResponse.json({ exercises })
}