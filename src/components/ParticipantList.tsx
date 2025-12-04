import type { Participant } from '../types';
import './ParticipantList.css';

interface ParticipantListProps {
  participants: Participant[];
  onRemoveParticipant: (id: string) => void;
}

/**
 * Component for displaying and managing the list of participants
 * Requirements: 1.4, 2.1, 2.3
 */
export function ParticipantList({ participants, onRemoveParticipant }: ParticipantListProps) {
  // Requirement 1.4, 2.3: Show empty state when no participants
  if (participants.length === 0) {
    return (
      <div className="participant-list empty" role="status" aria-live="polite">
        <p className="empty-message">No participants yet. Add some to get started!</p>
      </div>
    );
  }

  return (
    <div className="participant-list">
      <h3 id="participant-list-heading">Participants ({participants.length})</h3>
      <ul 
        className="participant-items" 
        role="list" 
        aria-labelledby="participant-list-heading"
      >
        {participants.map((participant) => (
          <li key={participant.id} className="participant-item" role="listitem">
            <span className="participant-name" id={`participant-${participant.id}`}>
              {participant.name}
            </span>
            <button
              onClick={() => onRemoveParticipant(participant.id)}
              className="remove-button"
              aria-label={`Remove ${participant.name} from participants`}
              aria-describedby={`participant-${participant.id}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
