/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Formula, SUBJECT_LIST } from "../data";
import { UserStudyState, MemorizationLevel } from "../utils/studyEngine";
import { MathRenderer, MathTextParser } from "./MathRenderer";
import { motion, AnimatePresence } from "motion/react";
import { Check, RotateCw, Star, ArrowLeft, ArrowRight, Award, HelpCircle, BookOpen } from "lucide-react";

interface FlashcardModeProps {
  formulas: Formula[];
  studyState: UserStudyState;
  onUpdateProgress: (id: string, level: MemorizationLevel) => void;
  onToggleBookmark: (id: string) => void;
}

export function FlashcardMode({
  formulas,
  studyState,
  onUpdateProgress,
  onToggleBookmark,
}: FlashcardModeProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("전체");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // 과목 필터링
  const filteredFormulas = selectedSubject === "전체"
    ? formulas
    : formulas.filter((f) => f.subject === selectedSubject);

  // 안전 장치
  const currentFormula = filteredFormulas[currentIndex];

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentIndex < filteredFormulas.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFeedback = (level: MemorizationLevel) => {
    if (!currentFormula) return;
    onUpdateProgress(currentFormula.id, level);
    setIsFlipped(false);
    setTimeout(() => {
      nextCard();
    }, 200);
  };

  if (filteredFormulas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-black border-2 border-white rounded-md">
        <HelpCircle className="h-16 w-16 text-white/50 mb-4" />
        <p className="text-xl font-black text-white uppercase tracking-tight">등록된 공식이 존재하지 않습니다.</p>
        <p className="text-xs text-white/40 mt-1 font-mono">상단 과목 필터를 변경해 다른 영역을 조회해 주세요.</p>
        <button
          onClick={() => handleSubjectChange("전체")}
          className="mt-6 bg-[#00FF41] text-black font-black text-xs uppercase tracking-widest px-6 py-3 border-2 border-black rounded-md hover:bg-[#00FF41]/85 transition-all cursor-pointer"
        >
          전체 과목 보기
        </button>
      </div>
    );
  }

  const isBookmarked = studyState.progress[currentFormula?.id]?.bookmarked || false;
  const currentLevel = studyState.progress[currentFormula?.id]?.level || "none";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 과목 필터 바 - 모던 모노 볼드 스타일 */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">교과 영역 필터</label>
        <div className="flex flex-wrap gap-2 pb-1 scrollbar-thin">
          <button
            onClick={() => handleSubjectChange("전체")}
            className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
              selectedSubject === "전체"
                ? "bg-[#00FF41] border-[#00FF41] text-black"
                : "bg-black border-white/20 text-white/70 hover:border-white hover:text-white"
            }`}
          >
            전체 [{formulas.length}]
          </button>
          {SUBJECT_LIST.map((subj) => {
            const count = formulas.filter((f) => f.subject === subj).length;
            return (
              <button
                key={subj}
                onClick={() => handleSubjectChange(subj)}
                className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-2 ${
                  selectedSubject === subj
                    ? "bg-[#00FF41] border-[#00FF41] text-black"
                    : "bg-black border-white/10 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {subj} [{count}]
              </button>
            );
          })}
        </div>
      </div>

      {/* 학습 가이드라인 및 진행 바 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase tracking-widest font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00FF41] animate-ping" />
            <span>학습 대상 영역 : <strong className="text-white italic">{selectedSubject}</strong></span>
          </div>
          <div>
            <b className="text-white text-sm font-black">{currentIndex + 1}</b> / <span className="text-white/30">{filteredFormulas.length}개 카드</span>
          </div>
        </div>

        <div className="w-full bg-white/10 h-2 rounded-md overflow-hidden border border-white/5">
          <div
            className="bg-[#00FF41] h-full transition-all duration-300 shadow-[0_0_8px_#00FF41]"
            style={{ width: `${((currentIndex + 1) / filteredFormulas.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D 플립 카드 컨테이너 */}
      <div className="perspective-1000 w-full min-h-[420px] md:min-h-[460px] cursor-pointer">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-full min-h-[420px] md:min-h-[460px] transition-all duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* ================= 카드 앞면 (질문/힌트) ================= */}
          <div className="absolute inset-0 w-full h-full p-8 md:p-10 rounded-md bg-black border-2 border-white backface-hidden flex flex-col justify-between hover:border-[#00FF41] transition-all select-none">
            {/* 상단 메타부 */}
            <div className="flex items-center justify-between">
              <span className="inline-flex gap-2 items-center bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-black uppercase font-mono tracking-wider text-white/60">
                {currentFormula.subject} &middot; {currentFormula.chapter}
              </span>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-md ${
                  currentFormula.importance === "상" ? "bg-rose-500 text-white" :
                  currentFormula.importance === "중" ? "bg-amber-500 text-black" :
                  "bg-white/10 text-white/50"
                }`}>
                  중요도 {currentFormula.importance}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 플립 방지
                    onToggleBookmark(currentFormula.id);
                  }}
                  className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <Star
                    className={`h-4.5 w-4.5 ${
                      isBookmarked ? "text-[#00FF41] fill-[#00FF41]" : "text-white/30"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 본문 (중간 맞춤) */}
            <div className="my-auto text-center space-y-5 py-6">
              <p className="text-[10px] font-black tracking-[0.3em] text-[#00FF41] uppercase font-mono">Memory Formula Card</p>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase font-sans">
                {currentFormula.formula_name}
              </h3>
              <div className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed antialiased font-medium">
                <MathTextParser text={currentFormula.description} />
              </div>
            </div>

            {/* 하단 힌트 제안 및 뒤집기 버튼 */}
            <div className="flex justify-between items-center bg-white/5 rounded-md p-4 border border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/50 font-mono">
                <span className="font-black text-[#00FF41] tracking-wider">💡 힌트</span>
                <span className="truncate max-w-[200px] sm:max-w-md">{currentFormula.solution_guide?.slice(0, 40)}...</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-[#00FF41] font-mono tracking-wider">
                <RotateCw className="h-3.5 w-3.5 text-[#00FF41]" />
                카드 뒤집기
              </div>
            </div>
          </div>

          {/* ================= 카드 뒷면 (정답/LaTeX 수식) ================= */}
          <div className="absolute inset-0 w-full h-full p-8 md:p-10 rounded-md bg-black border-2 border-white rotate-y-180 backface-hidden flex flex-col justify-between select-none">
            {/* 상단 메타부 */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#00FF41] uppercase tracking-widest font-mono">공식 확인 완료</span>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#00FF41]/10 border border-[#00FF41]/20 px-2 py-1 text-[9px] font-mono font-black text-[#00FF41] uppercase tracking-wider">
                  암기 상태: {
                    currentLevel === "easy" ? "쉬움" :
                    currentLevel === "medium" ? "보통" :
                    currentLevel === "hard" ? "어려움" : "미지정"
                  }
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(currentFormula.id);
                  }}
                  className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <Star
                    className={`h-4.5 w-4.5 ${
                      isBookmarked ? "text-[#00FF41] fill-[#00FF41]" : "text-white/30"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 공식 수식 렌더링 영역 (메인!) */}
            <div className="my-auto py-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-full overflow-x-auto text-center py-6 px-4 rounded-md bg-neutral-900 border-2 border-white max-h-[180px] flex items-center justify-center">
                <div className="text-white scale-105 md:scale-110">
                  <MathRenderer math={currentFormula.formula_latex} block={true} />
                </div>
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] font-mono">공식 수식 레이아웃</p>
            </div>

            {/* 교사의 자학자습 및 핵심 유도 어드바이스 */}
            <div className="space-y-2 bg-white/5 rounded-md p-4 border border-white/10 text-sm text-white/80 leading-relaxed text-left font-mono">
              {currentFormula.curriculum_note && (
                <p>
                  <strong className="text-[#00FF41] font-bold">📍 Curriculum Note:</strong> {currentFormula.curriculum_note}
                </p>
              )}
              {currentFormula.solution_guide && (
                <p className="mt-1 border-t border-white/5 pt-2">
                  <strong className="text-[#00FF41] font-bold">💡 Solution Advice:</strong> <MathTextParser text={currentFormula.solution_guide} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 암기 피드백 액션 및 네비게이션 버튼 (인쇄/화면 상 고정) */}
      <div className="flex flex-col gap-6">
        {isFlipped && (
          <div className="flex flex-col gap-4 bg-[#121212] p-6 rounded-md border-2 border-white">
            <span className="text-[10px] font-black text-[#00FF41] text-center uppercase tracking-[0.3em] font-mono block">암기 여부 점검: 아래 평가를 선택해 주세요</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleFeedback("hard")}
                className="py-5 bg-[#FF3B30] text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-all rounded-md border-2 border-black cursor-pointer shadow-sm active:scale-95"
              >
                어려움 (망각)
              </button>
              <button
                onClick={() => handleFeedback("medium")}
                className="py-5 border border-white/30 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-md cursor-pointer shadow-sm active:scale-95 bg-black"
              >
                보통 (기억)
              </button>
              <button
                onClick={() => handleFeedback("easy")}
                className="py-5 border-2 border-[#00FF41] text-[#00FF41] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#00FF41] hover:text-black transition-all rounded-md bg-black cursor-pointer shadow-sm active:scale-95"
              >
                쉬움 (마스터)
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-2 ${
              currentIndex === 0
                ? "text-white/20 border-white/10 bg-transparent cursor-not-allowed"
                : "text-white border-white bg-black hover:bg-white/10"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            이전 카드
          </button>

          {!isFlipped && (
            <button
              onClick={() => setIsFlipped(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-md text-xs font-black uppercase tracking-[0.2em] bg-[#00FF41] hover:bg-[#00FF41]/85 text-black border-2 border-black active:scale-95 transition-all cursor-pointer"
            >
              공식 보기
            </button>
          )}

          <button
            onClick={nextCard}
            disabled={currentIndex === filteredFormulas.length - 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-2 ${
              currentIndex === filteredFormulas.length - 1
                ? "text-white/20 border-white/10 bg-transparent cursor-not-allowed"
                : "text-white border-white bg-black hover:bg-white/10"
            }`}
          >
            다음 카드
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
