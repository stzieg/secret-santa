# Design Document

## Overview

The Secret Santa Application is a single-page React web application that manages participant lists, relationship constraints, and generates valid Secret Santa assignments. The application uses a graph-based algorithm to generate assignments that respect all constraints, with local storage for data persistence.

## Architecture

The application follows a component-based React architecture with the following layers:

1. **Presentation Layer**: React components for UI rendering and user interaction
2. **State Management Layer**: React hooks (useState, useEffect) for application state
3. **Business Logic Layer**: Pure functions for assignment generation and validation
4. **Storage Layer**: Browser local storage for data persistence

### Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules or Tailwind CSS
- **Testing**: Vitest for unit tests, fast-check for property-based testing
- **Storage**: Browser localStorage API

## Components and Interfaces

### Core Data Types

```typescript
interface Participant {
  id: string;
  name: string;
}

interface RelationshipConstraint {
  id: string;
  participant1Id: string;
  participant2Id: string;
}

interface Assignment {
  giverId: string;
  receiverId: string;
}

interface AppState {
  participants: Participant[];
  constraints: RelationshipConstraint[];
  assignments: Assignment[];
  currentView: 'main' | 'reveal';
}

interface RevealState {
  currentIndex: number;
  phase: 'countdown' | 'showing';
  countdown: number;
}
```

### React Components

1. **App**: Root component managing global state and view routing
2. **ParticipantList**: Displays and manages the list of participants
3. **ParticipantInput**: Input form for adding new participants
4. **ConstraintList**: Displays and manages relationship constraints
5. **ConstraintInput**: Form for creating new constraints
6. **AssignmentGenerator**: Button and logic for generating assignments
7. **AssignmentDisplay**: Shows the generated Secret Santa assignments
8. **RevealScreen**: Full-screen component that displays assignments one at a time with timed reveals

### Core Functions

```typescript
// Validates if a participant name is acceptable
function validateParticipantName(name: string, existingParticipants: Participant[]): boolean

// Generates a valid assignment set respecting all constraints
function generateAssignments(
  participants: Participant[], 
  constraints: RelationshipConstraint[]
): Assignment[] | null

// Checks if a valid assignment is possible given constraints
function isAssignmentPossible(
  participants: Participant[], 
  constraints: RelationshipConstraint[]
): boolean

// Validates a constraint before adding
function validateConstraint(
  constraint: RelationshipConstraint,
  participants: Participant[],
  existingConstraints: RelationshipConstraint[]
): boolean
```

## Data Models

### Participant Model

- **id**: Unique identifier (UUID)
- **name**: Non-empty string, unique across all participants

### RelationshipConstraint Model

- **id**: Unique identifier (UUID)
- **participant1Id**: Reference to first participant
- **participant2Id**: Reference to second participant
- Bidirectional: if A cannot give to B, then B cannot give to A

### Assignment Model

- **giverId**: Reference to the participant who gives
- **receiverId**: Reference to the participant who receives
- Forms a directed cycle through all participants

## Assignment Generation Algorithm

The assignment generation uses a graph-based approach:

1. **Graph Construction**: Create a directed graph where each participant is a node
2. **Edge Creation**: Add edges from each participant to all other participants except:
   - Themselves (no self-assignment)
   - Participants they have constraints with
3. **Hamiltonian Cycle Detection**: Find a Hamiltonian cycle in the graph (a path that visits each node exactly once and returns to the start)
4. **Randomization**: Use random shuffling to generate different valid assignments on each run

### Algorithm Implementation

```typescript
function generateAssignments(
  participants: Participant[],
  constraints: RelationshipConstraint[]
): Assignment[] | null {
  // Build adjacency list representing valid assignments
  const validReceivers = buildValidReceiversMap(participants, constraints);
  
  // Attempt to find a Hamiltonian cycle using backtracking
  const cycle = findHamiltonianCycle(participants, validReceivers);
  
  if (!cycle) {
    return null; // No valid assignment possible
  }
  
  // Convert cycle to assignments
  return cycleToAssignments(cycle);
}
```

### Impossibility Detection

