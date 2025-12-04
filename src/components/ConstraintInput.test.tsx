import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConstraintInput } from './ConstraintInput';
import type { Participant, RelationshipConstraint } from '../types';

describe('ConstraintInput', () => {
  const mockParticipants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  it('should call onAddConstraint with valid participant IDs', () => {
    const mockOnAdd = vi.fn();
    const constraints: RelationshipConstraint[] = [];

    render(
      <ConstraintInput
        participants={mockParticipants}
        constraints={constraints}
        onAddConstraint={mockOnAdd}
      />
    );

    const selects = screen.getAllByRole('combobox');
    const button = screen.getByText('Add Constraint');

    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '2' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('1', '2');
  });

  it('should show error when no participants selected', () => {
    const mockOnAdd = vi.fn();
    const constraints: RelationshipConstraint[] = [];

    render(
      <ConstraintInput
        participants={mockParticipants}
        constraints={constraints}
        onAddConstraint={mockOnAdd}
      />
    );

    const button = screen.getByText('Add Constraint');
    fireEvent.click(button);

    expect(screen.getByText('Please select both participants')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should show error for self-constraint', () => {
    const mockOnAdd = vi.fn();
    const constraints: RelationshipConstraint[] = [];

    render(
      <ConstraintInput
        participants={mockParticipants}
        constraints={constraints}
        onAddConstraint={mockOnAdd}
      />
    );

    const selects = screen.getAllByRole('combobox');
    const button = screen.getByText('Add Constraint');

    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '1' } });
    fireEvent.click(button);

    expect(screen.getByText('A participant cannot be constrained with themselves')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should show error for duplicate constraint', () => {
    const mockOnAdd = vi.fn();
    const constraints: RelationshipConstraint[] = [
      { id: 'c1', participant1Id: '1', participant2Id: '2' },
    ];

    render(
      <ConstraintInput
        participants={mockParticipants}
        constraints={constraints}
        onAddConstraint={mockOnAdd}
      />
    );

    const selects = screen.getAllByRole('combobox');
    const button = screen.getByText('Add Constraint');

    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '2' } });
    fireEvent.click(button);

    expect(screen.getByText('This constraint already exists')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should show error for duplicate constraint (reverse order)', () => {
    const mockOnAdd = vi.fn();
    const constraints: RelationshipConstraint[] = [
      { id: 'c1', participant1Id: '1', participant2Id: '2' },
    ];

    render(
      <ConstraintInput
        participants={mockParticipants}
        constraints={constraints}
        onAddConstraint={mockOnAdd}
      />
    );

    const selects = screen.getAllByRole('combobox');
    const button = screen.getByText('Add Constraint');

    // Try to add the same constraint in reverse order
    fireEvent.change(selects[0], { target: { value: '2' } });
    fireEvent.change(selects[1], { target: { value: '1' } });
    fireEvent.click(button);

    expect(screen.getByText('This constraint already exists')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should clear selections after successful submission', () => {
    const mockOnAdd = vi.fn();
    const constraints: RelationshipConstraint[] = [];

    render(
      <ConstraintInput
        participants={mockParticipants}
        constraints={constraints}
        onAddConstraint={mockOnAdd}
      />
    );

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    const button = screen.getByText('Add Constraint');

    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '2' } });
    fireEvent.click(button);

    expect(selects[0].value).toBe('');
    expect(selects[1].value).toBe('');
  });
});
