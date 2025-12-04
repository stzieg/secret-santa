import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText('Secret Santa')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<App />);
    expect(screen.getByText('Participants')).toBeInTheDocument();
    expect(screen.getByText('Relationship Constraints')).toBeInTheDocument();
    expect(screen.getByText('Generate Matches')).toBeInTheDocument();
  });

  it('renders participant input component', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter participant name')).toBeInTheDocument();
  });

  it('renders generate matches button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /generate.*matches/i })).toBeInTheDocument();
  });
});