An assignment is impossible when:
- Fewer than 3 participants exist
- The constraint graph is too restrictive (e.g., a participant has constraints with all other participants)
- The graph structure prevents a Hamiltonian cycle

## Reveal Screen Design

The Reveal Screen provides a timed, sequential display of assignments to allow participants to view their assignments privately.

### View State Management

The application will have two main views:
- **Main View**: The default view with participant/constraint management and assignment generation
- **Reveal View**: Full-screen reveal sequence

Navigation occurs when:
- User clicks "Generate Assignments" → Navigate to Reveal View
- All assignments revealed → Navigate back to Main View

### Reveal Sequence Flow

For each assignment in the list:

1. **Countdown Phase** (10 seconds):
   - Display giver name on the left side
   - Display countdown timer (10, 9, 8, ..., 1) on the right side
   - Timer updates every second using setInterval

2. **Showing Phase** (10 seconds):
   - Display giver name on the left side (unchanged)
   - Display receiver name on the right side (replaces countdown)
   - Wait 10 seconds before advancing

3. **Advance to Next**:
   - Increment current assignment index
   - Return to Countdown Phase for next assignment
   - If all assignments shown, return to Main View

### Component Structure

```typescript
interface RevealScreenProps {
  assignments: Assignment[];
  participants: Participant[];
  onComplete: () => void;
}

// Internal state management
const [currentIndex, setCurrentIndex] = useState(0);
const [phase, setPhase] = useState<'countdown' | 'showing'>('countdown');
const [countdown, setCountdown] = useState(10);
```

### Timer Implementation

- Use `useEffect` with `setInterval` for countdown timer
- Clear intervals on component unmount or phase changes
- Automatic phase transitions when timers complete

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   GIVER NAME          COUNTDOWN: 10     │
│   (left aligned)      (right aligned)   │
│                                         │
│                  or                     │
│                                         │
│   GIVER NAME          RECEIVER NAME     │
│   (left aligned)      (right aligned)   │
│                                         │
└─────────────────────────────────────────┘
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Adding valid participants grows the list

*For any* valid participant name (non-empty, non-duplicate), adding it to the participant list should increase the list length by one and the new participant should appear in the list.

**Validates: Requirements 1.1**

### Property 2: Whitespace-only names are rejected

*For any* string composed entirely of whitespace characters, attempting to add it as a participant name should be rejected and the participant list should remain unchanged.

**Validates: Requirements 1.2**

### Property 3: Duplicate names are rejected

*For any* participant already in the list, attempting to add another participant with the same name should be rejected and the participant list should remain unchanged.

**Validates: Requirements 1.3**

### Property 4: Removing a participant cascades to constraints

*For any* participant with associated relationship constraints, removing that participant should also remove all constraints where that participant appears.

**Validates: Requirements 2.1, 2.2**

### Property 5: Constraints are bidirectional

*For any* two distinct participants A and B, if a relationship constraint exists between them, then neither A can be assigned to B nor B can be assigned to A in any generated assignment set.

**Validates: Requirements 3.1**

### Property 6: Duplicate constraints are rejected

*For any* existing relationship constraint between participants A and B, attempting to create another constraint between A and B (or B and A) should be rejected and the constraint list should remain unchanged.

**Validates: Requirements 3.3**

### Property 7: Valid assignment structure

*For any* generated assignment set with N participants, the following must all hold:
- Each participant gives to exactly one other participant
- Each participant receives from exactly one other participant  
- No participant is assigned to themselves
- No relationship constraints are violated
- The assignments form a single cycle through all participants

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 8: Impossible configurations are detected

*For any* configuration where a valid assignment is mathematically impossible (such as a participant having constraints with all other participants), the assignment generation should return null or an error rather than producing an invalid assignment.

**Validates: Requirements 5.7**

### Property 9: Assignment display contains required information

*For any* generated assignment, the rendered display string should contain both the giver's name and the receiver's name.

**Validates: Requirements 6.1**

### Property 10: Regeneration produces valid assignments

*For any* valid configuration, regenerating assignments should produce a new valid assignment set that satisfies all the properties of Property 7.

