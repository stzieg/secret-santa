export interface Participant {
  id: string;
  name: string;
}

export interface RelationshipConstraint {
  id: string;
  participant1Id: string;
  participant2Id: string;
}

export interface Assignment {
  giverId: string;
  receiverId: string;
}

export interface AppState {
  participants: Participant[];
  constraints: RelationshipConstraint[];
  assignments: Assignment[];
  currentView: 'main' | 'reveal';
}
