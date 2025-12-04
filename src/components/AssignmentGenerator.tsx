import { useState } from 'react';
import type { Participant, RelationshipConstraint, Assignment } from '../types';
import { generateAssignments } from '../utils/assignmentGenerator';
import './AssignmentGenerator.css';

interface AssignmentGeneratorProps {
  participants: Participant[];
  constraints: RelationshipConstraint[];
  onGenerateAssignments: (assignments: Assignment[]) => void;
}

/**
 * Component for generating Secret Santa assignments
 * Requirements: 5.1, 5.6, 5.7, 7.1, 7.2
 */
export function AssignmentGenerator({
  participants,
  constraints,
  onGenerateAssignments,
}: AssignmentGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');
    setIsLoading(true);

    // Requirement 5.6: Validate minimum 3 participants
    if (participants.length < 3) {
      setError('At least 3 participants are required to generate matches');
      setIsLoading(false);
      return;
    }

    // Small delay to show loading state for better UX
    setTimeout(() => {
      // Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.7: Generate assignments
      const assignments = generateAssignments(participants, constraints);

      if (!assignments) {
        // Requirement 5.7: Detect impossible configurations
        setError(
          'Cannot generate matches with the current constraints. ' +
          'One or more participants may have constraints with all other participants.'
        );
        setIsLoading(false);
        return;
      }

      // Requirements 7.1, 7.2: Successfully generated (or regenerated) assignments
      onGenerateAssignments(assignments);
      setIsLoading(false);
    }, 100);
  };

  return (
    <div className="assignment-generator">
      <button
        onClick={handleGenerate}
        disabled={isLoading || participants.length < 3}
        aria-label={isLoading ? 'Generating matches, please wait' : 'Generate Secret Santa matches'}
        aria-busy={isLoading}
        aria-describedby={error ? 'generator-error' : undefined}
        className="generate-button"
        type="button"
      >
        {isLoading ? 'Generating...' : 'Generate Matches'}
      </button>
      {error && (
        <div id="generator-error" className="error-message" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {participants.length < 3 && !error && (
        <div className="info-message" role="status" aria-live="polite">
          Add at least 3 participants to generate matches
        </div>
      )}
    </div>
  );
}
