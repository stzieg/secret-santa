import type { Participant, RelationshipConstraint } from '../types';
import './ConstraintList.css';

interface ConstraintListProps {
  constraints: RelationshipConstraint[];
  participants: Participant[];
  onRemoveConstraint: (id: string) => void;
}

/**
 * Component for displaying and managing the list of relationship constraints
 * Requirements: 3.4, 4.1, 4.2
 */
export function ConstraintList({ 
  constraints, 
  participants, 
  onRemoveConstraint 
}: ConstraintListProps) {
  // Helper function to get participant name by id
  const getParticipantName = (id: string): string => {
    const participant = participants.find(p => p.id === id);
    return participant?.name || 'Unknown';
  };

  // Requirement 4.2: Show empty state when no constraints
  if (constraints.length === 0) {
    return (
      <div className="constraint-list empty" role="status" aria-live="polite">
        <p className="empty-message">No constraints yet. Add constraints to prevent certain pairings.</p>
      </div>
    );
  }

  return (
    <div className="constraint-list">
      <h3 id="constraint-list-heading">Constraints ({constraints.length})</h3>
      <ul 
        className="constraint-items" 
        role="list" 
        aria-labelledby="constraint-list-heading"
      >
        {constraints.map((constraint) => {
          const name1 = getParticipantName(constraint.participant1Id);
          const name2 = getParticipantName(constraint.participant2Id);
          
          return (
            <li key={constraint.id} className="constraint-item" role="listitem">
              {/* Requirement 3.4: Show constraint pairs clearly */}
              <span 
                className="constraint-pair" 
                id={`constraint-${constraint.id}`}
                aria-label={`Constraint between ${name1} and ${name2}`}
              >
                {name1} ↔ {name2}
              </span>
              {/* Requirement 4.1: Handle remove constraint action */}
              <button
                onClick={() => onRemoveConstraint(constraint.id)}
                className="remove-button"
                aria-label={`Remove constraint between ${name1} and ${name2}`}
                aria-describedby={`constraint-${constraint.id}`}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
