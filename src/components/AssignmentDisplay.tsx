import type { Assignment, Participant } from '../types';
import './AssignmentDisplay.css';

interface AssignmentDisplayProps {
  assignments: Assignment[];
  participants: Participant[];
}

/**
 * Component for displaying generated Secret Santa assignments
 * Requirements: 6.1, 6.2, 6.3
 */
export function AssignmentDisplay({
  assignments,
  participants,
}: AssignmentDisplayProps) {
  // Requirement 6.2: Display message when no assignments generated yet
  if (assignments.length === 0) {
    return (
      <div className="assignment-display">
        <p className="no-assignments-message" role="status" aria-live="polite">
          No matches generated yet. Add participants and click "Generate Matches" to begin.
        </p>
      </div>
    );
  }

  // Create a map for quick participant lookup
  const participantMap = new Map(
    participants.map((p) => [p.id, p.name])
  );

  // Requirements 6.1, 6.3: Display each assignment showing giver and receiver in clear format
  return (
    <div className="assignment-display">
      
      <ul 
        className="assignment-list" 
        role="list" 
        aria-labelledby="assignments-display-heading"
        aria-live="polite"
      >
        {assignments.map((assignment, index) => {
          const giverName = participantMap.get(assignment.giverId) || 'Unknown';
          const receiverName = participantMap.get(assignment.receiverId) || 'Unknown';
          
          return (
            <li 
              key={index} 
              className="assignment-item" 
              role="listitem"
              aria-label={`${giverName} gives to ${receiverName}`}
            >
              <span className="giver" aria-label="Gift giver">{giverName}</span>
              <span className="arrow" aria-hidden="true">→</span>
              <span className="receiver" aria-label="Gift receiver">{receiverName}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
