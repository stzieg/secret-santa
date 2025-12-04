import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateParticipantName, validateConstraint } from './validation';
import type { Participant, RelationshipConstraint } from '../types';

describe('validateParticipantName', () => {
  it('should accept valid non-duplicate names', () => {
    const existingParticipants: Participant[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];
    
    expect(validateParticipantName('Charlie', existingParticipants)).toBe(true);
  });

  it('should reject empty names', () => {
    const existingParticipants: Participant[] = [];
    
    expect(validateParticipantName('', existingParticipants)).toBe(false);
  });

  it('should reject whitespace-only names', () => {
    const existingParticipants: Participant[] = [];
    
    expect(validateParticipantName('   ', existingParticipants)).toBe(false);
    expect(validateParticipantName('\t', existingParticipants)).toBe(false);
    expect(validateParticipantName('\n', existingParticipants)).toBe(false);
  });

  it('should reject duplicate names', () => {
    const existingParticipants: Participant[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];
    
    expect(validateParticipantName('Alice', existingParticipants)).toBe(false);
    expect(validateParticipantName('Bob', existingParticipants)).toBe(false);
  });

  it('should accept names when participant list is empty', () => {
    const existingParticipants: Participant[] = [];
    
    expect(validateParticipantName('Alice', existingParticipants)).toBe(true);
  });

  /**
   * Feature: secret-santa, Property 2: Whitespace-only names are rejected
   * Validates: Requirements 1.2
   * 
   * For any string composed entirely of whitespace characters, attempting to add it 
   * as a participant name should be rejected and the participant list should remain unchanged.
   */
  it('property: whitespace-only names are rejected', () => {
    fc.assert(
      fc.property(
        // Generate strings composed entirely of whitespace characters
        fc.stringMatching(/^[\s]+$/),
        // Generate arbitrary participant lists
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
          }),
          { maxLength: 20 }
        ),
        (whitespaceString, existingParticipants) => {
          // The validation should reject whitespace-only names
          const result = validateParticipantName(whitespaceString, existingParticipants);
          expect(result).toBe(false);
          
          // The participant list should remain unchanged (length stays the same)
          expect(existingParticipants.length).toBe(existingParticipants.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: secret-santa, Property 3: Duplicate names are rejected
   * Validates: Requirements 1.3
   * 
   * For any participant already in the list, attempting to add another participant 
   * with the same name should be rejected and the participant list should remain unchanged.
   */
  it('property: duplicate names are rejected', () => {
    fc.assert(
      fc.property(
        // Generate a non-empty list of participants with valid names
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (existingParticipants) => {
          // Pick a random existing participant's name
          const duplicateName = existingParticipants[0].name;
          const initialLength = existingParticipants.length;
          
          // Attempting to add a duplicate name should be rejected
          const result = validateParticipantName(duplicateName, existingParticipants);
          expect(result).toBe(false);
          
          // The participant list should remain unchanged
          expect(existingParticipants.length).toBe(initialLength);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('validateConstraint', () => {
  const participants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  it('should accept valid constraints', () => {
    const constraint: RelationshipConstraint = {
      id: '1',
      participant1Id: '1',
      participant2Id: '2',
    };
    const existingConstraints: RelationshipConstraint[] = [];
    
    expect(validateConstraint(constraint, participants, existingConstraints)).toBe(true);
  });

  it('should reject self-constraints', () => {
    const constraint: RelationshipConstraint = {
      id: '1',
      participant1Id: '1',
      participant2Id: '1',
    };
    const existingConstraints: RelationshipConstraint[] = [];
    
    expect(validateConstraint(constraint, participants, existingConstraints)).toBe(false);
  });

  it('should reject constraints with non-existent participants', () => {
    const constraint: RelationshipConstraint = {
      id: '1',
      participant1Id: '1',
      participant2Id: '999',
    };
    const existingConstraints: RelationshipConstraint[] = [];
    
    expect(validateConstraint(constraint, participants, existingConstraints)).toBe(false);
  });

  it('should reject duplicate constraints (same order)', () => {
    const existingConstraints: RelationshipConstraint[] = [
      { id: '1', participant1Id: '1', participant2Id: '2' },
    ];
    const constraint: RelationshipConstraint = {
      id: '2',
      participant1Id: '1',
      participant2Id: '2',
    };
    
    expect(validateConstraint(constraint, participants, existingConstraints)).toBe(false);
  });

  it('should reject duplicate constraints (reverse order)', () => {
    const existingConstraints: RelationshipConstraint[] = [
      { id: '1', participant1Id: '1', participant2Id: '2' },
    ];
    const constraint: RelationshipConstraint = {
      id: '2',
      participant1Id: '2',
      participant2Id: '1',
    };
    
    expect(validateConstraint(constraint, participants, existingConstraints)).toBe(false);
  });

  it('should accept constraints between different participant pairs', () => {
    const existingConstraints: RelationshipConstraint[] = [
      { id: '1', participant1Id: '1', participant2Id: '2' },
    ];
    const constraint: RelationshipConstraint = {
      id: '2',
      participant1Id: '2',
      participant2Id: '3',
    };
    
    expect(validateConstraint(constraint, participants, existingConstraints)).toBe(true);
  });

  /**
   * Feature: secret-santa, Property 6: Duplicate constraints are rejected
   * Validates: Requirements 3.3
   * 
   * For any existing relationship constraint between participants A and B, attempting to 
   * create another constraint between A and B (or B and A) should be rejected and the 
   * constraint list should remain unchanged.
   */
  it('property: duplicate constraints are rejected', () => {
    fc.assert(
      fc.property(
        // Generate a list of participants (at least 2)
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
          }),
          { minLength: 2, maxLength: 10 }
        ),
        // Generate a non-empty list of existing constraints
        fc.nat(),
        (generatedParticipants, seed) => {
          // Ensure we have at least 2 participants
          if (generatedParticipants.length < 2) return;

          // Create at least one existing constraint
          const existingConstraint: RelationshipConstraint = {
            id: fc.sample(fc.uuid(), 1)[0],
            participant1Id: generatedParticipants[0].id,
            participant2Id: generatedParticipants[1].id,
          };
          
          const existingConstraints = [existingConstraint];
          const initialLength = existingConstraints.length;

          // Test 1: Try to add the exact same constraint (same order)
          const duplicateConstraintSameOrder: RelationshipConstraint = {
            id: fc.sample(fc.uuid(), 1)[0],
            participant1Id: generatedParticipants[0].id,
            participant2Id: generatedParticipants[1].id,
          };
          
          const resultSameOrder = validateConstraint(
            duplicateConstraintSameOrder,
            generatedParticipants,
            existingConstraints
          );
          expect(resultSameOrder).toBe(false);
          expect(existingConstraints.length).toBe(initialLength);

          // Test 2: Try to add the same constraint in reverse order (bidirectional)
          const duplicateConstraintReverse: RelationshipConstraint = {
            id: fc.sample(fc.uuid(), 1)[0],
            participant1Id: generatedParticipants[1].id,
            participant2Id: generatedParticipants[0].id,
          };
          
          const resultReverse = validateConstraint(
            duplicateConstraintReverse,
            generatedParticipants,
            existingConstraints
          );
          expect(resultReverse).toBe(false);
          expect(existingConstraints.length).toBe(initialLength);
        }
      ),
      { numRuns: 100 }
    );
  });
});
