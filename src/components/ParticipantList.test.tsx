import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParticipantList } from './ParticipantList';
import type { Participant } from '../types';

describe('ParticipantList', () => {
  const mockParticipants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  it('displays empty state message when no participants', () => {
    const onRemove = vi.fn();
    render(<ParticipantList participants={[]} onRemoveParticipant={onRemove} />);
    
    expect(screen.getByText(/no participants yet/i)).toBeInTheDocument();
  });

  it('displays list of participants with names', () => {
    const onRemove = vi.fn();
    render(<ParticipantList participants={mockParticipants} onRemoveParticipant={onRemove} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('displays participant count', () => {
    const onRemove = vi.fn();
    render(<ParticipantList participants={mockParticipants} onRemoveParticipant={onRemove} />);
    
    expect(screen.getByText('Participants (3)')).toBeInTheDocument();
  });

  it('calls onRemoveParticipant with correct id when remove button clicked', () => {
    const onRemove = vi.fn();
    render(<ParticipantList participants={mockParticipants} onRemoveParticipant={onRemove} />);
    
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]); // Click remove for Alice
    
    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('has accessible remove buttons with participant names', () => {
    const onRemove = vi.fn();
    render(<ParticipantList participants={mockParticipants} onRemoveParticipant={onRemove} />);
    
    expect(screen.getByRole('button', { name: /remove alice/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove bob/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove charlie/i })).toBeInTheDocument();
  });
});
