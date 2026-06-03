/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formula } from "../data";
import { UserStudyState, MemorizationLevel } from "../utils/studyEngine";
import { MathRenderer } from "./MathRenderer";
import { Star, AlertTriangle, ArrowRight, Trash2, HelpCircle, CheckCircle, Flame } from "lucide-react";

interface MyNotebookProps {
  formulas: Formula[];
  studyState: UserStudyState;
  onToggleBookmark: (id: string) => void;
  onUpdateProgress: (id: string, level: MemorizationLevel) => void;
  onNavigate: (tab: string, filterSubject?: string) => void;
}

export function MyNotebook({
  formulas,
  studyState,
  onToggleBookmark,
  onUpdateProgress,
  onNavigate,
}: MyNotebookProps) {
  const progressMap = studyState.progress;

  // 1. 북마크 공식들
  const bookmarkedFormulas = formulas.filter((f) => progressMap[f.id]?.bookmarked);

  // 2. 오답 기록이 있는 수식들
  const wrongFormulas = formulas.filter((f) => {
    const p = progressMap[f.id];
    return p && p.incorrectCount > 0;
  });

  return (
    <div className="space-y-8 text-white">
      {/* 훈련 설명 */}
      <div className="bg-black border-2 border-white rounded-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-[0.25em] text-[#00FF41] font-mono">
            <Flame className="h-5 w-5 text-[#00FF41] animate-pulse" />
            지능형 수식 취약 진단 클리닉
          </h3>
          <p className="text-sm text-white/70 font-sans leading-relaxed">
            북마크 아이콘을 터치한 수식, 퀴즈 챌린지에서 오답 기록이 발생한 수식, 그리고 본인이 어렵다고 레이블링 한 공식들만 격리 수용하여 복습합니다.
          </p>
        </div>
        <button
          onClick={() => onNavigate("flashcard")}
          className="rounded-md bg-[#00FF41] hover:bg-[#00FF41]/85 text-black font-black py-3.5 px-6 text-xs uppercase tracking-widest border-2 border-black active:scale-95 transition-all cursor-pointer whitespace-nowrap self-start md:self-center font-mono"
        >
          클리닉 복습 시작
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 오답노트 섹션 (최우선 보완!) */}
        <div className="rounded-md border-2 border-white bg-black p-6 space-y-5 font-mono">
          <h4 className="text-[10px] font-black text-[#FF3B30] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/10 pb-3">
            <AlertTriangle className="h-4.5 w-4.5 text-[#FF3B30]" />
            집중 보완 오답 기록 [{wrongFormulas.length}]
          </h4>

          {wrongFormulas.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">
              오답 레코드가 비어 있습니다. 지필평가 챌린지에 도전하세요.
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {wrongFormulas.map((f) => {
                const incorrectCount = progressMap[f.id]?.incorrectCount || 0;
                return (
                  <div
                    key={f.id}
                    className="p-4 rounded-md border-2 border-white/10 bg-neutral-900/60 hover:border-white/30 transition-all space-y-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{f.formula_name}</span>
                      <span className="rounded-md bg-[#FF3B30] px-2 py-1 text-[9px] font-black text-white">
                        ERR x{incorrectCount}
                      </span>
                    </div>

                    <div className="py-3 px-3 text-center rounded-md bg-black border border-white/10 select-all font-mono">
                      <MathRenderer math={f.formula_latex} block={false} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{f.subject} &middot; {f.chapter}</span>
                      <button
                        onClick={() => onUpdateProgress(f.id, "easy")}
                        className="text-[#00FF41] hover:text-[#00FF41]/80 font-black hover:underline cursor-pointer tracking-wider"
                      >
                        [ 해결 완료 - 암기 목록으로 이동 ]
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 북마크 보관함 섹션 */}
        <div className="rounded-md border-2 border-white bg-black p-6 space-y-5 font-mono">
          <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/10 pb-3">
            <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
            지정 보관 완료 북마크 [{bookmarkedFormulas.length}]
          </h4>

          {bookmarkedFormulas.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">
              즐겨찾기 보관함이 비어 있습니다. 탐색기에서 별표를 채워보세요.
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {bookmarkedFormulas.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-md border-2 border-white/10 bg-neutral-900/60 hover:border-white/30 transition-all space-y-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">{f.formula_name}</span>
                    <button
                      onClick={() => onToggleBookmark(f.id)}
                      className="p-1 bg-white/5 hover:bg-rose-500/15 hover:text-[#FF3B30] text-white/50 border border-white/10 rounded-md transition-all cursor-pointer"
                      title="북마크 해제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="py-3 px-3 text-center rounded-md bg-black border border-white/10 select-all font-mono">
                    <MathRenderer math={f.formula_latex} block={false} />
                  </div>

                  <div className="text-xs text-white/40">
                    {f.subject} &middot; {f.chapter}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
