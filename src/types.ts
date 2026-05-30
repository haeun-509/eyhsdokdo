/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocationDetail {
  latitude: string;
  longitude: string;
  areaTotal: string;
  areaEast: string;
  areaWest: string;
  subIslandsCount: number;
}

export interface DistanceInfo {
  from: string;
  to: string;
  distance: number; // km
  note?: string;
  vibe?: string;
}

export interface HistoricalDoc {
  id: string;
  title: string;
  year: string;
  country: 'KOREA' | 'JAPAN';
  book: string;
  originalText: string;
  translation: string;
  significance: string;
  imageUrl?: string;
}

export interface HistoricalMap {
  id: string;
  title: string;
  year: string;
  producer?: string;
  description: string;
  significance: string;
  country: 'KOREA' | 'JAPAN';
  colorNote?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  date?: string;
  title: string;
  description: string;
  category: 'POST_WAR' | 'DEFENSE' | 'CONFLICT' | 'AGREEMENT';
  badge: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  guideline?: string;
}
