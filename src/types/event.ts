export interface Event {
  id: string;
  titre: string;
  lieu: string;
  sport: string;
  niveau: string;
  description: string;
  participantsList: string[];
  required_participants: number;
  creatorId: string;
  createdAt: string;
}
