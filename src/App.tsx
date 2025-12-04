import { useState, useEffect } from 'react';
import type { Participant, RelationshipConstraint, Assignment } from './types';
import { loadState, saveState } from './utils/storage';
import { ParticipantInput } from './components/ParticipantInput';
import { ParticipantList } from './components/ParticipantList';
import { ConstraintInput } from './components/ConstraintInput';
import { ConstraintList } from './components/ConstraintList';
import { AssignmentGenerator } from './components/AssignmentGenerator';
import { AssignmentDisplay } from './components/AssignmentDisplay';
import { RevealScreen } from './components/RevealScreen';
import './App.css';

/**
 * Main App component with state management
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */
function App() {
  // State management for participants, constraints, and assignments
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [constraints, setConstraints] = useState<RelationshipConstraint[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentView, setCurrentView] = useState<'main' | 'reveal'>('main');
  const [storageWarning, setStorageWarning] = useState<string>('');
  const [showAssignments, setShowAssignments] = useState<boolean>(false);

  // Requirement 8.3: Load state from localStorage on mount
  useEffect(() => {
    const result = loadState();
    if (result.success && result.data) {
      setParticipants(result.data.participants);
      setConstraints(result.data.constraints);
      setAssignments(result.data.assignments);
      setCurrentView(result.data.currentView);
      
      // Show warning if there was an issue (corrupted data, etc.)
      if (result.error) {
        setStorageWarning(result.error);
      }
    }
  }, []); // Empty dependency array - only run on mount

  // Requirements 8.1, 8.2: Save state to localStorage whenever it changes
  useEffect(() => {
    const state = { participants, constraints, assignments, currentView };
    const result = saveState(state);
    
    if (!result.success && result.error) {
      setStorageWarning(result.error);
    }
  }, [participants, constraints, assignments, currentView]); // Run whenever state changes

  // Handler for adding a participant
  const handleAddParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name,
    };
    // Requirement 1.1, 1.4: Add participant and update list immediately
    setParticipants([...participants, newParticipant]);
  };

  // Handler for removing a participant
  const handleRemoveParticipant = (id: string) => {
    // Requirement 2.1: Remove participant from list
    setParticipants(participants.filter(p => p.id !== id));
    
    // Requirement 2.2: Remove all constraints associated with this participant
    setConstraints(constraints.filter(
      c => c.participant1Id !== id && c.participant2Id !== id
    ));
    
    // Clear assignments when participants change
    setAssignments([]);
  };

  // Handler for adding a constraint
  const handleAddConstraint = (participant1Id: string, participant2Id: string) => {
    const newConstraint: RelationshipConstraint = {
      id: crypto.randomUUID(),
      participant1Id,
      participant2Id,
    };
    // Requirement 3.1, 3.4: Add constraint and update list immediately
    setConstraints([...constraints, newConstraint]);
    
    // Clear assignments when constraints change
    setAssignments([]);
  };

  // Handler for removing a constraint
  const handleRemoveConstraint = (id: string) => {
    // Requirement 4.1, 4.2: Remove constraint and update list immediately
    setConstraints(constraints.filter(c => c.id !== id));
    
    // Clear assignments when constraints change
    setAssignments([]);
  };

  // Handler for generating assignments
  const handleGenerateAssignments = (newAssignments: Assignment[]) => {
    // Requirements 5.1-5.5, 7.1, 7.2: Set generated assignments
    setAssignments(newAssignments);
    // Requirement 9.1: Navigate to reveal view when assignments are generated
    setCurrentView('reveal');
  };

  // Handler for completing reveal sequence
  const handleRevealComplete = () => {
    // Requirement 9.6: Return to main view when all assignments revealed
    setCurrentView('main');
    // Hide assignments when exiting reveal screen
    setShowAssignments(false);
  };

  // Handler for exiting reveal screen
  const handleExitReveal = () => {
    setCurrentView('main');
    // Hide assignments when exiting reveal screen
    setShowAssignments(false);
  };

  // Requirement 9.1: Conditional rendering based on current view
  if (currentView === 'reveal') {
    return (
      <RevealScreen
        assignments={assignments}
        participants={participants}
        onComplete={handleRevealComplete}
        onExit={handleExitReveal}
      />
    );
  }

  return (
    <div className="app">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      <header role="banner">
        <h1>Secret Santa</h1>
      </header>

      {storageWarning && (
        <div className="storage-warning" role="alert" aria-live="polite">
          {storageWarning}
        </div>
      )}

      <main id="main-content" role="main">
        <section className="participants-section" aria-labelledby="participants-heading">
          <h2 id="participants-heading">Participants</h2>
          <ParticipantInput
            participants={participants}
            onAddParticipant={handleAddParticipant}
          />
          <ParticipantList
            participants={participants}
            onRemoveParticipant={handleRemoveParticipant}
          />
        </section>

        <section className="constraints-section" aria-labelledby="constraints-heading">
          <h2 id="constraints-heading">Relationship Constraints</h2>
          <p className="section-description">
            Prevent significant others from being matched
          </p>
          <ConstraintInput
            participants={participants}
            constraints={constraints}
            onAddConstraint={handleAddConstraint}
          />
          <ConstraintList
            constraints={constraints}
            participants={participants}
            onRemoveConstraint={handleRemoveConstraint}
          />
        </section>

        <section className="generator-section" aria-labelledby="generator-heading">
          <h2 id="generator-heading">Generate Matches</h2>
          <AssignmentGenerator
            participants={participants}
            constraints={constraints}
            onGenerateAssignments={handleGenerateAssignments}
          />
          
          {assignments.length > 0 && (
            <div className="assignments-toggle">
              <button
                onClick={() => setShowAssignments(!showAssignments)}
                className="toggle-assignments-btn"
                aria-expanded={showAssignments}
              >
                {showAssignments ? '🙈 Hide Matches' : '👁️ Show Matches'}
              </button>
            </div>
          )}
        </section>

        {showAssignments && assignments.length > 0 && (
          <section className="assignments-section" aria-labelledby="assignments-heading">
            <h2 id="assignments-heading" className="sr-only">Secret Santa Matches</h2>
            <AssignmentDisplay
              assignments={assignments}
              participants={participants}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
