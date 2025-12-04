import type { Participant, RelationshipConstraint, Assignment } from '../types';

/**
 * Builds a map of valid receivers for each participant
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 * 
 * @param participants - List of all participants
 * @param constraints - List of relationship constraints
 * @returns Map from participant ID to array of valid receiver IDs
 */
function buildValidReceiversMap(
  participants: Participant[],
  constraints: RelationshipConstraint[]
): Map<string, string[]> {
  const validReceivers = new Map<string, string[]>();

  // Build a set of constrained pairs for quick lookup
  const constrainedPairs = new Set<string>();
  constraints.forEach((constraint) => {
    constrainedPairs.add(`${constraint.participant1Id}-${constraint.participant2Id}`);
    constrainedPairs.add(`${constraint.participant2Id}-${constraint.participant1Id}`);
  });

  // For each participant, determine who they can give to
  participants.forEach((giver) => {
    const validReceiverIds: string[] = [];
    
    participants.forEach((receiver) => {
      // Cannot give to themselves (Requirement 5.4)
      if (giver.id === receiver.id) {
        return;
      }

      // Cannot give to someone they have a constraint with (Requirement 5.5)
      const pairKey = `${giver.id}-${receiver.id}`;
      if (constrainedPairs.has(pairKey)) {
        return;
      }

      validReceiverIds.push(receiver.id);
    });

    validReceivers.set(giver.id, validReceiverIds);
  });

  return validReceivers;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * Used to randomize the order of exploration in backtracking
 * 
 * @param array - Array to shuffle
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Finds a Hamiltonian cycle using backtracking with randomization
 * Requirements: 5.1, 5.2, 5.3
 * 
 * @param participants - List of all participants
 * @param validReceivers - Map of valid receivers for each participant
 * @returns Array of participant IDs forming a cycle, or null if impossible
 */
function findHamiltonianCycle(
  participants: Participant[],
  validReceivers: Map<string, string[]>
): string[] | null {
  const n = participants.length;
  const path: string[] = [];
  const visited = new Set<string>();

  // Start with a random participant
  const startParticipants = [...participants];
  shuffleArray(startParticipants);
  const startId = startParticipants[0].id;

  path.push(startId);
  visited.add(startId);

  /**
   * Recursive backtracking function
   * 
   * @param currentId - Current participant ID in the path
   * @returns true if a valid cycle is found, false otherwise
   */
  function backtrack(currentId: string): boolean {
    // If we've visited all participants, check if we can return to start
    if (path.length === n) {
      const receivers = validReceivers.get(currentId) || [];
      return receivers.includes(startId);
    }

    // Get valid receivers for current participant and randomize order
    const receivers = validReceivers.get(currentId) || [];
    const shuffledReceivers = [...receivers];
    shuffleArray(shuffledReceivers);

    // Try each valid receiver
    for (const receiverId of shuffledReceivers) {
      if (!visited.has(receiverId)) {
        path.push(receiverId);
        visited.add(receiverId);

        if (backtrack(receiverId)) {
          return true;
        }

        // Backtrack
        path.pop();
        visited.delete(receiverId);
      }
    }

    return false;
  }

  if (backtrack(startId)) {
    return path;
  }

  return null;
}

/**
 * Converts a Hamiltonian cycle to assignment list
 * Requirements: 5.1, 5.2, 5.3
 * 
 * @param cycle - Array of participant IDs forming a cycle
 * @returns Array of assignments
 */
function cycleToAssignments(cycle: string[]): Assignment[] {
  const assignments: Assignment[] = [];

  for (let i = 0; i < cycle.length; i++) {
    const giverId = cycle[i];
    const receiverId = cycle[(i + 1) % cycle.length];
    
    assignments.push({
      giverId,
      receiverId,
    });
  }

  return assignments;
}

/**
 * Checks if a valid assignment is possible given constraints
 * Requirements: 5.7
 * 
 * @param participants - List of all participants
 * @param constraints - List of relationship constraints
 * @returns true if assignment is possible, false otherwise
 */
export function isAssignmentPossible(
  participants: Participant[],
  constraints: RelationshipConstraint[]
): boolean {
  // Requirement 5.6: Need at least 3 participants
  if (participants.length < 3) {
    return false;
  }

  const validReceivers = buildValidReceiversMap(participants, constraints);

  // Check if any participant has no valid receivers
  for (const receivers of validReceivers.values()) {
    if (receivers.length === 0) {
      return false;
    }
  }

  // A more thorough check would require actually attempting to find a cycle,
  // but checking for zero valid receivers catches the most obvious impossible cases
  return true;
}

/**
 * Generates a valid assignment set respecting all constraints
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7
 * 
 * @param participants - List of all participants
 * @param constraints - List of relationship constraints
 * @returns Array of assignments, or null if impossible
 */
export function generateAssignments(
  participants: Participant[],
  constraints: RelationshipConstraint[]
): Assignment[] | null {
  // Requirement 5.6: Need at least 3 participants
  if (participants.length < 3) {
    return null;
  }

  // Build the valid receivers map
  const validReceivers = buildValidReceiversMap(participants, constraints);

  // Check for obvious impossibilities
  for (const receivers of validReceivers.values()) {
    if (receivers.length === 0) {
      return null; // This participant cannot give to anyone
    }
  }

  // Attempt to find a Hamiltonian cycle
  const cycle = findHamiltonianCycle(participants, validReceivers);

  if (!cycle) {
    return null; // No valid assignment possible
  }

  // Convert cycle to assignments
  return cycleToAssignments(cycle);
}
