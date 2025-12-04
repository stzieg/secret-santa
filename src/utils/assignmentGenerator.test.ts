import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateAssignments, isAssignmentPossible } from './assignmentGenerator';
import type { Participant, RelationshipConstraint } from '../types';

describe('assignmentGenerator', () => {
  describe('generateAssignments', () => {
    it('should return null for fewer than 3 participants', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];
      const constraints: RelationshipConstraint[] = [];

      const result = generateAssignments(participants, constraints);
      expect(result).toBeNull();
    });

    it('should generate valid assignments for 3 participants with no constraints', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
      ];
      const constraints: RelationshipConstraint[] = [];

      const result = generateAssignments(participants, constraints);
      expect(result).not.toBeNull();
      expect(result).toHaveLength(3);

      // Each participant should give to exactly one other
      const giverIds = result!.map((a) => a.giverId).sort();
      expect(giverIds).toEqual(['1', '2', '3']);

      // Each participant should receive from exactly one other
      const receiverIds = result!.map((a) => a.receiverId).sort();
      expect(receiverIds).toEqual(['1', '2', '3']);

      // No one should give to themselves
      result!.forEach((assignment) => {
        expect(assignment.giverId).not.toBe(assignment.receiverId);
      });
    });

    it('should respect relationship constraints', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
        { id: '4', name: 'Diana' },
      ];
      const constraints: RelationshipConstraint[] = [
        { id: 'c1', participant1Id: '1', participant2Id: '2' },
      ];

      const result = generateAssignments(participants, constraints);
      expect(result).not.toBeNull();

      // Alice should not give to Bob, and Bob should not give to Alice
      const aliceAssignment = result!.find((a) => a.giverId === '1');
      expect(aliceAssignment?.receiverId).not.toBe('2');

      const bobAssignment = result!.find((a) => a.giverId === '2');
      expect(bobAssignment?.receiverId).not.toBe('1');
    });

    it('should return null for impossible configurations', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
      ];
      // Alice is constrained with everyone else
      const constraints: RelationshipConstraint[] = [
        { id: 'c1', participant1Id: '1', participant2Id: '2' },
        { id: 'c2', participant1Id: '1', participant2Id: '3' },
      ];

      const result = generateAssignments(participants, constraints);
      expect(result).toBeNull();
    });
  });

  describe('isAssignmentPossible', () => {
    it('should return false for fewer than 3 participants', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];
      const constraints: RelationshipConstraint[] = [];

      expect(isAssignmentPossible(participants, constraints)).toBe(false);
    });

    it('should return true for valid configuration', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
      ];
      const constraints: RelationshipConstraint[] = [];

      expect(isAssignmentPossible(participants, constraints)).toBe(true);
    });

    it('should return false when a participant has no valid receivers', () => {
      const participants: Participant[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
      ];
      const constraints: RelationshipConstraint[] = [
        { id: 'c1', participant1Id: '1', participant2Id: '2' },
        { id: 'c2', participant1Id: '1', participant2Id: '3' },
      ];

      expect(isAssignmentPossible(participants, constraints)).toBe(false);
    });
  });

  /**
   * Feature: secret-santa, Property 5: Constraints are bidirectional
   * 
   * For any two distinct participants A and B, if a relationship constraint exists between them,
   * then neither A can be assigned to B nor B can be assigned to A in any generated assignment set.
   * 
   * Validates: Requirements 3.1
   */
  describe('Property 5: Constraints are bidirectional', () => {
    it('should enforce bidirectional constraints in all generated assignments', () => {
      // Generator for participant names (non-empty strings)
      const participantNameArb = fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0);

      // Generator for a list of 3-10 participants with unique names
      const participantsArb = fc.uniqueArray(participantNameArb, { minLength: 3, maxLength: 10 }).map((names, idx) =>
        names.map((name, i) => ({ id: `${idx}-${i}`, name }))
      );

      // Generator for at least one constraint
      const configArb = participantsArb.chain((participants) => {
        // Generate at least one constraint, but not too many to avoid impossible configurations
        const maxConstraints = Math.max(1, Math.floor(participants.length / 3));
        
        return fc.array(
          fc.tuple(
            fc.integer({ min: 0, max: participants.length - 1 }),
            fc.integer({ min: 0, max: participants.length - 1 })
          ).filter(([i, j]) => i !== j), // No self-constraints
          { minLength: 1, maxLength: maxConstraints }
        ).map((pairs) => {
          // Remove duplicates and create constraints
          const uniquePairs = new Set<string>();
          const constraints: RelationshipConstraint[] = [];
          
          pairs.forEach(([i, j]) => {
            const key1 = `${Math.min(i, j)}-${Math.max(i, j)}`;
            
            if (!uniquePairs.has(key1)) {
              uniquePairs.add(key1);
              
              constraints.push({
                id: `c-${constraints.length}`,
                participant1Id: participants[i].id,
                participant2Id: participants[j].id,
              });
            }
          });
          
          return { participants, constraints };
        });
      });

      fc.assert(
        fc.property(configArb, ({ participants, constraints }) => {
          const assignments = generateAssignments(participants, constraints);

          // If assignment generation fails, that's acceptable (impossible configuration)
          if (assignments === null) {
            return true;
          }

          // For each constraint, verify bidirectionality
          constraints.forEach((constraint) => {
            const { participant1Id, participant2Id } = constraint;

            // Check that participant1 does not give to participant2
            const assignment1 = assignments.find((a) => a.giverId === participant1Id);
            if (assignment1) {
              expect(assignment1.receiverId).not.toBe(participant2Id);
            }

            // Check that participant2 does not give to participant1
            const assignment2 = assignments.find((a) => a.giverId === participant2Id);
            if (assignment2) {
              expect(assignment2.receiverId).not.toBe(participant1Id);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: secret-santa, Property 7: Valid assignment structure
   * 
   * For any generated assignment set with N participants, the following must all hold:
   * - Each participant gives to exactly one other participant
   * - Each participant receives from exactly one other participant
   * - No participant is assigned to themselves
   * - No relationship constraints are violated
   * - The assignments form a single cycle through all participants
   * 
   * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
   */
  describe('Property 7: Valid assignment structure', () => {
    it('should generate valid assignment structure for any valid configuration', () => {
      // Generator for participant names (non-empty strings)
      const participantNameArb = fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0);

      // Generator for a list of 3-15 participants with unique names
      const participantsArb = fc.uniqueArray(participantNameArb, { minLength: 3, maxLength: 15 }).map((names, idx) =>
        names.map((name, i) => ({ id: `${idx}-${i}`, name }))
      );

      // Generator for valid constraints (not constraining everyone)
      const constraintsArb = participantsArb.chain((participants) => {
        if (participants.length < 3) {
          return fc.constant([]);
        }

        // Generate a reasonable number of constraints that won't make assignment impossible
        const maxConstraints = Math.floor(participants.length / 2);
        
        return fc.array(
          fc.tuple(
            fc.integer({ min: 0, max: participants.length - 1 }),
            fc.integer({ min: 0, max: participants.length - 1 })
          ).filter(([i, j]) => i !== j), // No self-constraints
          { maxLength: maxConstraints }
        ).map((pairs) => {
          // Remove duplicates and create constraints
          const uniquePairs = new Set<string>();
          const constraints: RelationshipConstraint[] = [];
          
          pairs.forEach(([i, j]) => {
            const key1 = `${i}-${j}`;
            const key2 = `${j}-${i}`;
            
            if (!uniquePairs.has(key1) && !uniquePairs.has(key2)) {
              uniquePairs.add(key1);
              uniquePairs.add(key2);
              
              constraints.push({
                id: `c-${constraints.length}`,
                participant1Id: participants[i].id,
                participant2Id: participants[j].id,
              });
            }
          });
          
          return constraints;
        });
      });

      // Combined generator for valid configurations
      const validConfigArb = participantsArb.chain((participants) =>
        constraintsArb.map((constraints) => ({ participants, constraints }))
      );

      fc.assert(
        fc.property(validConfigArb, ({ participants, constraints }) => {
          const assignments = generateAssignments(participants, constraints);

          // If assignment generation fails, it should be because it's impossible
          if (assignments === null) {
            // This is acceptable - some random configurations may be impossible
            return true;
          }

          // Property 1: Each participant gives to exactly one other participant (Requirement 5.2)
          const giverIds = assignments.map((a) => a.giverId).sort();
          const expectedIds = participants.map((p) => p.id).sort();
          expect(giverIds).toEqual(expectedIds);

          // Property 2: Each participant receives from exactly one other participant (Requirement 5.3)
          const receiverIds = assignments.map((a) => a.receiverId).sort();
          expect(receiverIds).toEqual(expectedIds);

          // Property 3: No participant is assigned to themselves (Requirement 5.4)
          assignments.forEach((assignment) => {
            expect(assignment.giverId).not.toBe(assignment.receiverId);
          });

          // Property 4: No relationship constraints are violated (Requirement 5.5)
          const constrainedPairs = new Set<string>();
          constraints.forEach((constraint) => {
            constrainedPairs.add(`${constraint.participant1Id}-${constraint.participant2Id}`);
            constrainedPairs.add(`${constraint.participant2Id}-${constraint.participant1Id}`);
          });

          assignments.forEach((assignment) => {
            const pairKey = `${assignment.giverId}-${assignment.receiverId}`;
            expect(constrainedPairs.has(pairKey)).toBe(false);
          });

          // Property 5: The assignments form a single cycle through all participants (Requirement 5.1)
          // Start from any participant and follow the chain
          const startId = assignments[0].giverId;
          let currentId = startId;
          const visited = new Set<string>();

          for (let i = 0; i < participants.length; i++) {
            visited.add(currentId);
            const assignment = assignments.find((a) => a.giverId === currentId);
            expect(assignment).toBeDefined();
            currentId = assignment!.receiverId;
          }

          // Should have visited all participants exactly once and returned to start
          expect(visited.size).toBe(participants.length);
          expect(currentId).toBe(startId);
        }),
        { numRuns: 100 }
      );
    });
  });
});
