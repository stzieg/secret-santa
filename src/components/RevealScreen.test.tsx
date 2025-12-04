import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RevealScreen } from './RevealScreen';
import type { Assignment, Participant } from '../types';

describe('RevealScreen', () => {
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

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays giver name on mount', () => {
    const onComplete = vi.fn();
    const onExit = vi.fn();
    render(
      <RevealScreen
        assignments={mockAssignments}
        participants={mockParticipants}
        onComplete={onComplete}
        onExit={onExit}
      />
    );

    // Should display one of the participant names as giver (assignments are randomized)
    const giverNames = mockParticipants.map(p => p.name);
    const displayedNames = giverNames.filter(name => screen.queryByText(name));
    expect(displayedNames.length).toBeGreaterThan(0);
  });

  it('displays countdown timer initially', () => {
    const onComplete = vi.fn();
    const onExit = vi.fn();
    render(
      <RevealScreen
        assignments={mockAssignments}
        participants={mockParticipants}
        onComplete={onComplete}
        onExit={onExit}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('transitions from countdown to receiver name after 10 seconds', () => {
    const onComplete = vi.fn();
    const onExit = vi.fn();
    render(
      <RevealScreen
        assignments={mockAssignments}
        participants={mockParticipants}
        onComplete={onComplete}
        onExit={onExit}
      />
    );

    // Initially shows countdown
    expect(screen.getByText('10')).toBeInTheDocument();

    // Advance time by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should now show receiver name (countdown should be gone)
    expect(screen.queryByText('10')).not.toBeInTheDocument();
    
    // Should show one of the participant names as receiver
    const participantNames = mockParticipants.map(p => p.name);
    const displayedReceivers = participantNames.filter(name => {
      const elements = screen.queryAllByText(name);
      return elements.length > 0;
    });
    expect(displayedReceivers.length).toBeGreaterThan(0);
  });

  it('advances to next assignment after showing receiver for 10 seconds', () => {
    const onComplete = vi.fn();
    const onExit = vi.fn();
    render(
      <RevealScreen
        assignments={mockAssignments}
        participants={mockParticipants}
        onComplete={onComplete}
        onExit={onExit}
      />
    );

    // Get the first giver name
    const participantNames = mockParticipants.map(p => p.name);
    const firstGiverElements = participantNames.map(name => screen.queryByText(name)).filter(el => el !== null);
    expect(firstGiverElements.length).toBeGreaterThan(0);

    // Advance through countdown phase (10s)
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should show receiver (countdown should be gone)
    expect(screen.queryByText('10')).not.toBeInTheDocument();

    // Advance through showing phase (10s)
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should now be on second assignment with countdown timer back
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows completion message after all assignments are revealed', () => {
    const onComplete = vi.fn();
    const onExit = vi.fn();
    render(
      <RevealScreen
        assignments={mockAssignments}
        participants={mockParticipants}
        onComplete={onComplete}
        onExit={onExit}
      />
    );

    // Go through all 3 assignments
    // For each assignment we need to:
    // 1. Countdown phase: advance 10 times (1s each) = 10s
    // 2. Showing phase: advance 1 time (10s) = 10s
    
    for (let i = 0; i < 3; i++) {
      // Countdown phase (10 intervals of 1s each)
      act(() => {
        for (let j = 0; j < 10; j++) {
          vi.advanceTimersByTime(1000);
        }
      });
      
      // Showing phase (1 timeout of 10s)
      act(() => {
        vi.advanceTimersByTime(10000);
      });
    }
    
    // Should show completion message and stay there
    expect(screen.getByText('Merry Christmas!')).toBeInTheDocument();
    
    // Advance time - completion message should remain (no auto-close)
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(screen.getByText('Merry Christmas!')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('handles unknown participant IDs gracefully', () => {
    const assignmentsWithUnknown: Assignment[] = [
      { giverId: '999', receiverId: '2' },
    ];
    const onComplete = vi.fn();
    const onExit = vi.fn();

    render(
      <RevealScreen
        assignments={assignmentsWithUnknown}
        participants={mockParticipants}
        onComplete={onComplete}
        onExit={onExit}
      />
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
