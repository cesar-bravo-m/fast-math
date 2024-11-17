'use client'

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { increment, decrement, selectCount } from "@/lib/features/counter/counterSlice";

export default function Counter() {
    const count: number = useAppSelector(selectCount)
    const dispatch = useAppDispatch()

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
        </div>
    )
}

