import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParticipantInput } from './ParticipantInput';
import type { Participant } from '../types';

describe('ParticipantInput', () => {
  it('should call onAddParticipant with valid name', () => {
    const mockOnAdd = vi.fn();
    const participants: Participant[] = [];

    render(<ParticipantInput participants={participants} onAddParticipant={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Enter participant name');
    const button = screen.getByText('Add Participant');

    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('Alice');
  });

  it('should show error for empty name', () => {
    const mockOnAdd = vi.fn();
    const participants: Participant[] = [];

    render(<ParticipantInput participants={participants} onAddParticipant={mockOnAdd} />);

    const button = screen.getByText('Add Participant');
    fireEvent.click(button);

    expect(screen.getByText('Participant name cannot be empty')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should show error for whitespace-only name', () => {
    const mockOnAdd = vi.fn();
    const participants: Participant[] = [];

    render(<ParticipantInput participants={participants} onAddParticipant={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Enter participant name');
    const button = screen.getByText('Add Participant');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(screen.getByText('Participant name cannot be empty')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should show error for duplicate name', () => {
    const mockOnAdd = vi.fn();
    const participants: Participant[] = [
      { id: '1', name: 'Alice' }
    ];

    render(<ParticipantInput participants={participants} onAddParticipant={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Enter participant name');
    const button = screen.getByText('Add Participant');

    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(button);

    expect(screen.getByText('A participant with this name already exists')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should clear input after successful submission', () => {
    const mockOnAdd = vi.fn();
    const participants: Participant[] = [];

    render(<ParticipantInput participants={participants} onAddParticipant={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Enter participant name') as HTMLInputElement;
    const button = screen.getByText('Add Participant');

    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });
});
