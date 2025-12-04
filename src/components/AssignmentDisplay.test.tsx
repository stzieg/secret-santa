import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssignmentDisplay } from './AssignmentDisplay';
import type { Assignment, Participant } from '../types';

describe('AssignmentDisplay', () => {
  const mockParticipants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  const mockAssignments: Assignment[] = [
    { giverId: '1', receiverId: '2' },
    { giverId: '2', receiverId: '3' },
    { giverId: '3', receiverId: '1' },
  ];

  it('displays message when no assignments exist', () => {
    render(
      <AssignmentDisplay assignments={[]} participants={mockParticipants} />
    );

    expect(
      screen.getByText(/No matches generated yet/i)
    ).toBeInTheDocument();
  });

  it('displays assignments with giver and receiver names', () => {
    render(
      <AssignmentDisplay
        assignments={mockAssignments}
        participants={mockParticipants}
      />
    );

    // Check that all givers and receivers are displayed
    // Note: Names may appear multiple times (as giver and receiver)
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Charlie').length).toBeGreaterThan(0);

    // Check that arrows are present
    const arrows = screen.getAllByText('→');
    expect(arrows).toHaveLength(3);
  });

  it('displays assignments in clear format', () => {
    const { container } = render(
      <AssignmentDisplay
        assignments={mockAssignments}
        participants={mockParticipants}
      />
    );

    // Check that the assignment list exists
    const assignmentList = container.querySelector('.assignment-list');
    expect(assignmentList).toBeInTheDocument();

    // Check that we have the correct number of assignment items
    const assignmentItems = container.querySelectorAll('.assignment-item');
    expect(assignmentItems).toHaveLength(3);
  });

  it('handles unknown participant IDs gracefully', () => {
    const assignmentsWithUnknown: Assignment[] = [
      { giverId: '999', receiverId: '2' },
    ];

    render(
      <AssignmentDisplay
        assignments={assignmentsWithUnknown}
        participants={mockParticipants}
      />
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
