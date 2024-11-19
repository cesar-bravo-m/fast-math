'use client'
import { useState, memo, useRef, useEffect } from "react";
import "./disco.css";
import { useGetExerciseQuery } from "@/lib/features/exercise/exerciseSlice";
import type { ExerciseResponseData } from "@/app/api/exercise/route";

interface DiscoPrompt {
    prompt: string;
    givenAnswer: string;
    correct: boolean | null;
    style: string;
    actualAnswer: string;
}

const convertExercisesToPrompts = (exercises: ExerciseResponseData[]): DiscoPrompt[] => {
    return exercises.map(exercise => ({
        prompt: `${exercise.factorOne} × ${exercise.factorTwo} =`,
        givenAnswer: '',
        correct: null,
        style: Math.random() > 0.5 ? 'logic' : 'drama',
        actualAnswer: (exercise.factorOne * exercise.factorTwo).toString()
    }));
};

const PastTexts = memo(({ pastText }: { pastText: DiscoPrompt[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollPercentage, setScrollPercentage] = useState(100);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const maxScroll = scrollHeight - clientHeight;
            const percentage = maxScroll === 0 ? 100 : ((scrollTop + clientHeight) / scrollHeight) * 100;
            setScrollPercentage(percentage);
        };

        container.scrollTop = container.scrollHeight;

        container.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [pastText]);

    return (
        <div className="disco-past-text-wrapper">
            <div className="disco-scroll-indicator">
                <div 
                    className="disco-scroll-progress"
                    style={{ height: `${scrollPercentage}%` }}
                />
            </div>
            <div className="disco-past-text" ref={containerRef}>
                <div className="disco-past-text-spacer" />
                {pastText.map((x, i) => (
                    <div key={i} className={`disco-dialogue ${x.style}`}>
                        <div className="disco-prompt">{x.prompt}</div>
                        <div className="disco-answer">
                            {x.givenAnswer}
                            {x.correct !== null && (
                                <span className={`disco-result ${x.correct ? 'success' : 'failure'}`}>
                                    {x.givenAnswer === 'Skipped' ? '↷ Skipped' : 
                                     x.correct ? '✓ Success' : '✗ Failure'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
PastTexts.displayName = 'PastTexts';

const CurrentText = memo(({ currentText }: { currentText: DiscoPrompt }) => (
    <div className="disco-current-text">
        <div className={`disco-dialogue ${currentText.style} active`}>
            <div className="disco-prompt">{currentText.prompt}</div>
            {currentText.givenAnswer && (
                <div className="disco-answer">{currentText.givenAnswer}</div>
            )}
        </div>
    </div>
));
CurrentText.displayName = 'CurrentText';

const InputSection = memo(({ 
    inputAnswer, 
    onInputChange, 
    onSubmit, 
    onSkip, 
    onKeyPress 
}: {
    inputAnswer: string;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
    onSkip: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => (
    <div className="disco-input-container">
        <div className="disco-input-group">
            <input
                type="number"
                className="disco-input"
                value={inputAnswer}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyPress}
                placeholder="Enter your answer..."
            />
            <div className="disco-button-group">
                <button 
                    className="disco-button submit"
                    onClick={onSubmit}
                    disabled={!inputAnswer.trim()}
                >
                    Submit
                </button>
                <button 
                    className="disco-button skip"
                    onClick={onSkip}
                >
                    Skip
                </button>
            </div>
        </div>
    </div>
))
InputSection.displayName = 'InputSection'

export const Disco = () => {
    const [inputAnswer, setInputAnswer] = useState<string>('');
    const [pastText, setPastText] = useState<DiscoPrompt[]>([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
    const [prompts, setPrompts] = useState<DiscoPrompt[]>([]);
    const { data, isLoading, refetch } = useGetExerciseQuery();

    // Initial fetch of exercises
    useEffect(() => {
        if (data?.exercises && prompts.length === 0) {
            setPrompts(convertExercisesToPrompts(data.exercises));
        }
    }, [data]);

    // Fetch more exercises when needed
    useEffect(() => {
        const fetchMoreExercises = async () => {
            const result = await refetch();
            if (result.data?.exercises) {
                setPrompts(prev => [...prev, ...convertExercisesToPrompts(result.data!.exercises)]);
            }
        };

        // Fetch more when 3 prompts remain
        if (currentPromptIndex >= prompts.length - 3) {
            fetchMoreExercises();
        }
    }, [currentPromptIndex, refetch]);

    const currentText = prompts[currentPromptIndex];

    const handleSubmit = () => {
        if (!inputAnswer.trim() || !currentText) return;
        
        const isCorrect = inputAnswer === currentText.actualAnswer;
        const answeredPrompt = {
            ...currentText,
            givenAnswer: inputAnswer,
            correct: isCorrect
        };
        setPastText([...pastText, answeredPrompt]);
        setCurrentPromptIndex(prev => prev + 1);
        setInputAnswer('');
    }

    const handleSkip = () => {
        if (!currentText) return;

        const skippedPrompt = {
            ...currentText,
            givenAnswer: 'Skipped',
            correct: false
        };
        setPastText([...pastText, skippedPrompt]);
        setCurrentPromptIndex(prev => prev + 1);
        setInputAnswer('');
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentText) {
            handleSubmit();
        }
    }

    if (isLoading || !currentText) {
        return <div className="disco-container"><div className="disco-loader">Loading exercises...</div></div>;
    }

    return (
        <div className="disco-container">
            <div className="disco-color-overlay" />
            <PastTexts pastText={pastText} />
            <CurrentText currentText={currentText} />
            <InputSection 
                inputAnswer={inputAnswer}
                onInputChange={setInputAnswer}
                onSubmit={handleSubmit}
                onSkip={handleSkip}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};