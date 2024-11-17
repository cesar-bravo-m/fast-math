'use client'
import { useGetExerciseQuery } from "@/lib/features/exercise/exerciseSlice"
import { useState } from "react"

export const Exercise = () => {
    const [answer, setAnswer] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
    const { data, isError, isLoading, isSuccess, refetch } = useGetExerciseQuery()

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error</p>
    if (!isSuccess || !data) return null

    const checkAnswer = async () => {
        if (answer === null) return
        
        const correctAnswer = data.factorOne * data.factorTwo
        if (answer === correctAnswer) {
            setFeedback('correct')
            setAnswer(null)
            await new Promise(resolve => setTimeout(resolve, 500))
            refetch()
        } else {
            setFeedback('incorrect')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            checkAnswer()
        }
    }

    const factorOne = data.factorOne
    const factorTwo = data.factorTwo

    return (
        <div>
            <p>
                {factorOne} * {factorTwo} =
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                    type="number" 
                    value={Number.isNaN(answer) || answer === null ? '' : answer} 
                    onChange={(e) => {
                        setAnswer(parseInt(e.target.value))
                        setFeedback(null)
                    }}
                    onKeyDown={handleKeyPress}
                />
                <button 
                    onClick={checkAnswer}
                    disabled={answer === null}
                >
                    Check Answer
                </button>
            </div>
            {feedback && (
                <p style={{ color: feedback === 'correct' ? 'green' : 'red' }}>
                    {feedback === 'correct' ? 'Correct!' : 'Try again'}
                </p>
            )}
        </div>
    )
}