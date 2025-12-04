# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize React + TypeScript project using Vite
  - Install dependencies: React, TypeScript, Vitest, fast-check
  - Configure TypeScript with strict mode
  - Set up basic project structure (src/components, src/utils, src/types)
  - _Requirements: All_

- [x] 2. Implement core data types and validation utilities
  - Define TypeScript interfaces for Participant, RelationshipConstraint, Assignment, and AppState
  - Implement participant name validation function
  - Implement constraint validation function
  - _Requirements: 1.1, 1.2, 1.3, 3.2, 3.3_

- [x] 2.1 Write property test for participant validation
  - **Property 2: Whitespace-only names are rejected**
  - **Validates: Requirements 1.2**

- [x] 2.2 Write property test for duplicate name detection
  - **Property 3: Duplicate names are rejected**
  - **Validates: Requirements 1.3**

- [x] 2.3 Write property test for constraint validation
  - **Property 6: Duplicate constraints are rejected**
  - **Validates: Requirements 3.3**

- [x] 3. Implement assignment generation algorithm
  - Create function to build valid receivers map from participants and constraints
  - Implement Hamiltonian cycle finder using backtracking with randomization
  - Implement function to convert cycle to assignments
  - Implement impossibility detection logic
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_

- [x] 3.1 Write property test for valid assignment structure
  - **Property 7: Valid assignment structure**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [x] 3.2 Write property test for bidirectional constraints
  - **Property 5: Constraints are bidirectional**
  - **Validates: Requirements 3.1**

- [ ]* 3.3 Write property test for impossible configuration detection
  - **Property 8: Impossible configurations are detected**
  - **Validates: Requirements 5.7**

- [ ]* 3.4 Write unit tests for edge cases
  - Test with exactly 3 participants (minimum)
  - Test impossible configuration (participant constrained with all others)
  - Test empty participant list handling

- [x] 4. Implement local storage utilities
  - Create functions to save state to localStorage
  - Create functions to load state from localStorage
  - Implement error handling for corrupted data and quota exceeded
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 4.1 Write property test for storage round-trip
  - **Property 11: Storage round-trip preserves state**
  - **Validates: Requirements 8.1, 8.2, 8.3**

- [ ]* 4.2 Write unit tests for storage edge cases
  - Test with empty state
  - Test with corrupted data
  - Test localStorage unavailable scenario

- [x] 5. Create ParticipantInput component
  - Build input form with text field and submit button
  - Implement validation and error display
  - Handle add participant action
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 6. Create ParticipantList component
  - Display list of participants with remove buttons
  - Handle remove participant action
  - Show empty state message when no participants
  - _Requirements: 1.4, 2.1, 2.3_

- [ ]* 6.1 Write property test for adding participants
  - **Property 1: Adding valid participants grows the list**
  - **Validates: Requirements 1.1**

- [ ]* 6.2 Write property test for removing participants with constraints
  - **Property 4: Removing a participant cascades to constraints**
  - **Validates: Requirements 2.1, 2.2**

- [x] 7. Create ConstraintInput component
  - Build form with two participant selectors and submit button
  - Implement validation (no self-constraints, no duplicates)
  - Display error messages for invalid constraints
  - Handle add constraint action
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 8. Create ConstraintList component
  - Display list of constraints with remove buttons
  - Show constraint pairs clearly (e.g., "Alice ↔ Bob")
  - Handle remove constraint action
  - Show empty state when no constraints
  - _Requirements: 3.4, 4.1, 4.2_

- [x] 9. Create AssignmentGenerator component
  - Build generate button with loading state
  - Implement validation (minimum 3 participants)
  - Display error messages for invalid configurations
  - Handle generate and regenerate actions
  - _Requirements: 5.1, 5.6, 5.7, 7.1, 7.2_

- [ ]* 9.1 Write property test for regeneration
  - **Property 10: Regeneration produces valid assignments**
  - **Validates: Requirements 7.1, 7.2**

- [x] 10. Create AssignmentDisplay component
  - Display generated assignments in clear format
  - Show giver → receiver for each assignment
  - Display message when no assignments generated yet
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 10.1 Write property test for assignment display
  - **Property 9: Assignment display contains required information**
  - **Validates: Requirements 6.1**

- [ ]* 10.2 Write unit test for empty assignment state
  - Test display when no assignments exist
  - _Requirements: 6.2_

- [x] 11. Create App component with state management
  - Set up React state for participants, constraints, and assignments
  - Implement useEffect for loading from localStorage on mount
  - Implement useEffect for saving to localStorage on state changes
  - Wire up all child components with state and handlers
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 11.1 Write integration test for full user flow
  - Test: add participants → add constraints → generate assignments → view results
  - _Requirements: All_

- [ ]* 11.2 Write integration test for persistence flow
  - Test: add data → simulate page refresh → verify data restored
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 12. Add styling and polish
  - Apply CSS styling for clean, modern interface
  - Ensure responsive design for mobile devices
  - Add accessibility attributes (ARIA labels, semantic HTML)
  - Implement keyboard navigation support
  - _Requirements: All (user experience)_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Update AppState type to include view routing
  - Add currentView field to AppState interface ('main' | 'reveal')
  - Update App component state to include currentView
  - _Requirements: 9.1_

- [x] 15. Create RevealScreen component with timer logic
  - Create RevealScreen component file and basic structure
  - Implement RevealState interface (currentIndex, phase, countdown)
  - Implement countdown timer using useEffect and setInterval
  - Implement phase transitions (countdown → showing → next assignment)
  - Handle automatic advancement after 10 second display period
  - Implement completion callback when all assignments revealed
  - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ]* 15.1 Write property test for giver name display
  - **Property 12: Reveal screen displays giver name**
  - **Validates: Requirements 9.2**

- [ ]* 15.2 Write property test for countdown transition
  - **Property 13: Countdown transitions to receiver display**
  - **Validates: Requirements 9.4**

- [ ]* 15.3 Write property test for assignment advancement
  - **Property 14: Assignments advance after display period**
  - **Validates: Requirements 9.5**

- [ ]* 15.4 Write property test for sequential display
  - **Property 15: Assignments display in sequence**
  - **Validates: Requirements 9.7**

- [x] 16. Add RevealScreen styling
  - Create CSS for full-screen layout
  - Style giver name (left-aligned, large text)
  - Style countdown timer (right-aligned, large text)
  - Style receiver name (right-aligned, large text)
  - Ensure clean, readable design with good contrast
  - _Requirements: 9.2, 9.3, 9.4_

- [x] 17. Integrate RevealScreen into App component
  - Update AssignmentGenerator to trigger view change to 'reveal' on generate
  - Add conditional rendering in App to show RevealScreen when currentView is 'reveal'
  - Pass assignments and participants to RevealScreen
  - Implement onComplete handler to return to main view
  - _Requirements: 9.1, 9.6_

- [ ]* 17.1 Write unit test for view navigation
  - Test clicking generate button changes view to 'reveal'
  - Test completion callback returns view to 'main'
  - _Requirements: 9.1, 9.6_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