**Validates: Requirements 7.1, 7.2**

### Property 11: Storage round-trip preserves state

*For any* application state (participants and constraints), saving to local storage and then loading should restore an equivalent state with the same participants and constraints.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 12: Reveal screen displays giver name

*For any* assignment being revealed, the reveal screen should display the giver's name in the rendered output.

**Validates: Requirements 9.2**

### Property 13: Countdown transitions to receiver display

*For any* assignment in the countdown phase, when the countdown reaches 0, the display should transition to showing the receiver's name instead of the countdown timer.

**Validates: Requirements 9.4**

### Property 14: Assignments advance after display period

*For any* assignment in the showing phase, after 10 seconds elapse, the system should advance to the next assignment in the sequence.

**Validates: Requirements 9.5**

### Property 15: Assignments display in sequence

*For any* list of assignments, the reveal screen should display them in sequential order without skipping any assignment, where each assignment index is exactly one greater than the previous.

**Validates: Requirements 9.7**

## Error Handling

### User Input Errors

- **Empty participant names**: Display inline error message, prevent submission
- **Duplicate participant names**: Display inline error message, prevent submission
- **Self-constraints**: Display inline error message, prevent submission
- **Duplicate constraints**: Display inline error message, prevent submission
- **Too few participants**: Display error message when attempting to generate assignments

### Assignment Generation Errors

- **Impossible configuration**: Detect before attempting generation, display clear error message explaining why (e.g., "Cannot generate assignments: Participant X has constraints with all other participants")
- **Algorithm failure**: Fallback error message if generation fails unexpectedly

### Storage Errors

- **localStorage unavailable**: Gracefully degrade to in-memory only mode, display warning
- **Corrupted data**: Clear corrupted data, start fresh, display warning to user
- **Quota exceeded**: Display error message, suggest clearing old data

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

- Empty state initialization
- Adding the first participant
- Removing the last participant
- Creating constraints with exactly 3 participants (minimum)
- Specific impossible configurations (e.g., participant constrained with everyone)
- localStorage mock scenarios

### Property-Based Testing

Property-based tests will verify universal properties using **fast-check** library:

- Each correctness property listed above will be implemented as a property-based test
- Tests will generate random participants (3-20 names)
- Tests will generate random valid constraint sets
- Tests will run a minimum of 100 iterations per property
- Each test will be tagged with the format: `**Feature: secret-santa, Property N: [property description]**`

### Test Data Generators

Custom generators for property-based testing:

```typescript
// Generates random valid participant names
const participantNameGenerator: Arbitrary<string>

// Generates random participant lists (3-20 participants)
const participantListGenerator: Arbitrary<Participant[]>

// Generates random valid constraint sets
const constraintSetGenerator: Arbitrary<RelationshipConstraint[]>

// Generates configurations where assignment is possible
const validConfigurationGenerator: Arbitrary<{
  participants: Participant[],
  constraints: RelationshipConstraint[]
}>

// Generates configurations where assignment is impossible
const impossibleConfigurationGenerator: Arbitrary<{
  participants: Participant[],
  constraints: RelationshipConstraint[]
}>
```

### Integration Testing

- Full user flow: add participants → add constraints → generate assignments → view results
- Persistence flow: add data → refresh page → verify data restored
- Error recovery: trigger errors → verify system remains in consistent state

## Performance Considerations

- **Assignment generation**: For typical Secret Santa groups (3-50 participants), the backtracking algorithm should complete in milliseconds
- **Large groups**: For groups larger than 50 participants with many constraints, consider implementing timeout and suggesting constraint reduction
- **localStorage**: Limit stored data size, implement cleanup for old data

## Accessibility

- Semantic HTML elements for all interactive components
- ARIA labels for screen readers
- Keyboard navigation support for all actions
- Clear error messages and feedback
- Sufficient color contrast for all text

## Future Enhancements

- Email integration to send assignments directly to participants
- Multiple constraint types (e.g., "must give to", "prefer not to")
- Assignment history to avoid repeating previous years
- Export/import functionality for sharing configurations
- Mobile-responsive design optimization
