import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssignmentGenerator } from './AssignmentGenerator';
import type { Participant, RelationshipConstraint } from '../types';

describe('AssignmentGenerator', () => {
  const mockParticipants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  const mockConstraints: RelationshipConstraint[] = [];

  it('renders generate button', () => {
    const mockOnGenerate = vi.fn();
    render(
      <AssignmentGenerator
        participants={mockParticipants}
        constraints={mockConstraints}
        onGenerateAssignments={mockOnGenerate}
      />
    );

    expect(screen.getByRole('button', { name: /generate.*secret santa.*matches/i })).toBeInTheDocument();
  });

  it('shows error when fewer than 3 participants', () => {
    const mockOnGenerate = vi.fn();
    const twoParticipants = mockParticipants.slice(0, 2);

    render(
      <AssignmentGenerator
        participants={twoParticipants}
        constraints={mockConstraints}
        onGenerateAssignments={mockOnGenerate}
      />
    );

    const button = screen.getByRole('button', { name: /generate.*secret santa.*matches/i });
    
    // Button should be disabled with fewer than 3 participants
    expect(button).toBeDisabled();
    
    // Info message should be displayed
    expect(screen.getByRole('status')).toHaveTextContent(/at least 3 participants/i);
    
    fireEvent.click(button);
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('generates assignments with valid configuration', async () => {
    const mockOnGenerate = vi.fn();

    render(
      <AssignmentGenerator
        participants={mockParticipants}
        constraints={mockConstraints}
        onGenerateAssignments={mockOnGenerate}
      />
    );

    const button = screen.getByRole('button', { name: /generate.*secret santa.*matches/i });
    fireEvent.click(button);

    // Wait for async generation
    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalled();
    });

    const assignments = mockOnGenerate.mock.calls[0][0];
    expect(assignments).toHaveLength(3);
  });

  it('shows loading state during generation', () => {
    const mockOnGenerate = vi.fn();

    render(
      <AssignmentGenerator
        participants={mockParticipants}
        constraints={mockConstraints}
        onGenerateAssignments={mockOnGenerate}
      />
    );

    const button = screen.getByRole('button', { name: /generate.*secret santa.*matches/i });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
  });

  it('shows error for impossible configuration', async () => {
    const mockOnGenerate = vi.fn();
    
    // Create impossible configuration: participant constrained with all others
    const impossibleConstraints: RelationshipConstraint[] = [
      { id: 'c1', participant1Id: '1', participant2Id: '2' },
      { id: 'c2', participant1Id: '1', participant2Id: '3' },
    ];

    render(
      <AssignmentGenerator
        participants={mockParticipants}
        constraints={impossibleConstraints}
        onGenerateAssignments={mockOnGenerate}
      />
    );

    const button = screen.getByRole('button', { name: /generate.*secret santa.*matches/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/cannot generate matches/i);
    });

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });
});
