import { describe, it, expect } from 'vitest';
import type { Participant, RelationshipConstraint, Assignment, AppState } from './index';

describe('Type definitions', () => {
  it('should allow creating a Participant', () => {
    const participant: Participant = {
      id: '1',
      name: 'Alice',
    };
    expect(participant.id).toBe('1');
    expect(participant.name).toBe('Alice');
  });

  it('should allow creating a RelationshipConstraint', () => {
    const constraint: RelationshipConstraint = {
      id: '1',
      participant1Id: '1',
      participant2Id: '2',
    };
    expect(constraint.id).toBe('1');
  });

  it('should allow creating an Assignment', () => {
    const assignment: Assignment = {
      giverId: '1',
      receiverId: '2',
    };
    expect(assignment.giverId).toBe('1');
  });

  it('should allow creating an AppState', () => {
    const state: AppState = {
      participants: [],
      constraints: [],
      assignments: [],
    };
    expect(state.participants).toEqual([]);
  });
});
