# Requirements Document

## Introduction

The Secret Santa Application is a React-based web application that facilitates the organization of Secret Santa gift exchanges. The system allows users to input participant names, define relationship constraints (such as significant others who should not be paired together), and generates valid Secret Santa assignments that respect these constraints.

## Glossary

- **Participant**: A person who is participating in the Secret Santa gift exchange
- **Assignment**: A pairing that designates one Participant as the gift giver and another Participant as the gift receiver
- **Relationship Constraint**: A rule that prevents two specific Participants from being assigned to each other
- **Secret Santa System**: The web application that manages Participants, Relationship Constraints, and Assignments
- **Valid Assignment Set**: A complete set of Assignments where each Participant gives to exactly one other Participant, receives from exactly one other Participant, and no Relationship Constraints are violated
- **Reveal Screen**: A dedicated interface that displays assignments one at a time with a timed reveal sequence
- **Countdown Timer**: A visual timer that counts down from 10 seconds before revealing information

## Requirements

### Requirement 1

**User Story:** As a Secret Santa organizer, I want to add participants to the exchange, so that I can build the list of people who will participate.

#### Acceptance Criteria

1. WHEN a user enters a participant name and submits it, THEN the Secret Santa System SHALL add the Participant to the participant list
2. WHEN a user attempts to add a Participant with an empty name, THEN the Secret Santa System SHALL reject the addition and display an error message
3. WHEN a user attempts to add a Participant with a duplicate name, THEN the Secret Santa System SHALL reject the addition and display an error message
4. WHEN a Participant is added, THEN the Secret Santa System SHALL display the updated participant list immediately
5. THE Secret Santa System SHALL allow a minimum of 3 Participants to be added

### Requirement 2

**User Story:** As a Secret Santa organizer, I want to remove participants from the exchange, so that I can correct mistakes or handle people who can no longer participate.

#### Acceptance Criteria

1. WHEN a user selects a Participant and requests removal, THEN the Secret Santa System SHALL remove the Participant from the participant list
2. WHEN a Participant is removed, THEN the Secret Santa System SHALL also remove all Relationship Constraints associated with that Participant
3. WHEN a Participant is removed, THEN the Secret Santa System SHALL display the updated participant list immediately

### Requirement 3

**User Story:** As a Secret Santa organizer, I want to define relationship constraints between participants, so that significant others or other incompatible pairs are not assigned to each other.

#### Acceptance Criteria

1. WHEN a user selects two Participants and creates a Relationship Constraint, THEN the Secret Santa System SHALL store the constraint as bidirectional
2. WHEN a user attempts to create a Relationship Constraint between a Participant and themselves, THEN the Secret Santa System SHALL reject the constraint and display an error message
3. WHEN a user attempts to create a duplicate Relationship Constraint, THEN the Secret Santa System SHALL reject the constraint and display an error message
4. WHEN a Relationship Constraint is created, THEN the Secret Santa System SHALL display the updated constraint list immediately

### Requirement 4

**User Story:** As a Secret Santa organizer, I want to remove relationship constraints, so that I can correct mistakes or update the rules.

#### Acceptance Criteria

1. WHEN a user selects a Relationship Constraint and requests removal, THEN the Secret Santa System SHALL remove the constraint from the constraint list
2. WHEN a Relationship Constraint is removed, THEN the Secret Santa System SHALL display the updated constraint list immediately

### Requirement 5

**User Story:** As a Secret Santa organizer, I want to generate Secret Santa assignments, so that each participant knows who they are giving a gift to.

#### Acceptance Criteria

1. WHEN a user requests assignment generation with at least 3 Participants, THEN the Secret Santa System SHALL generate a Valid Assignment Set
2. WHEN generating assignments, THEN the Secret Santa System SHALL ensure each Participant gives to exactly one other Participant
3. WHEN generating assignments, THEN the Secret Santa System SHALL ensure each Participant receives from exactly one other Participant
4. WHEN generating assignments, THEN the Secret Santa System SHALL ensure no Participant is assigned to themselves
5. WHEN generating assignments, THEN the Secret Santa System SHALL ensure no Relationship Constraints are violated
6. WHEN a user requests assignment generation with fewer than 3 Participants, THEN the Secret Santa System SHALL reject the request and display an error message
7. WHEN the Relationship Constraints make a Valid Assignment Set impossible, THEN the Secret Santa System SHALL detect this condition and display an error message

### Requirement 6

**User Story:** As a Secret Santa organizer, I want to view the generated assignments, so that I can communicate them to participants.

#### Acceptance Criteria

1. WHEN assignments have been generated, THEN the Secret Santa System SHALL display each Assignment showing the giver and receiver
2. WHEN no assignments have been generated yet, THEN the Secret Santa System SHALL display a message indicating assignments need to be generated
3. THE Secret Santa System SHALL display assignments in a clear, readable format

### Requirement 7

**User Story:** As a Secret Santa organizer, I want to regenerate assignments, so that I can create a new random distribution if needed.

#### Acceptance Criteria

1. WHEN a user requests regeneration after assignments exist, THEN the Secret Santa System SHALL generate a new Valid Assignment Set
2. WHEN assignments are regenerated, THEN the Secret Santa System SHALL replace the previous assignments completely

### Requirement 8

**User Story:** As a Secret Santa organizer, I want the application to persist my data, so that I don't lose my participant list and constraints if I refresh the page.

#### Acceptance Criteria

1. WHEN a Participant is added or removed, THEN the Secret Santa System SHALL persist the participant list to browser local storage immediately
2. WHEN a Relationship Constraint is added or removed, THEN the Secret Santa System SHALL persist the constraint list to browser local storage immediately
3. WHEN the application loads, THEN the Secret Santa System SHALL restore Participants and Relationship Constraints from browser local storage
4. WHEN the application loads with no stored data, THEN the Secret Santa System SHALL initialize with empty participant and constraint lists

### Requirement 9

**User Story:** As a Secret Santa organizer, I want to reveal assignments one at a time with a timed sequence, so that each participant can privately view their assignment without seeing others' assignments.

#### Acceptance Criteria

1. WHEN a user clicks the generate assignments button, THEN the Secret Santa System SHALL navigate to the Reveal Screen
2. WHEN the Reveal Screen displays, THEN the Secret Santa System SHALL show the giver name on the left side of the screen
3. WHEN the Reveal Screen displays, THEN the Secret Santa System SHALL show a Countdown Timer starting at 10 seconds on the right side of the screen
4. WHEN the Countdown Timer reaches 0, THEN the Secret Santa System SHALL replace the timer with the receiver name on the right side
5. WHEN the receiver name is displayed, THEN the Secret Santa System SHALL wait 10 seconds before automatically advancing to the next Assignment
6. WHEN all Assignments have been revealed, THEN the Secret Santa System SHALL return to the main screen or display a completion message
7. WHILE the Reveal Screen is active, THEN the Secret Santa System SHALL display assignments in sequence without allowing the user to skip ahead
