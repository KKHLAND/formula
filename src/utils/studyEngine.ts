/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MemorizationLevel = "easy" | "medium" | "hard" | "none";

export interface FormulaProgress {
  formulaId: string;
  level: MemorizationLevel;
  bookmarked: boolean;
  lastStudiedAt?: string; // ISO String
  nextReviewAt?: string; // ISO String
  incorrectCount: number;
}

export interface QuizHistory {
  date: string;
  totalQuestions: number;
  correctCount: number;
}

export interface UserStudyState {
  progress: { [formulaId: string]: FormulaProgress };
  quizHistory: QuizHistory[];
}

const STORAGE_KEY = "MATH_MASTER_STUDY_STATE_2022";

export function loadStudyState(): UserStudyState {
  if (typeof window === "undefined") {
    return { progress: {}, quizHistory: [] };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Localstorage load error:", err);
  }
  return { progress: {}, quizHistory: [] };
}

export function saveStudyState(state: UserStudyState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Localstorage save error:", err);
  }
}

/**
 * 에빙하우스 망각 곡선에 기반한 가상 복습 주기 계산 함수 (Spaced Repetition System)
 * - none: 지금 학습 필요
 * - hard (어려움): 1시간 뒤 (실무 기준 1일 뒤)
 * - medium (보통): 3일 뒤
 * - easy (쉬움): 7일 뒤
 */
export function calculateNextReview(level: MemorizationLevel): string {
  const now = new Date();
  let daysToAdd = 0;

  switch (level) {
    case "easy":
      daysToAdd = 7;
      break;
    case "medium":
      daysToAdd = 3;
      break;
    case "hard":
      daysToAdd = 1;
      break;
    default:
      daysToAdd = 0;
  }

  const future = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return future.toISOString();
}

/**
 * 학습 진도 상태를 업데이트합니다.
 */
export function updateProgress(
  state: UserStudyState,
  formulaId: string,
  level: MemorizationLevel,
  bookmarkedOption?: boolean
): UserStudyState {
  const current = { ...state.progress };
  const prev = current[formulaId] || {
    formulaId,
    level: "none",
    bookmarked: false,
    incorrectCount: 0,
  };

  const updatedLevel = level;
  const updatedBookmarked = bookmarkedOption !== undefined ? bookmarkedOption : prev.bookmarked;

  let nextReviewAt = prev.nextReviewAt;
  if (level !== prev.level && level !== "none") {
    nextReviewAt = calculateNextReview(level);
  }

  current[formulaId] = {
    ...prev,
    level: updatedLevel,
    bookmarked: updatedBookmarked,
    lastStudiedAt: level !== "none" ? new Date().toISOString() : prev.lastStudiedAt,
    nextReviewAt,
  };

  const newState = { ...state, progress: current };
  saveStudyState(newState);
  return newState;
}

/**
 * 즐겨찾기(북마크)만 원터치 토글합니다.
 */
export function toggleBookmark(state: UserStudyState, formulaId: string): UserStudyState {
  const current = { ...state.progress };
  const prev = current[formulaId] || {
    formulaId,
    level: "none",
    bookmarked: false,
    incorrectCount: 0,
  };

  current[formulaId] = {
    ...prev,
    bookmarked: !prev.bookmarked,
  };

  const newState = { ...state, progress: current };
  saveStudyState(newState);
  return newState;
}

/**
 * 퀴즈 오답 발생 시, 인코렉트 횟수를 올립니다.
 */
export function recordIncorrect(state: UserStudyState, formulaId: string): UserStudyState {
  const current = { ...state.progress };
  const prev = current[formulaId] || {
    formulaId,
    level: "none",
    bookmarked: false,
    incorrectCount: 0,
  };

  current[formulaId] = {
    ...prev,
    incorrectCount: prev.incorrectCount + 1,
    // 오답 시 암기 수준이 '어려움'으로 피드백 유기
    level: "hard",
    nextReviewAt: calculateNextReview("hard"),
  };

  const newState = { ...state, progress: current };
  saveStudyState(newState);
  return newState;
}
