/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formula, SUBJECT_LIST } from "../data";
import { UserStudyState, MemorizationLevel } from "../utils/studyEngine";
import { BookOpen, Star, AlertTriangle, CheckCircle, GraduationCap, Flame, ArrowRight, Notebook } from "lucide-react";

interface DashboardProps {
  formulas: Formula[];
  studyState: UserStudyState;
  onNavigate: (tab: string, filterSubject?: string) => void;
}

export function Dashboard({ formulas, studyState, onNavigate }: DashboardProps) {
  // 진척도 통계 산출
  const totalCount = formulas.length;
  const progressMap = studyState.progress;

  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  let bookmarkedCount = 0;

  formulas.forEach((f) => {
    const prog = progressMap[f.id];
    if (prog) {
      if (prog.level === "easy") easyCount++;
      else if (prog.level === "medium") mediumCount++;
      else if (prog.level === "hard") hardCount++;

      if (prog.bookmarked) bookmarkedCount++;
    }
  });

  const unlearnedCount = totalCount - (easyCount + mediumCount + hardCount);
  const memorizedPercent = Math.round(((easyCount + mediumCount) / (totalCount || 1)) * 100);

  // 과목별 통계
  const subjectStats = SUBJECT_LIST.map((subj) => {
    const subjFormulas = formulas.filter((f) => f.subject === subj);
    const sTotal = subjFormulas.length;
    let sEasy = 0;
    
    subjFormulas.forEach((f) => {
      const p = progressMap[f.id];
      if (p && (p.level === "easy" || p.level === "medium")) {
        sEasy++;
      }
    });

    const sPercent = Math.round((sEasy / (sTotal || 1)) * 100);
    return {
      name: subj,
      total: sTotal,
      memorized: sEasy,
      percent: sPercent,
    };
  });

  // 오늘 복습해야 하는 공식 수 계산
  const now = new Date();
  const reviewQueue = formulas.filter((f) => {
    const p = progressMap[f.id];
    if (!p) return false;
    if (p.level === "none") return false;
    if (p.nextReviewAt) {
      return new Date(p.nextReviewAt) <= now;
    }
    return false;
  });

  // 오답 횟수가 있는 취약 리스트
  const weakFormulas = formulas
    .filter((f) => {
      const p = progressMap[f.id];
      return p && p.incorrectCount > 0;
    })
    .sort((a, b) => {
      const pA = progressMap[a.id]?.incorrectCount || 0;
      const pB = progressMap[b.id]?.incorrectCount || 0;
      return pB - pA;
    })
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 교사용 환영 배너 - 다크 테마 볼드 리빌딩 */}
      <div className="relative overflow-hidden rounded-md border-2 border-white bg-black p-6 md:p-10 text-white">
        {/* 장형 리딩 수식 워터마크 백그라운드 연출 */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
          <h2 className="text-[12rem] font-black leading-none -mt-4 tracking-tighter text-white">∑∫√</h2>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-[#00FF41] text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md">
            2022 개정 개정 교육과정 세부반영
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.95] text-white">
            수학 공식 암기 마스터<br />
            <span className="text-[#00FF41] font-roman text-[21px] md:text-[34px] font-black italic block mt-2 tracking-wide">FORMULA SYSTEM 2022</span>
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-mono antialiased text-justify break-keep">
            에빙하우스 망각 곡선 기반 3D 암기 카드로 취약점을 과학적으로 진단하고, 22개정 행렬 추가 등 학교 현장에 즉각 투입 가능한 수업/학생 배포용 PDF 공식집을 인쇄하세요.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
               onClick={() => onNavigate("flashcard")}
               className="inline-flex items-center gap-2 bg-[#00FF41] hover:bg-[#00FF41]/85 text-black font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-black rounded-md active:scale-95 transition-all cursor-pointer"
             >
              <Flame className="h-4 w-4" />
              암기 카드 시작
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("print")}
              className="inline-flex items-center gap-2 bg-transparent text-white hover:bg-white/10 font-bold text-xs uppercase tracking-widest px-5 py-3 border border-white/20 rounded-md active:scale-95 transition-all cursor-pointer"
            >
              요약집 / 시험지 인쇄
            </button>
          </div>
        </div>
      </div>

      {/* 학습 진도 상황판 - 네온 글래스 모던 보더 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-md border-2 border-white bg-black p-5 flex items-center gap-4">
          <div className="rounded-md bg-[#00FF41]/10 p-2.5 text-[#00FF41] border border-[#00FF41]/30">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 font-black uppercase tracking-wider font-mono">암기 완료</p>
            <p className="text-xl md:text-2xl font-black text-white tracking-tight">{easyCount} <span className="text-xs text-white/40">공식</span></p>
          </div>
        </div>

        <div className="rounded-md border-2 border-white bg-black p-5 flex items-center gap-4">
          <div className="rounded-md bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 font-black uppercase tracking-wider font-mono">어려움 보통</p>
            <p className="text-xl md:text-2xl font-black text-white tracking-tight">{mediumCount} <span className="text-xs text-white/40">공식</span></p>
          </div>
        </div>

        <div className="rounded-md border-2 border-white bg-black p-5 flex items-center gap-4">
          <div className="rounded-md bg-rose-500/10 p-2.5 text-rose-500 border border-rose-500/30">
            <Notebook className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 font-black uppercase tracking-wider font-mono">미학습 / 취약</p>
            <p className="text-xl md:text-2xl font-black text-white tracking-tight">{hardCount + unlearnedCount} <span className="text-xs text-white/40">공식</span></p>
          </div>
        </div>

        <div className="rounded-md border-2 border-white bg-black p-5 flex items-center gap-4">
          <div className="rounded-md bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/30">
            <Star className="h-6 w-6 fill-indigo-400/10" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 font-black uppercase tracking-wider font-mono">북마크 수</p>
            <p className="text-xl md:text-2xl font-black text-white tracking-tight">{bookmarkedCount} <span className="text-xs text-white/40">공식</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 과목별 성취도 */}
        <div className="lg:col-span-2 rounded-md border-2 border-white bg-[#121212] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#00FF41]" />
              2022 개정 교과 목표 달성도
            </h3>
            <span className="text-[10px] font-black font-mono text-black bg-[#00FF41] px-2.5 py-1 rounded-md uppercase tracking-widest leading-none">
              평균 암기 완수율 {memorizedPercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectStats.map((stat) => (
              <div
                key={stat.name}
                onClick={() => onNavigate("explorer", stat.name)}
                className="group p-4 bg-black border border-white/10 hover:border-white transition-all cursor-pointer rounded-md"
              >
                <div className="flex items-center justify-between text-sm mb-3 font-mono">
                  <span className="font-bold text-white group-hover:text-[#00FF41]">{stat.name}</span>
                  <span className="text-white/40 group-hover:text-white">
                    <strong className="text-white font-black">{stat.memorized}</strong> / {stat.total} 완료
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#00FF41] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오답노트 & 챌린지 큐 */}
        <div className="space-y-6">
          {/* 복습 큐 알림 - 형광 레드 경고 보더 */}
          <div className="rounded-md border-2 border-[#FF3B30] bg-black p-5 space-y-4 w-full">
            <h4 className="text-[10px] font-black text-[#FF3B30] uppercase tracking-[0.2em] font-mono flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FF3B30] animate-ping" />
              에빙하우스 망각 복습 알림
            </h4>
            {reviewQueue.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-white/80 leading-relaxed font-mono">
                  에빙하우스 망각 곡선 복습 알림: 장기 기억 각인이 시급한 취약 공식 <strong className="text-[#FF3B30] font-black">{reviewQueue.length}개</strong>가 감지되었습니다.
                </p>
                <button
                  onClick={() => onNavigate("flashcard")}
                  className="w-full bg-[#FF3B30] hover:bg-rose-500 text-white py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-md"
                >
                  기억 복원 시작
                </button>
              </div>
            ) : (
              <p className="text-sm text-white/50 leading-relaxed font-mono">
                완벽한 지필! 현재 장기 전이 상태 최상입니다. 망각 주기의 공식이 존재하지 않습니다.
              </p>
            )}
          </div>

          {/* 나의 최저 오답 공식 */}
          <div className="rounded-md border-2 border-white bg-black p-5 space-y-4">
            <h4 className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.2em] font-mono flex items-center gap-2">
              <span>⚠</span> 우선 처방 취약 공식
            </h4>
            {weakFormulas.length > 0 ? (
              <div className="space-y-2">
                {weakFormulas.map((f) => {
                  const wrongCount = progressMap[f.id]?.incorrectCount || 0;
                  return (
                    <div
                      key={f.id}
                      onClick={() => onNavigate("notebook")}
                      className="flex items-center justify-between p-3 border border-white/5 bg-[#161616] hover:bg-[#202020] hover:border-white/30 transition-all cursor-pointer text-sm rounded-md"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white tracking-tight">{f.formula_name}</p>
                        <p className="text-xs text-white/40 font-mono">
                          {f.subject} · {f.chapter}
                        </p>
                      </div>
                      <span className="rounded-md bg-[#FF3B30] px-2 py-1 text-[9px] font-black text-white font-mono">
                        ERR x{wrongCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-white/40 leading-relaxed py-2 text-center font-mono">
                현재 전산상 오답 레코드가 비어 있습니다. 지필평가 챌린지를 풀어 점검받으세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
