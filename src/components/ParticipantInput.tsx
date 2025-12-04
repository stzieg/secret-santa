import { useState, type FormEvent } from 'react';
import type { Participant } from '../types';
import { validateParticipantName } from '../utils/validation';
import './ParticipantInput.css';

interface ParticipantInputProps {
  participants: Participant[];
  onAddParticipant: (name: string) => void;
}

/**
 * Component for adding new participants to the Secret Santa exchange
 * Requirements: 1.1, 1.2, 1.3
 */
export function ParticipantInput({ participants, onAddParticipant }: ParticipantInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate the participant name
    if (!validateParticipantName(name, participants)) {
      // Determine specific error message
      if (!name || name.trim().length === 0) {
        // Requirement 1.2: Empty or whitespace-only names
        setError('Participant name cannot be empty');
      } else if (participants.some(p => p.name === name)) {
        // Requirement 1.3: Duplicate names
        setError('A participant with this name already exists');
      }
      return;
    }

    // Requirement 1.1: Add valid participant
    onAddParticipant(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="participant-input" aria-label="Add participant form">
      <div className="input-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter participant name"
          aria-label="Participant name"
          aria-invalid={!!error}
          aria-describedby={error ? 'participant-error' : undefined}
          className={error ? 'input-error' : ''}
          autoComplete="off"
        />
        <button type="submit" aria-label="Add participant">
          Add Participant
        </button>
      </div>
      {error && (
        <div id="participant-error" className="error-message" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </form>
  );
}
