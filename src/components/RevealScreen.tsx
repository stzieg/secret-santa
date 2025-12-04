import { useState, useEffect, useMemo, useRef } from 'react';
import type { Assignment, Participant } from '../types';
import { REVEAL_SCREEN_MEDIA } from '../config/revealScreenMedia';
import './RevealScreen.css';

/**
 * RevealScreen component displays assignments one at a time with timed reveals
 * Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

interface RevealScreenProps {
  assignments: Assignment[];
  participants: Participant[];
  onComplete: () => void;
  onExit: () => void;
}

type Phase = 'countdown' | 'showing' | 'complete';

export function RevealScreen({ assignments, participants, onComplete, onExit }: RevealScreenProps) {
  // Randomize the order of assignments once when component mounts
  const shuffledAssignments = useMemo(() => {
    const shuffled = [...assignments];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [assignments]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(10);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play background music when component mounts
  useEffect(() => {
    // Create audio element for background music using configured file
    const audioPath = `/media/${REVEAL_SCREEN_MEDIA.audio.filename}`;
    const audio = new Audio(audioPath);
    audio.loop = REVEAL_SCREEN_MEDIA.audio.loop;
    audio.volume = REVEAL_SCREEN_MEDIA.audio.volume;
    
    // Try to play (may be blocked by browser autoplay policy)
    audio.play().catch(error => {
      console.log('Audio autoplay was prevented:', error);
    });
    
    audioRef.current = audio;

    // Cleanup: stop music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Helper function to get participant name by ID
  const getParticipantName = (id: string): string => {
    const participant = participants.find(p => p.id === id);
    return participant?.name || 'Unknown';
  };

  // Get current assignment from shuffled list
  const currentAssignment = shuffledAssignments[currentIndex];
  const giverName = currentAssignment ? getParticipantName(currentAssignment.giverId) : '';
  const receiverName = currentAssignment ? getParticipantName(currentAssignment.receiverId) : '';

  // Requirement 9.3, 9.4: Countdown timer that transitions to showing phase
  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Transition to showing phase when countdown reaches 0
            setPhase('showing');
            return 10; // Reset for next assignment
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [phase, countdown]);

  // Requirement 9.5: Automatic advancement after 10 second display period
  useEffect(() => {
    if (phase === 'showing') {
      const timer = setTimeout(() => {
        // Requirement 9.7: Display assignments in sequence
        if (currentIndex < shuffledAssignments.length - 1) {
          // Move to next assignment
          setCurrentIndex(prev => prev + 1);
          setPhase('countdown');
        } else {
          // Show completion message
          setPhase('complete');
        }
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex, shuffledAssignments.length]);

  // Completion message stays visible until user clicks exit button
  // No auto-close timer - user must manually exit

  // Get background image path from config
  const backgroundImagePath = `/media/${REVEAL_SCREEN_MEDIA.background.filename}`;
  const backgroundOpacity = REVEAL_SCREEN_MEDIA.background.opacity;

  // Show completion message
  if (phase === 'complete') {
    return (
      <div className="reveal-screen">
        <div 
          className="reveal-background" 
          style={{ 
            backgroundImage: `url(${backgroundImagePath})`,
            opacity: backgroundOpacity 
          }}
        />
        <button 
          className="exit-reveal-btn"
          onClick={onExit}
          aria-label="Exit reveal screen"
        >
          ✕
        </button>
        <div className="reveal-content">
          <div className="completion-message">
            Merry Christmas!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reveal-screen">
      <div 
        className="reveal-background" 
        style={{ 
          backgroundImage: `url(${backgroundImagePath})`,
          opacity: backgroundOpacity 
        }}
      />
      <button 
        className="exit-reveal-btn"
        onClick={onExit}
        aria-label="Exit reveal screen"
      >
        ✕
      </button>
      <div className="reveal-content">
        {/* Requirement 9.2: Display giver name on the left side */}
        <div className="giver-name">
          {giverName}
        </div>
        
        {/* Requirement 9.3, 9.4: Display countdown timer or receiver name on the right side */}
        <div className="receiver-info">
          {phase === 'countdown' ? (
            <div className="countdown-timer">
              {countdown}
            </div>
          ) : (
            <div className="receiver-name">
              {receiverName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
