'use client'
import { useGetExerciseQuery } from "@/lib/features/exercise/exerciseSlice"
import { useState } from "react"
import styles from './Exercise.module.css'

export const Exercise = () => {
    const [answer, setAnswer] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
    const { data, isError, isLoading, isSuccess, refetch } = useGetExerciseQuery()

    if (isLoading) return <div className={styles.container}><div className={styles.loader}>Loading...</div></div>
    if (isError) return <div className={styles.container}><div className={styles.error}>Oops! Something went wrong</div></div>
    if (!isSuccess || !data) return null

    const checkAnswer = async () => {
        if (answer === null) return
        
        const correctAnswer = data.exercises[0].factorOne * data.exercises[0].factorTwo
        if (answer === correctAnswer) {
            setFeedback('correct')
            setAnswer(null)
            await new Promise(resolve => setTimeout(resolve, 800))
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

    const factorOne = data.exercises[0].factorOne
    const factorTwo = data.exercises[0].factorTwo

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Math Challenge!</h2>
                <div className={styles.problem}>
                    <span className={styles.factor}>{factorOne}</span>
                    <span className={styles.operator}>×</span>
                    <span className={styles.factor}>{factorTwo}</span>
                    <span className={styles.equals}>=</span>
                </div>
                <div className={styles.inputGroup}>
                    <input 
                        type="number"
                        className={styles.input}
                        value={Number.isNaN(answer) || answer === null ? '' : answer} 
                        onChange={(e) => {
                            setAnswer(parseInt(e.target.value))
                            setFeedback(null)
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your answer..."
                    />
                    <button 
                        className={`${styles.button} ${answer === null ? styles.buttonDisabled : ''}`}
                        onClick={checkAnswer}
                        disabled={answer === null}
                    >
                        Check Answer
                    </button>
                </div>
                {feedback && (
                    <div className={`${styles.feedback} ${styles[feedback]}`}>
                        {feedback === 'correct' ? '🎉 Correct! Great job!' : '😅 Try again!'}
                    </div>
                )}
            </div>
        </div>
    )
}