/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Formula, SUBJECT_LIST } from "../data";
import { UserStudyState } from "../utils/studyEngine";
import { MathRenderer, MathTextParser } from "./MathRenderer";
import { Search, Star, Filter, Eye, ChevronDown, ChevronUp, Check, PlusCircle, MinusCircle } from "lucide-react";

interface ExplorerModeProps {
  formulas: Formula[];
  studyState: UserStudyState;
  onToggleBookmark: (id: string) => void;
  // 교사용 인쇄 대상 관리용
  selectedPrintIds: string[];
  onTogglePrintId: (id: string) => void;
  initialSubject?: string;
}

export function ExplorerMode({
  formulas,
  studyState,
  onToggleBookmark,
  selectedPrintIds,
  onTogglePrintId,
  initialSubject = "전체",
}: ExplorerModeProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [selectedImportance, setSelectedImportance] = useState<string>("전체");
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 검색 & 필터 체인
  const filteredFormulas = formulas.filter((f) => {
    // 1. 과목 필터
    if (selectedSubject !== "전체" && f.subject !== selectedSubject) return false;

    // 2. 중요도 필터
    if (selectedImportance !== "전체" && f.importance !== selectedImportance) return false;

    // 3. 북마크 전용 필터
    const isBookmarked = studyState.progress[f.id]?.bookmarked || false;
    if (onlyBookmarked && !isBookmarked) return false;

    // 4. 텍스트 검색 (이름, 단원명, 설명, 태그)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = f.formula_name.toLowerCase().includes(q);
      const matchChapter = f.chapter.toLowerCase().includes(q);
      const matchSubChapter = f.sub_chapter.toLowerCase().includes(q);
      const matchDesc = f.description.toLowerCase().includes(q);
      const matchTags = f.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchName && !matchChapter && !matchSubChapter && !matchDesc && !matchTags) {
        return false;
      }
    }

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* 필터 세션 - 고대비 다크 네온 기하 카드 */}
      <div className="rounded-md border-2 border-white bg-black p-6 space-y-5">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.25em] font-mono flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-[#00FF41]" />
          지능형 공식 필터링 시스템
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 검색창 */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="공식명, 단원(예: 행렬), 키워드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-2 border-white/20 bg-neutral-900 py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-white placeholder:text-white/40 focus:border-[#00FF41] focus:bg-black focus:outline-hidden transition-all"
            />
          </div>

          {/* 과목 필터 */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-md border-2 border-white/20 bg-neutral-900 px-3 py-2.5 text-xs font-mono font-black text-white hover:border-white focus:border-[#00FF41] focus:outline-hidden transition-all"
            >
              <option value="전체">모든 과목</option>
              {SUBJECT_LIST.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* 중요도 필터 */}
          <div>
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="w-full rounded-md border-2 border-white/20 bg-neutral-900 px-3 py-2.5 text-xs font-mono font-black text-white hover:border-white focus:border-[#00FF41] focus:outline-hidden transition-all"
            >
              <option value="전체">중요도 전체</option>
              <option value="상">중요도: 상 (★상★)</option>
              <option value="중">중요도: 중</option>
              <option value="하">중요도: 하</option>
            </select>
          </div>
        </div>

        {/* 하부 원터치 필터 스위치 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
          <div className="flex gap-2">
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 ${
                onlyBookmarked
                  ? "bg-amber-500 border-black text-black"
                  : "bg-black border-white/20 text-white/85 hover:border-white"
              }`}
            >
              <Star className={`h-4 w-4 ${onlyBookmarked ? "fill-black text-black" : ""}`} />
              북마크 공식만
            </button>
          </div>

          <p className="text-sm font-mono text-white/50">
            필터링 검색 결과: <strong className="text-[#00FF41] font-black">{filteredFormulas.length}</strong> / {formulas.length}개 공식
          </p>
        </div>
      </div>

      {/* 공식 리스트 아코디언 */}
      <div className="space-y-4">
        {filteredFormulas.length === 0 ? (
          <div className="p-12 text-center bg-black rounded-md border-2 border-white text-white/40 font-mono">
            <p className="text-sm font-bold">조건에 매칭되는 교과 공식이 발견되지 않았습니다.</p>
            <p className="text-xs text-white/30 mt-1">지능형 필터의 규격을 다시 세팅해보세요.</p>
          </div>
        ) : (
          filteredFormulas.map((f) => {
            const isBookmarked = studyState.progress[f.id]?.bookmarked || false;
            const currentLevel = studyState.progress[f.id]?.level || "none";
            const isPrinted = selectedPrintIds.includes(f.id);
            const isExpanded = expandedId === f.id;

            return (
              <div
                key={f.id}
                className={`rounded-md border-2 transition-all ${
                  isExpanded
                    ? "bg-[#121212] border-[#00FF41]"
                    : "bg-black border-white/15 hover:border-white/50"
                }`}
              >
                {/* 헤더 행 클릭 시 토글 */}
                <div
                  onClick={() => toggleExpand(f.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 h-2.5 w-2.5 rounded-full bg-[#00FF41]" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm md:text-md font-black text-white tracking-tight">{f.formula_name}</h4>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-mono font-black text-white/60">
                          {f.subject} &middot; {f.chapter}
                        </span>
                        {currentLevel !== "none" && (
                          <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-md ${
                            currentLevel === "easy" ? "bg-[#00FF41] text-black" :
                            currentLevel === "medium" ? "bg-amber-400 text-black" :
                            "bg-rose-650 text-white"
                          }`}>
                            상태: {
                              currentLevel === "easy" ? "쉬움" :
                              currentLevel === "medium" ? "보통" : "어려움"
                            }
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 line-clamp-1">
                        <MathTextParser text={f.description} />
                      </p>
                    </div>
                  </div>

                  {/* 마커 및 버튼 제어 */}
                  <div className="flex items-center justify-end gap-4 self-end sm:self-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(f.id);
                        }}
                        className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-amber-400 cursor-pointer"
                      >
                        <Star className={`h-4.5 w-4.5 ${isBookmarked ? "text-amber-400 fill-amber-400" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePrintId(f.id);
                        }}
                        className={`p-1.5 rounded-md border-2 transition-all cursor-pointer ${
                          isPrinted
                            ? "border-[#00FF41] text-black bg-[#00FF41]"
                            : "border-white/10 text-white/40 bg-zinc-900 hover:border-white"
                        }`}
                        title={isPrinted ? "인쇄 명단에서 제외" : "인쇄 명단에 추가"}
                      >
                        {isPrinted ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <PlusCircle className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="text-white/40">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* 상세 확장뷰 */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-5 animate-fade-in">
                    {/* LaTeX 수식 뷰 (중심!) */}
                    <div className="rounded-md bg-black text-white p-6 text-center overflow-x-auto my-1 flex items-center justify-center border border-white/20 max-h-[160px]">
                      <div className="scale-105 md:scale-110 select-all">
                        <MathRenderer math={f.formula_latex} block={true} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-mono">
                      <div className="space-y-1.5">
                        <h5 className="font-black text-[#00FF41] uppercase tracking-wider">📌 공식 설명</h5>
                        <p className="text-white/80 leading-relaxed font-sans">
                          <MathTextParser text={f.description} />
                        </p>
                      </div>

                      <div className="space-y-2 p-4 rounded-md bg-[#1A1A1A] border-2 border-white/10">
                        <h5 className="font-extrabold text-[#00FF41] flex items-center gap-1.5 uppercase tracking-wider text-xs">
                          🔔 단원 핵심 코멘트
                        </h5>
                        <p className="text-white/90 leading-relaxed text-xs">
                          <strong>교육과정 목표 및 처방:</strong> {f.curriculum_note || "핵심 수능/내신 출제 목표를 연계 학습하세요."}
                        </p>
                        {f.solution_guide && (
                          <p className="text-white/80 leading-relaxed text-xs mt-2 pt-2 border-t border-white/5">
                            <strong>출제/유도 조언:</strong> <MathTextParser text={f.solution_guide} />
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 태그 모음 */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/5 font-mono">
                      <span className="text-[10px] font-black text-white/40">키워드 태그:</span>
                      {f.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-neutral-900 border border-white/15 px-2.5 py-0.5 text-[9px] text-white/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
