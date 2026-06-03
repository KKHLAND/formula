/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Formula, SUBJECT_LIST } from "../data";
import { UserStudyState } from "../utils/studyEngine";
import { MathRenderer } from "./MathRenderer";
import { Award, CheckCircle2, XCircle, RotateCcw, AlertCircle, HelpCircle } from "lucide-react";

interface QuizModeProps {
  formulas: Formula[];
  studyState: UserStudyState;
  onRecordCorrect: (id: string) => void;
  onRecordIncorrect: (id: string) => void;
}

interface Question {
  formula: Formula;
  options: Formula[];
  isCorrect: boolean | null;
  selectedId: string | null;
}

export function QuizMode({
  formulas,
  studyState,
  onRecordCorrect,
  onRecordIncorrect,
}: QuizModeProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("전체");
  const [quizSize, setQuizSize] = useState<number>(5);
  const [gameState, setGameState] = useState<"setup" | "playing" | "ended">("setup");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);

  // 퀴즈 데이터셋 생성
  const buildQuiz = () => {
    // 과목 필터링
    const candidates = selectedSubject === "전체"
      ? formulas
      : formulas.filter((f) => f.subject === selectedSubject);

    if (candidates.length < 4) {
      alert("공식을 선택한 과목이 최소 4개 이상이어야 4지선다형 퀴즈가 구축될 수 있습니다. 다른 과목을 정해주세요!");
      return;
    }

    // 대상 섞기
    const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random());
    const selectedFormulas = shuffledCandidates.slice(0, Math.min(quizSize, shuffledCandidates.length));

    // 각 질문별 오답 보기 매칭 (나머지 공식 데이터 중 랜덤 3개 선정)
    const generatedQuestions = selectedFormulas.map((target) => {
      const rest = formulas.filter((f) => f.id !== target.id);
      const shuffledRest = [...rest].sort(() => 0.5 - Math.random());
      const wrongOptions = shuffledRest.slice(0, 3);
      
      // 정답과 오답을 합쳐서 4지선다형 보기 구성
      const finalOptions = [target, ...wrongOptions].sort(() => 0.5 - Math.random());

      return {
        formula: target,
        options: finalOptions,
        isCorrect: null,
        selectedId: null,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState("playing");
  };

  const handleAnswerSubmit = (optionId: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (currentQ.selectedId !== null) return; // 이미 답을 골랐음

    const isCorrect = optionId === currentQ.formula.id;
    
    // 상태 동기화
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentQuestionIndex] = {
        ...currentQ,
        selectedId: optionId,
        isCorrect,
      };
      return copy;
    });

    if (isCorrect) {
      setScore((s) => s + 1);
      onRecordCorrect(currentQ.formula.id);
    } else {
      onRecordIncorrect(currentQ.formula.id);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((idx) => idx + 1);
    } else {
      setGameState("ended");
    }
  };

  if (gameState === "setup") {
    // 과목별 문항 보유량 계산
    return (
      <div className="max-w-xl mx-auto rounded-md border-2 border-white bg-black p-8 md:p-10 text-white space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex rounded-md bg-[#00FF41]/10 border-2 border-[#00FF41] p-4 text-[#00FF41] mb-2">
            <Award className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase font-sans">2022 개정 교과 공식 정밀 진단 퀴즈</h3>
          <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto font-mono">
            정의와 설명을 기반으로 알맞은 수식 기호를 4지선다형 중에서 찾아내십시오. 틀린 문제들은 자동으로 오답노트에 담깁니다.
          </p>
        </div>

        <div className="space-y-4">
          {/* 과목 범위 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.25em] font-mono block">중점 진단 과목 범위</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-md border-2 border-white/20 bg-neutral-900 px-3 py-3 text-xs font-mono font-black text-white focus:border-[#00FF41] focus:bg-black focus:outline-hidden transition-all"
            >
              <option value="전체">종합 진단 COMPREHENSIVE (전체 교과 공식)</option>
              {SUBJECT_LIST.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* 문항 수 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.25em] font-mono block">평가 문항 배율</label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map((size) => (
                <button
                  key={size}
                  onClick={() => setQuizSize(size)}
                  className={`py-3 text-xs font-black uppercase tracking-wider rounded-md border-2 transition-all cursor-pointer ${
                    quizSize === size
                      ? "bg-[#00FF41] border-[#00FF41] text-black"
                      : "bg-black border-white/20 text-white/70 hover:border-white"
                  }`}
                >
                  {size}문항
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={buildQuiz}
          className="w-full rounded-md bg-[#00FF41] hover:bg-[#00FF41]/85 text-black border-2 border-black py-4 text-xs font-black uppercase tracking-[0.2em] active:scale-95 transition-all cursor-pointer mt-6"
        >
          진단 시작
        </button>
      </div>
    );
  }

  if (gameState === "ended") {
    const successRate = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto rounded-md border-2 border-white bg-black p-8 md:p-10 text-white text-center space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black tracking-widest text-[#00FF41] uppercase font-mono">종합 진단 완료</p>
          <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">전 기량 성적표 통계</h3>
        </div>

        {/* 원형 점수 디스플레이 */}
        <div className="relative inline-flex items-center justify-center p-8 bg-[#00FF41]/5 rounded-full border-4 border-[#00FF41]">
          <div className="space-y-1">
            <span className="text-5xl font-black text-[#00FF41] tracking-tighter">{successRate}%</span>
            <p className="text-[10px] text-white/50 font-black font-mono tracking-widest uppercase">{score} / {questions.length} 정답</p>
          </div>
        </div>

        {/* 멘토 서평 */}
        <div className="p-5 rounded-md bg-neutral-900 border border-white/10 text-sm text-white/80 leading-relaxed max-w-sm mx-auto text-left font-sans">
          {successRate === 100
            ? "👑 대단합니다! 완벽합니다. 2022 개정 교육과정 기준 출제 공식을 완벽히 뇌에 각인 시켰습니다. 수능 상위 1등급의 실력입니다."
            : successRate >= 70
            ? "👍 좋은 흐름입니다! 대부분의 주요 고교 핵심 공식의 대수 기하 구조를 정량화해 이해하고 있습니다. 오답노트를 통해 빈틈을 마저 채우세요."
            : "✍ 복습 보강이 요구됩니다. 헷갈렸던 공식을 플래시 카드 암기 방식으로 3D 연단하고 다시 평가에 참여하세요. 복구할 수 있습니다!"}
        </div>

        {/* 오답 단원 명세 */}
        <div className="space-y-2 text-left font-mono">
          <h4 className="text-[10px] font-black text-[#00FF41] uppercase tracking-widest">취약 오답 공식 명세</h4>
          <div className="max-h-[140px] overflow-y-auto divide-y divide-white/10 border border-white/10 rounded-md p-3 bg-neutral-950 scrollbar-thin">
            {questions.filter(q => !q.isCorrect).length > 0 ? (
              questions.filter(q => !q.isCorrect).map((q, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-sm text-white/80">
                  <div className="font-bold text-[#FF3B30]">{q.formula.formula_name}</div>
                  <div className="text-xs text-white/40">{q.formula.subject} · {q.formula.chapter}</div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-[#00FF41] font-black uppercase tracking-wider">오답 없음. 완벽합니다!</div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2 font-mono">
          <button
            onClick={() => setGameState("setup")}
            className="flex-1 rounded-md bg-black border-2 border-white/20 text-white font-black py-3.5 text-xs uppercase tracking-widest hover:border-white transition-all cursor-pointer"
          >
            처음으로
          </button>
          <button
            onClick={buildQuiz}
            className="flex-1 rounded-md bg-[#00FF41] hover:bg-[#00FF41]/85 border-2 border-black text-black font-black py-3.5 text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            재시도
          </button>
        </div>
      </div>
    );
  }

  // 플레이 중 영역
  const currentQ = questions[currentQuestionIndex];
  const hasAnswered = currentQ.selectedId !== null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 퀴즈 진행도 및 점수 */}
      <div className="flex items-center justify-between text-[11px] font-bold text-white/50 uppercase tracking-widest font-mono">
        <span>현재 문항 : {currentQuestionIndex + 1} / {questions.length}</span>
        <span className="rounded-md bg-[#00FF41]/10 border border-[#00FF41]/20 px-2.5 py-1 text-[#00FF41] font-black">정답수 : {score}개</span>
      </div>

      <div className="w-full bg-white/10 h-2 rounded-md overflow-hidden border border-white/5">
        <div
          className="bg-[#00FF41] h-full transition-all duration-300 shadow-[0_0_8px_#00FF41]"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 문제 카드 */}
      <div className="rounded-md border-2 border-white bg-black p-6 md:p-8 space-y-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
          <span className="bg-white/10 border border-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-wider">
            {currentQ.formula.subject} &middot; {currentQ.formula.chapter}
          </span>
          <span className="text-sm font-black text-[#00FF41]">Q.0{currentQuestionIndex + 1}</span>
        </div>

        {/* 핵심 질문 정의 */}
        <div className="space-y-3 py-2">
          <p className="text-[10px] font-black text-white/40 tracking-[0.2em] font-mono uppercase">아래 설명에 맞는 공식을 선택하세요</p>
          <h4 className="text-xl md:text-2xl font-black text-white leading-snug uppercase">{currentQ.formula.formula_name}</h4>
          <p className="text-sm text-white/70 bg-neutral-950 p-4 border border-white/10 rounded-md italic leading-relaxed font-sans">
            {currentQ.formula.description}
          </p>
        </div>

        {/* 4지선다 보기 리스트 */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = currentQ.selectedId === option.id;
            const isCorrectOption = option.id === currentQ.formula.id;
            
            let btnClass = "bg-neutral-900 border-2 border-white/10 hover:border-white/50 hover:bg-neutral-800 text-white";
            let stateIcon = null;

            if (hasAnswered) {
              if (isCorrectOption) {
                // 무조건 정답은 초록색 처리
                btnClass = "bg-[#00FF41] border-[#00FF41] text-black font-black";
                stateIcon = <CheckCircle2 className="h-5 w-5 text-black flex-shrink-0" />;
              } else if (isSelected) {
                // 오답을 본인이 고른 경우만 빨간색 처리
                btnClass = "bg-[#FF3B30] border-[#FF3B30] text-white font-black";
                stateIcon = <XCircle className="h-5 w-5 text-white flex-shrink-0" />;
              } else {
                btnClass = "bg-neutral-950 border-white/5 text-white/30 opacity-40";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSubmit(option.id)}
                disabled={hasAnswered}
                className={`flex items-center justify-between p-4 md:p-5 rounded-md border text-left text-sm transition-all ${
                  !hasAnswered ? "active:scale-[0.99] cursor-pointer" : ""
                } ${btnClass}`}
              >
                <div className="flex items-center gap-4 w-full pr-2">
                  <span className={`text-[9px] font-mono font-black uppercase tracking-wider flex-shrink-0 ${hasAnswered && isCorrectOption ? "text-black/60" : "text-white/40"}`}>
                    보기 0{idx + 1}
                  </span>
                  <div className="overflow-x-auto w-full scrollbar-none py-1">
                    {/* LaTeX 수식 인라인으로 렌더링 */}
                    <div className={`scale-95 md:scale-100 origin-left ${hasAnswered && isCorrectOption ? "text-black" : "text-white"}`}>
                      <MathRenderer math={option.formula_latex} />
                    </div>
                  </div>
                </div>
                {stateIcon}
              </button>
            );
          })}
        </div>

        {/* 오답/정답 멘토링 피드백 */}
        {hasAnswered && (
          <div className={`p-5 rounded-md text-sm space-y-1.5 font-mono ${
            currentQ.isCorrect ? "bg-[#00FF41]/10 text-[#00FF41] border-2 border-[#00FF41]/20" : "bg-[#FF3B30]/10 text-rose-550 border-2 border-[#FF3B30]/20"
          }`}>
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-xs">
              {currentQ.isCorrect ? <span>🎉 정답입니다!</span> : <span>😢 오답입니다!</span>}
            </div>
            {!currentQ.isCorrect && (
              <p className="text-xs leading-relaxed text-white/80">
                올바른 공식 수식 : <code className="bg-black/40 border border-white/10 px-1.5 py-0.5 text-white font-mono">{currentQ.formula.formula_latex}</code>
              </p>
            )}
            {currentQ.formula.solution_guide && (
              <p className="text-xs font-sans pt-2 mt-2 border-t border-dashed border-white/10 text-white/75 leading-relaxed">
                <strong>출제 힌트/팁:</strong> {currentQ.formula.solution_guide}
              </p>
            )}
          </div>
        )}

        {/* 하단 다음 버튼 */}
        {hasAnswered && (
          <button
            onClick={handleNext}
            className="w-full rounded-md bg-white hover:bg-[#00FF41] text-black font-black py-4 text-xs uppercase tracking-[0.2em] transition-all cursor-pointer"
          >
            {currentQuestionIndex === questions.length - 1 ? "성적 확인" : "다음 문항"}
          </button>
        )}
      </div>
    </div>
  );
}
