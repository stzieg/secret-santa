import type { Participant, RelationshipConstraint } from '../types';

/**
 * Validates if a participant name is acceptable
 * Requirements: 1.1, 1.2, 1.3
 * 
 * @param name - The participant name to validate
 * @param existingParticipants - List of existing participants
 * @returns true if the name is valid, false otherwise
 */
export function validateParticipantName(
  name: string,
  existingParticipants: Participant[]
): boolean {
  // Requirement 1.2: Reject empty or whitespace-only names
  if (!name || name.trim().length === 0) {
    return false;
  }

  // Requirement 1.3: Reject duplicate names
  const isDuplicate = existingParticipants.some(
    (participant) => participant.name === name
  );
  
  return !isDuplicate;
}

/**
 * Validates a constraint before adding
 * Requirements: 3.2, 3.3
 * 
 * @param constraint - The constraint to validate
 * @param participants - List of all participants
 * @param existingConstraints - List of existing constraints
 * @returns true if the constraint is valid, false otherwise
 */
export function validateConstraint(
  constraint: RelationshipConstraint,
  participants: Participant[],
  existingConstraints: RelationshipConstraint[]
): boolean {
  // Requirement 3.2: Reject self-constraints
  if (constraint.participant1Id === constraint.participant2Id) {
    return false;
  }

  // Verify both participants exist
  const participant1Exists = participants.some(
    (p) => p.id === constraint.participant1Id
  );
  const participant2Exists = participants.some(
    (p) => p.id === constraint.participant2Id
  );
  
  if (!participant1Exists || !participant2Exists) {
    return false;
  }

  // Requirement 3.3: Reject duplicate constraints (bidirectional)
  const isDuplicate = existingConstraints.some(
    (c) =>
      (c.participant1Id === constraint.participant1Id &&
        c.participant2Id === constraint.participant2Id) ||
      (c.participant1Id === constraint.participant2Id &&
        c.participant2Id === constraint.participant1Id)
  );

  return !isDuplicate;
}
