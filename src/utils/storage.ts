import type { AppState } from '../types';

const STORAGE_KEY = 'secret-santa-state';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Saves the application state to localStorage
 * @param state The application state to save
 * @returns Result indicating success or failure with error message
 */
export function saveState(state: AppState): StorageResult<void> {
  try {
    // Don't persist currentView - it's transient UI state
    const { currentView, ...persistentState } = state;
    const serialized = JSON.stringify(persistentState);
    localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true };
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      return {
        success: false,
        error: 'Storage quota exceeded. Please clear some data.',
      };
    }
    // Handle other errors
    return {
      success: false,
      error: 'Failed to save state to storage.',
    };
  }
}

/**
 * Loads the application state from localStorage
 * @returns Result with loaded state or error message
 */
export function loadState(): StorageResult<AppState> {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    
    // No stored data - return empty state
    if (serialized === null) {
      return {
        success: true,
        data: {
          participants: [],
          constraints: [],
          assignments: [],
          currentView: 'main',
        },
      };
    }

    // Parse stored data
    const parsed = JSON.parse(serialized);
    
    // Validate the structure
    if (!isValidAppState(parsed)) {
      // Corrupted data - clear it and return empty state
      localStorage.removeItem(STORAGE_KEY);
      return {
        success: true,
        data: {
          participants: [],
          constraints: [],
          assignments: [],
          currentView: 'main',
        },
        error: 'Corrupted data was cleared. Starting fresh.',
      };
    }

    // Always start with 'main' view on load
    return {
      success: true,
      data: {
        ...parsed,
        currentView: 'main',
      },
    };
  } catch (error) {
    // Handle JSON parse errors or other issues
    localStorage.removeItem(STORAGE_KEY);
    return {
      success: true,
      data: {
        participants: [],
        constraints: [],
        assignments: [],
        currentView: 'main',
      },
      error: 'Failed to load state. Starting fresh.',
    };
  }
}

/**
 * Clears all stored state from localStorage
 */
export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Validates that the parsed data matches the AppState structure
 */
function isValidAppState(data: unknown): data is AppState {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const state = data as Record<string, unknown>;

  // Check that all required properties exist and are arrays
  if (!Array.isArray(state.participants) || 
      !Array.isArray(state.constraints) || 
      !Array.isArray(state.assignments)) {
    return false;
  }

  // Validate participants structure
  for (const participant of state.participants) {
    if (typeof participant !== 'object' || participant === null) {
      return false;
    }
    const p = participant as Record<string, unknown>;
    if (typeof p.id !== 'string' || typeof p.name !== 'string') {
      return false;
    }
  }

  // Validate constraints structure
  for (const constraint of state.constraints) {
    if (typeof constraint !== 'object' || constraint === null) {
      return false;
    }
    const c = constraint as Record<string, unknown>;
    if (typeof c.id !== 'string' || 
        typeof c.participant1Id !== 'string' || 
        typeof c.participant2Id !== 'string') {
      return false;
    }
  }

  // Validate assignments structure
  for (const assignment of state.assignments) {
    if (typeof assignment !== 'object' || assignment === null) {
      return false;
    }
    const a = assignment as Record<string, unknown>;
    if (typeof a.giverId !== 'string' || typeof a.receiverId !== 'string') {
      return false;
    }
  }

  return true;
}
