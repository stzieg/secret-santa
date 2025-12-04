import { useState, type FormEvent } from 'react';
import type { Participant, RelationshipConstraint } from '../types';
import { validateConstraint } from '../utils/validation';
import './ConstraintInput.css';

interface ConstraintInputProps {
  participants: Participant[];
  constraints: RelationshipConstraint[];
  onAddConstraint: (participant1Id: string, participant2Id: string) => void;
}

/**
 * Component for adding relationship constraints between participants
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
export function ConstraintInput({ 
  participants, 
  constraints, 
  onAddConstraint 
}: ConstraintInputProps) {
  const [participant1Id, setParticipant1Id] = useState('');
  const [participant2Id, setParticipant2Id] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if both participants are selected
    if (!participant1Id || !participant2Id) {
      setError('Please select both participants');
      return;
    }

    // Create temporary constraint for validation
    const tempConstraint: RelationshipConstraint = {
      id: 'temp',
      participant1Id,
      participant2Id,
    };

    // Validate the constraint
    if (!validateConstraint(tempConstraint, participants, constraints)) {
      // Determine specific error message
      if (participant1Id === participant2Id) {
        // Requirement 3.2: Self-constraints
        setError('A participant cannot be constrained with themselves');
      } else {
        // Requirement 3.3: Duplicate constraints
        setError('This constraint already exists');
      }
      return;
    }

    // Requirement 3.1, 3.4: Add valid constraint
    onAddConstraint(participant1Id, participant2Id);
    setParticipant1Id('');
    setParticipant2Id('');
  };

  return (
    <form onSubmit={handleSubmit} className="constraint-input" aria-label="Add constraint form">
      <div className="input-group">
        <select
          value={participant1Id}
          onChange={(e) => setParticipant1Id(e.target.value)}
          aria-label="First participant for constraint"
          aria-invalid={!!error}
          aria-describedby={error ? 'constraint-error' : undefined}
          className={error ? 'input-error' : ''}
          disabled={participants.length === 0}
        >
          <option value="">Select first participant</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        
        <select
          value={participant2Id}
          onChange={(e) => setParticipant2Id(e.target.value)}
          aria-label="Second participant for constraint"
          aria-invalid={!!error}
          aria-describedby={error ? 'constraint-error' : undefined}
          className={error ? 'input-error' : ''}
          disabled={participants.length === 0}
        >
          <option value="">Select second participant</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        
        <button 
          type="submit" 
          aria-label="Add relationship constraint"
          disabled={participants.length === 0}
        >
          Add Constraint
        </button>
      </div>
      {error && (
        <div id="constraint-error" className="error-message" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </form>
  );
}
