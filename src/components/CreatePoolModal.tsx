import React, { useState } from 'react'

interface CreatePoolModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (poolData: PoolFormData) => void
}

export interface PoolFormData {
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: 'SCIENCE' | 'MATHS' | 'ENGLISH' | 'LITERATURE' | 'HISTORY'
  wordLength: number
  entryFee: number
  rewardPerQuestion: number
  maxPlayers: number
  questionsPerUser: number
  scheduledStart: string // ISO datetime string
  durationMinutes: number
  status: 'DRAFT' | 'OPEN' | 'WAITING' | 'LIVE' | 'ENDED' | 'EXTENDED'
  image?: string
}

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<PoolFormData>({
    title: '',
    category: 'SCIENCE',
    difficulty: 'EASY',
    wordLength: 4,
    entryFee: 0,
    rewardPerQuestion: 0,
    maxPlayers: 100,
    questionsPerUser: 5,
    scheduledStart: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    durationMinutes: 60,
    status: 'DRAFT',
    image: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PoolFormData, string>>>({})

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: 
        name === 'maxPlayers' || 
        name === 'wordLength' || 
        name === 'questionsPerUser' || 
        name === 'durationMinutes'
          ? parseInt(value) || 0
          : name === 'entryFee' || name === 'rewardPerQuestion'
          ? parseFloat(value) || 0
          : value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof PoolFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PoolFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.entryFee < 0) {
      newErrors.entryFee = 'Entry fee must be 0 or greater'
    }

    if (formData.rewardPerQuestion < 0) {
      newErrors.rewardPerQuestion = 'Reward per question must be 0 or greater'
    }

    if (formData.maxPlayers < 1) {
      newErrors.maxPlayers = 'Max players must be at least 1'
    }

    if (formData.wordLength < 1) {
      newErrors.wordLength = 'Word length must be at least 1'
    }

    if (formData.questionsPerUser < 1) {
      newErrors.questionsPerUser = 'Questions per user must be at least 1'
    }

    if (formData.durationMinutes < 1) {
      newErrors.durationMinutes = 'Duration must be at least 1 minute'
    }

    if (!formData.scheduledStart) {
      newErrors.scheduledStart = 'Scheduled start time is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onCreate(formData)
      // Reset form
      setFormData({
        title: '',
        category: 'SCIENCE',
        difficulty: 'EASY',
        wordLength: 4,
        entryFee: 0,
        rewardPerQuestion: 0,
        maxPlayers: 100,
        questionsPerUser: 5,
        scheduledStart: new Date().toISOString().slice(0, 16),
        durationMinutes: 60,
        status: 'DRAFT',
        image: '',
      })
      setErrors({})
      onClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  return (
    <div className="create-pool-modal-overlay" onClick={handleClose}>
      <div className="create-pool-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-pool-modal-header">
          <h2 className="create-pool-modal-title">Create New Pool</h2>
          <button className="create-pool-modal-close" onClick={handleClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form className="create-pool-modal-form" onSubmit={handleSubmit}>
          <div className="create-pool-form-section">
            <h3 className="create-pool-section-title">Basic Information</h3>
            
            <div className="create-pool-form-group">
              <label htmlFor="title" className="create-pool-label">
                Pool Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`create-pool-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Neon Matrix Daily"
              />
              {errors.title && <span className="create-pool-error">{errors.title}</span>}
            </div>

            <div className="create-pool-form-row">
              <div className="create-pool-form-group">
                <label htmlFor="category" className="create-pool-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="create-pool-select"
                >
                  <option value="SCIENCE">Science</option>
                  <option value="MATHS">Maths</option>
                  <option value="ENGLISH">English</option>
                  <option value="LITERATURE">Literature</option>
                  <option value="HISTORY">History</option>
                </select>
              </div>

              <div className="create-pool-form-group">
                <label htmlFor="difficulty" className="create-pool-label">
                  Difficulty <span className="required">*</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="create-pool-select"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div className="create-pool-form-row">
              <div className="create-pool-form-group">
                <label htmlFor="wordLength" className="create-pool-label">
                  Word Length <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="wordLength"
                  name="wordLength"
                  value={formData.wordLength}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.wordLength ? 'error' : ''}`}
                  min="1"
                  placeholder="4"
                />
                {errors.wordLength && <span className="create-pool-error">{errors.wordLength}</span>}
              </div>

              <div className="create-pool-form-group">
                <label htmlFor="status" className="create-pool-label">
                  Status <span className="required">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="create-pool-select"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="OPEN">Open</option>
                  <option value="WAITING">Waiting</option>
                  <option value="LIVE">Live</option>
                  <option value="ENDED">Ended</option>
                  <option value="EXTENDED">Extended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="create-pool-form-section">
            <h3 className="create-pool-section-title">Entry & Rewards</h3>
            
            <div className="create-pool-form-row">
              <div className="create-pool-form-group">
                <label htmlFor="entryFee" className="create-pool-label">
                  Entry Fee <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="entryFee"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.entryFee ? 'error' : ''}`}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.entryFee && <span className="create-pool-error">{errors.entryFee}</span>}
                <span className="create-pool-hint">Numeric value (e.g., 1000.00)</span>
              </div>

              <div className="create-pool-form-group">
                <label htmlFor="rewardPerQuestion" className="create-pool-label">
                  Reward Per Question <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="rewardPerQuestion"
                  name="rewardPerQuestion"
                  value={formData.rewardPerQuestion}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.rewardPerQuestion ? 'error' : ''}`}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.rewardPerQuestion && <span className="create-pool-error">{errors.rewardPerQuestion}</span>}
                <span className="create-pool-hint">Numeric value (e.g., 50.00)</span>
              </div>
            </div>
          </div>

          <div className="create-pool-form-section">
            <h3 className="create-pool-section-title">Players & Questions</h3>
            
            <div className="create-pool-form-row">
              <div className="create-pool-form-group">
                <label htmlFor="maxPlayers" className="create-pool-label">
                  Max Players <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="maxPlayers"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.maxPlayers ? 'error' : ''}`}
                  min="1"
                  placeholder="100"
                />
                {errors.maxPlayers && <span className="create-pool-error">{errors.maxPlayers}</span>}
              </div>

              <div className="create-pool-form-group">
                <label htmlFor="questionsPerUser" className="create-pool-label">
                  Questions Per User <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="questionsPerUser"
                  name="questionsPerUser"
                  value={formData.questionsPerUser}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.questionsPerUser ? 'error' : ''}`}
                  min="1"
                  placeholder="5"
                />
                {errors.questionsPerUser && <span className="create-pool-error">{errors.questionsPerUser}</span>}
              </div>
            </div>
          </div>

          <div className="create-pool-form-section">
            <h3 className="create-pool-section-title">Schedule & Duration</h3>
            
            <div className="create-pool-form-row">
              <div className="create-pool-form-group">
                <label htmlFor="scheduledStart" className="create-pool-label">
                  Scheduled Start <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="scheduledStart"
                  name="scheduledStart"
                  value={formData.scheduledStart}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.scheduledStart ? 'error' : ''}`}
                />
                {errors.scheduledStart && <span className="create-pool-error">{errors.scheduledStart}</span>}
                <span className="create-pool-hint">Date and time when pool starts</span>
              </div>

              <div className="create-pool-form-group">
                <label htmlFor="durationMinutes" className="create-pool-label">
                  Duration (Minutes) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className={`create-pool-input ${errors.durationMinutes ? 'error' : ''}`}
                  min="1"
                  placeholder="60"
                />
                {errors.durationMinutes && <span className="create-pool-error">{errors.durationMinutes}</span>}
                <span className="create-pool-hint">Pool duration in minutes</span>
              </div>
            </div>
          </div>

          <div className="create-pool-form-section">
            <h3 className="create-pool-section-title">Image (Optional)</h3>
            
            <div className="create-pool-form-group">
              <label htmlFor="image" className="create-pool-label">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ''}
                onChange={handleChange}
                className="create-pool-input"
                placeholder="https://example.com/image.png"
              />
              <span className="create-pool-hint">URL to pool background image</span>
            </div>
          </div>

          <div className="create-pool-modal-actions">
            <button
              type="button"
              className="create-pool-button cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="create-pool-button submit">
              Create Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePoolModal
