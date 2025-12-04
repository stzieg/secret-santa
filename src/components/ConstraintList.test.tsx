import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConstraintList } from './ConstraintList';
import type { Participant, RelationshipConstraint } from '../types';

describe('ConstraintList', () => {
  const mockParticipants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  const mockConstraints: RelationshipConstraint[] = [
    { id: 'c1', participant1Id: '1', participant2Id: '2' },
    { id: 'c2', participant1Id: '2', participant2Id: '3' },
  ];

  it('displays empty state when no constraints exist', () => {
    const onRemove = vi.fn();
    render(
      <ConstraintList 
        constraints={[]} 
        participants={mockParticipants} 
        onRemoveConstraint={onRemove} 
      />
    );

    expect(screen.getByText(/no constraints yet/i)).toBeInTheDocument();
  });

  it('displays constraint pairs with bidirectional arrow', () => {
    const onRemove = vi.fn();
    render(
      <ConstraintList 
        constraints={mockConstraints} 
        participants={mockParticipants} 
        onRemoveConstraint={onRemove} 
      />
    );

    expect(screen.getByText('Alice ↔ Bob')).toBeInTheDocument();
    expect(screen.getByText('Bob ↔ Charlie')).toBeInTheDocument();
  });

  it('displays constraint count', () => {
    const onRemove = vi.fn();
    render(
      <ConstraintList 
        constraints={mockConstraints} 
        participants={mockParticipants} 
        onRemoveConstraint={onRemove} 
      />
    );

    expect(screen.getByText('Constraints (2)')).toBeInTheDocument();
  });

  it('calls onRemoveConstraint when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <ConstraintList 
        constraints={mockConstraints} 
        participants={mockParticipants} 
        onRemoveConstraint={onRemove} 
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith('c1');
  });

  it('handles unknown participant ids gracefully', () => {
    const onRemove = vi.fn();
    const constraintWithUnknown: RelationshipConstraint[] = [
      { id: 'c1', participant1Id: '999', participant2Id: '2' },
    ];

    render(
      <ConstraintList 
        constraints={constraintWithUnknown} 
        participants={mockParticipants} 
        onRemoveConstraint={onRemove} 
      />
    );

    expect(screen.getByText('Unknown ↔ Bob')).toBeInTheDocument();
  });
});
