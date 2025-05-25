export type SportLevel = 'débutant' | 'intermédiaire' | 'avancé' | 'expert';

export interface Sport {
  name: string;
  level: SportLevel;
}

export interface UserProfile {
  displayName: string;
  email: string;
  sports: Sport[];
} 