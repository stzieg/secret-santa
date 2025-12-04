import { describe, it, expect, beforeEach } from 'vitest';
import { saveState, loadState, clearState } from './storage';
import type { AppState } from '../types';

describe('Storage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should save and load state successfully', () => {
    const state: AppState = {
      participants: [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ],
      constraints: [
        { id: 'c1', participant1Id: '1', participant2Id: '2' },
      ],
      assignments: [],
      currentView: 'main',
    };

    const saveResult = saveState(state);
    expect(saveResult.success).toBe(true);

    const loadResult = loadState();
    expect(loadResult.success).toBe(true);
    // currentView is always 'main' on load
    expect(loadResult.data).toEqual({ ...state, currentView: 'main' });
  });

  it('should return empty state when no data exists', () => {
    const result = loadState();
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      participants: [],
      constraints: [],
      assignments: [],
      currentView: 'main',
    });
  });

  it('should handle corrupted data gracefully', () => {
    // Manually set corrupted data
    localStorage.setItem('secret-santa-state', 'invalid json{');

    const result = loadState();
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      participants: [],
      constraints: [],
      assignments: [],
      currentView: 'main',
    });
    expect(result.error).toBeDefined();
  });

  it('should handle invalid structure gracefully', () => {
    // Set data with invalid structure
    localStorage.setItem('secret-santa-state', JSON.stringify({ invalid: 'structure' }));

    const result = loadState();
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      participants: [],
      constraints: [],
      assignments: [],
      currentView: 'main',
    });
    expect(result.error).toContain('Corrupted data');
  });

  it('should clear state', () => {
    const state: AppState = {
      participants: [{ id: '1', name: 'Alice' }],
      constraints: [],
      assignments: [],
      currentView: 'main',
    };

    saveState(state);
    expect(localStorage.getItem('secret-santa-state')).not.toBeNull();

    clearState();
    expect(localStorage.getItem('secret-santa-state')).toBeNull();
  });
});
