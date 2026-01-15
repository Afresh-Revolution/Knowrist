import React, { useState, useEffect, useId } from 'react'
import { useDialogHover } from '../hooks/useDialogHover'

interface WordInputProps {
  isOpen: boolean
  poolTitle: string
  poolCategory: 'Logic' | 'Word'
  difficulty?: 'easy' | 'medium' | 'hard'
  totalWords: number
  onClose: () => void
  onComplete: (words: Array<{ correct: string; scrambled: string }>) => void
}

/**
 * Word Input Screen
 *
 * Allows users to input words for Word category pools.
 * Users enter a correct word and its scrambled version.
 * Supports multiple words with navigation between them.
 */
const WordInput: React.FC<WordInputProps> = ({
  isOpen,
  poolTitle: _poolTitle,
  poolCategory: _poolCategory,
  difficulty = 'easy',
  totalWords = 5,
  onClose,
  onComplete,
}) => {
  const titleId = useId()
  const [isClosing, setIsClosing] = React.useState(false)
  const { dialogRef, style: hoverStyle } = useDialogHover()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState<Array<{ correct: string; scrambled: string }>>(
    Array(totalWords).fill(null).map(() => ({ correct: '', scrambled: '' }))
  )
  const [errors, setErrors] = useState<{ correct?: string; scrambled?: string }>({})

  const currentWord = words[currentWordIndex]

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      setCurrentWordIndex(0)
      setWords(Array(totalWords).fill(null).map(() => ({ correct: '', scrambled: '' })))
      setErrors({})
    }, 400)
  }

  // Get word length requirements based on difficulty
  const getWordLengthRange = (): { min: number; max: number } => {
    switch (difficulty) {
      case 'easy':
        return { min: 2, max: 6 }
      case 'medium':
        return { min: 4, max: 8 }
      case 'hard':
        return { min: 6, max: 10 }
      default:
        return { min: 2, max: 6 }
    }
  }

  const { min: minLength, max: maxLength } = getWordLengthRange()

  // Validate word inputs
  const validateWord = (correct: string, scrambled: string): { valid: boolean; errors: { correct?: string; scrambled?: string } } => {
    const newErrors: { correct?: string; scrambled?: string } = {}

    if (correct.length < minLength || correct.length > maxLength) {
      newErrors.correct = `Must be between ${minLength} and ${maxLength} letters`
    } else if (!/^[A-Za-z]+$/.test(correct)) {
      newErrors.correct = 'Only letters allowed'
    }

    if (scrambled.length < minLength || scrambled.length > maxLength) {
      newErrors.scrambled = `Must be between ${minLength} and ${maxLength} letters`
    } else if (!/^[A-Za-z]+$/.test(scrambled)) {
      newErrors.scrambled = 'Only letters allowed'
    }

    // Check if scrambled word matches letters of correct word
    if (correct.length >= minLength && correct.length <= maxLength && 
        scrambled.length >= minLength && scrambled.length <= maxLength) {
      const correctLetters = correct.toLowerCase().split('').sort().join('')
      const scrambledLetters = scrambled.toLowerCase().split('').sort().join('')
      if (correctLetters !== scrambledLetters) {
        newErrors.scrambled = 'Scrambled word must match letters'
      }
    }

    return {
      valid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    }
  }

  // Handle input changes
  const handleCorrectChange = (value: string) => {
    const upperValue = value.toUpperCase().slice(0, maxLength) // Limit to maxLength letters, uppercase
    const newWords = [...words]
    newWords[currentWordIndex] = { ...newWords[currentWordIndex], correct: upperValue }
    setWords(newWords)
    
    // Clear errors when user types
    if (errors.correct) {
      setErrors({ ...errors, correct: undefined })
    }
  }

  const handleScrambledChange = (value: string) => {
    const upperValue = value.toUpperCase().slice(0, maxLength) // Limit to maxLength letters, uppercase
    const newWords = [...words]
    newWords[currentWordIndex] = { ...newWords[currentWordIndex], scrambled: upperValue }
    setWords(newWords)
    
    // Clear errors when user types
    if (errors.scrambled) {
      setErrors({ ...errors, scrambled: undefined })
    }
  }

  // Handle Next Word button
  const handleNextWord = () => {
    // Validate current word before proceeding
    const validation = validateWord(currentWord.correct, currentWord.scrambled)
    
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    // Move to next word
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setErrors({})
    } else {
      // All words completed, submit
      handleComplete()
    }
  }

  // Handle completion
  const handleComplete = () => {
    // Validate all words
    let allValid = true
    const allErrors: { [key: number]: { correct?: string; scrambled?: string } } = {}

    words.forEach((word, index) => {
      const validation = validateWord(word.correct, word.scrambled)
      if (!validation.valid) {
        allValid = false
        allErrors[index] = validation.errors
      }
    })

    if (!allValid) {
      // Go to first invalid word
      const firstInvalidIndex = Object.keys(allErrors)[0]
      setCurrentWordIndex(Number(firstInvalidIndex))
      setErrors(allErrors[Number(firstInvalidIndex)])
      return
    }

    // All valid, complete
    onComplete(words)
    handleClose()
  }

  // Close on Escape + focus management
  useEffect(() => {
    if (!isOpen && !isClosing) {
      setIsClosing(false)
      return
    }

    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      // Allow Enter to submit if on last word
      if (e.key === 'Enter' && currentWordIndex === totalWords - 1) {
        handleNextWord()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isClosing, currentWordIndex, totalWords])

  if (!isOpen && !isClosing) return null

  // Show for both Logic and Word category pools

  return (
    <div
      className={`word-input-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        className="word-input-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        style={hoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="word-input-content">
          {/* Icon */}
          <div className="word-input-icon">
            <div className="word-input-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 id={titleId} className="word-input-title">
            Word {currentWordIndex + 1} of {totalWords}
          </h1>

          {/* Subtitle */}
          <p className="word-input-subtitle">
            Enter a challenging word for your opponents.
          </p>

          {/* Progress dots */}
          <div className="word-input-progress">
            {Array(totalWords)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={`word-input-progress-dot ${
                    index <= currentWordIndex ? 'active' : ''
                  }`}
                />
              ))}
          </div>

          {/* Input fields */}
          <div className="word-input-fields">
            <div className="word-input-field-group">
              <label className="word-input-label">Correct Word</label>
              <input
                type="text"
                className={`word-input-field ${errors.correct ? 'error' : ''}`}
                placeholder="WORD"
                value={currentWord.correct}
                onChange={(e) => handleCorrectChange(e.target.value)}
                maxLength={maxLength}
                autoFocus
              />
              {errors.correct && (
                <span className="word-input-error">{errors.correct}</span>
              )}
            </div>

            <div className="word-input-field-group">
              <label className="word-input-label">Scrambled Version</label>
              <input
                type="text"
                className={`word-input-field ${errors.scrambled ? 'error' : ''}`}
                placeholder="WROD"
                value={currentWord.scrambled}
                onChange={(e) => handleScrambledChange(e.target.value)}
                maxLength={maxLength}
              />
              {errors.scrambled && (
                <span className="word-input-error">{errors.scrambled}</span>
              )}
            </div>
          </div>

          {/* Helper text */}
          <p className="word-input-helper">
            Must be between {minLength} and {maxLength} letters. Scrambled word must match letters.
          </p>

          {/* Next Word button */}
          <button
            type="button"
            className="word-input-next-button"
            onClick={handleNextWord}
          >
            {currentWordIndex < totalWords - 1 ? 'Next Word' : 'Finish'}
            {currentWordIndex < totalWords - 1 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WordInput
