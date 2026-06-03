/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { FORMULA_DATABASE, Formula } from "./data";
import {
  loadStudyState,
  saveStudyState,
  updateProgress,
  toggleBookmark,
  recordIncorrect,
  UserStudyState,
  MemorizationLevel,
} from "./utils/studyEngine";

// 하브 및 개별 교육공학용 컴포넌트 임포트
import { Dashboard } from "./components/Dashboard";
import { FlashcardMode } from "./components/FlashcardMode";
import { ExplorerMode } from "./components/ExplorerMode";
import { QuizMode } from "./components/QuizMode";
import { PrintCenter } from "./components/PrintCenter";
import { MyNotebook } from "./components/MyNotebook";

// 아이콘 라이브러리 연동
import {
  GraduationCap,
  LayoutDashboard,
  Flame,
  Search,
  CheckSquare,
  AlertOctagon,
  Printer,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [explorerFilterSubject, setExplorerFilterSubject] = useState<string>("전체");
  const [studyState, setStudyState] = useState<UserStudyState>({ progress: {}, quizHistory: [] });
  
  // 교사용 인쇄 대상 목록 일시적 보관 (formulaId 배열)
  const [selectedPrintIds, setSelectedPrintIds] = useState<string[]>([]);

  // 컴포넌트 마운트 시 LocalStorage 데이터 복구
  useEffect(() => {
    const saved = loadStudyState();
    setStudyState(saved);
  }, []);

  // 네비게이션 제어 유틸
  const handleNavigate = (tab: string, filterSubject?: string) => {
    setActiveTab(tab);
    if (tab === "explorer" && filterSubject) {
      setExplorerFilterSubject(filterSubject);
    } else {
      setExplorerFilterSubject("전체");
    }
    // 페이지 이동 시 상단 스크롤 아웃
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 암기 단계 피드백 갱신 처리
  const handleUpdateProgress = (formulaId: string, level: MemorizationLevel) => {
    const updated = updateProgress(studyState, formulaId, level);
    setStudyState(updated);
  };

  // 북마크 전용 토글 처리
  const handleToggleBookmark = (formulaId: string) => {
    const updated = toggleBookmark(studyState, formulaId);
    setStudyState(updated);
  };

  // 퀴즈 정답 맞춤 시 통계적 기록
  const handleRecordCorrect = (formulaId: string) => {
    const updated = updateProgress(studyState, formulaId, "easy");
    setStudyState(updated);
  };

  // 퀴즈 틀렸을 시 강제로 오답노트 탑재 및 어려움 지정
  const handleRecordIncorrect = (formulaId: string) => {
    const updated = recordIncorrect(studyState, formulaId);
    setStudyState(updated);
  };

  // 인쇄 대상 목록 토글
  const handleTogglePrintId = (formulaId: string) => {
    setSelectedPrintIds((prev) =>
      prev.includes(formulaId) ? prev.filter((id) => id !== formulaId) : [...prev, formulaId]
    );
  };

  // 인쇄 대상 초기화
  const handleClearPrintList = () => {
    setSelectedPrintIds([]);
  };

  // 마스터 비율 구하기
  const totalFormulas = FORMULA_DATABASE.length;
  const easyCount = FORMULA_DATABASE.filter((f) => studyState.progress[f.id]?.level === "easy").length;
  const masteryPercentage = totalFormulas > 0 ? Math.round((easyCount / totalFormulas) * 1000) / 10 : 0;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans antialiased flex flex-col justify-between pb-16 lg:pb-12 selection:bg-[#00FF41] selection:text-black">
      {/* ================= 최상단 고교 교과 헤더 (웹 전용 노출, 인쇄 숨김) ================= */}
      <header className="no-print flex items-center justify-between px-6 md:px-12 pt-8 pb-5 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div 
          onClick={() => handleNavigate("dashboard")}
          className="text-3xl md:text-4xl font-black tracking-tighter leading-none cursor-pointer flex items-center gap-3 active:scale-95 transition-transform"
        >
          MATH <span className="text-[#00FF41]">2022</span>
          <span className="text-[10px] hidden sm:inline bg-[#00FF41] text-black font-extrabold px-2 py-0.5 rounded-md tracking-widest uppercase font-mono">
            REV
          </span>
        </div>
        
        <nav className="flex gap-4 md:gap-8 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-0.5 font-bold font-mono">Current Progress</span>
            <span className="text-sm md:text-lg font-bold tracking-tight italic text-[#00FF41]">
              {masteryPercentage}% Mastery
            </span>
          </div>
          <div className="hidden sm:flex px-3 py-1 border border-white/10 rounded-md text-[10px] font-mono text-white/50 bg-white/5 items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-[#00FF41] rounded-full animate-pulse" />
            SECURE LOCAL-STORAGE
          </div>
        </nav>
      </header>

      {/* ================= 메인 반응형 쉘 ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 하이브리드 세련된 데스크톱 좌측 내비게이션 레일 (인쇄 시 자동 숨김) */}
          <nav className="no-print col-span-1 lg:col-span-3 space-y-4 self-start lg:sticky lg:top-28">
            <div>
              <p className="px-3 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono mb-4">
                Curriculum Hub
              </p>
              
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavigate("dashboard")}
                  className={`w-full group flex items-center justify-between px-4 py-3 border rounded-md text-left text-sm font-black uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-white text-black border-white font-black"
                      : "text-white/60 border-white/10 hover:border-white/40 hover:text-white bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50">01</span>
                    <LayoutDashboard className="h-4.5 w-4.5" />
                    <span>상황판</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "dashboard" ? "translate-x-1" : "opacity-30"}`} />
                </button>

                <button
                  onClick={() => handleNavigate("flashcard")}
                  className={`w-full group flex items-center justify-between px-4 py-3 border rounded-md text-left text-sm font-black uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    activeTab === "flashcard"
                      ? "bg-white text-black border-white font-black"
                      : "text-white/60 border-white/10 hover:border-white/40 hover:text-white bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50">02</span>
                    <Flame className="h-4.5 w-4.5" />
                    <span>3D 암기카드</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "flashcard" ? "translate-x-1" : "opacity-30"}`} />
                </button>

                <button
                  onClick={() => handleNavigate("explorer")}
                  className={`w-full group flex items-center justify-between px-4 py-3 border rounded-md text-left text-sm font-black uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    activeTab === "explorer"
                      ? "bg-white text-black border-white font-black"
                      : "text-white/60 border-white/10 hover:border-white/40 hover:text-white bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50">03</span>
                    <Search className="h-4.5 w-4.5" />
                    <span>공식 탐색기</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "explorer" ? "translate-x-1" : "opacity-30"}`} />
                </button>

                <button
                  onClick={() => handleNavigate("quiz")}
                  className={`w-full group flex items-center justify-between px-4 py-3 border rounded-md text-left text-sm font-black uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    activeTab === "quiz"
                      ? "bg-white text-black border-white font-black"
                      : "text-white/60 border-white/10 hover:border-white/40 hover:text-white bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50">04</span>
                    <CheckSquare className="h-4.5 w-4.5" />
                    <span>모의진단</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "quiz" ? "translate-x-1" : "opacity-30"}`} />
                </button>

                <button
                  onClick={() => handleNavigate("notebook")}
                  className={`w-full group flex items-center justify-between px-4 py-3 border rounded-md text-left text-sm font-black uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    activeTab === "notebook"
                      ? "bg-white text-black border-white font-black"
                      : "text-white/60 border-white/10 hover:border-white/40 hover:text-white bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50">05</span>
                    <AlertOctagon className="h-4.5 w-4.5 text-[#FF3B30]" />
                    <span>오답노트</span>
                  </div>
                  <span className="bg-[#FF3B30] text-white px-2 py-0.5 rounded-full font-mono text-[10px] font-black group-hover:scale-110 transition-transform">
                    {FORMULA_DATABASE.filter((f) => studyState.progress[f.id]?.incorrectCount > 0).length}
                  </span>
                </button>

                <button
                  onClick={() => handleNavigate("print")}
                  className={`w-full group flex items-center justify-between px-4 py-3 border rounded-md text-left text-sm font-black uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    activeTab === "print"
                      ? "bg-white text-black border-white font-black"
                      : "text-white/60 border-white/10 hover:border-white/40 hover:text-white bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50">06</span>
                    <Printer className="h-4.5 w-4.5" />
                    <span>배포용 요약인쇄</span>
                  </div>
                  {selectedPrintIds.length > 0 && (
                    <span className="bg-[#00FF41] text-black px-2 py-0.5 rounded-full font-mono text-[10px] font-black">
                      {selectedPrintIds.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 교사용 전용 고출력 대시 보드 팁 박스 */}
            <div className="hidden lg:block p-6 border-2 border-white/10 rounded-md bg-black/40 text-xs leading-relaxed text-white/70 font-mono space-y-3">
              <div className="flex items-center gap-2 font-black text-white uppercase tracking-widest text-[9px] border-b border-white/10 pb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#00FF41]" />
                <span>2022 Curriculum Tip</span>
              </div>
              <p>
                등차/등비수열은 &apos;대수&apos; 영역으로 통합, 1학년 <b>&apos;공통수학1&apos;</b>에는 다시 <b>&apos;행렬&apos;</b>이 필수 출제됩니다. 외분점 개념은 명시적으로 제외되었으므로 수학 지도 시 세심히 확인해 주세요.
              </p>
            </div>
          </nav>

          {/* ================= 허브 교차 컴포넌트 뷰 영역 ================= */}
          <div className="col-span-1 lg:col-span-9">
            {activeTab === "dashboard" && (
              <Dashboard
                formulas={FORMULA_DATABASE}
                studyState={studyState}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === "flashcard" && (
              <FlashcardMode
                formulas={FORMULA_DATABASE}
                studyState={studyState}
                onUpdateProgress={handleUpdateProgress}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {activeTab === "explorer" && (
              <ExplorerMode
                formulas={FORMULA_DATABASE}
                studyState={studyState}
                onToggleBookmark={handleToggleBookmark}
                selectedPrintIds={selectedPrintIds}
                onTogglePrintId={handleTogglePrintId}
                initialSubject={explorerFilterSubject}
              />
            )}

            {activeTab === "quiz" && (
              <QuizMode
                formulas={FORMULA_DATABASE}
                studyState={studyState}
                onRecordCorrect={handleRecordCorrect}
                onRecordIncorrect={handleRecordIncorrect}
              />
            )}

            {activeTab === "notebook" && (
              <MyNotebook
                formulas={FORMULA_DATABASE}
                studyState={studyState}
                onToggleBookmark={handleToggleBookmark}
                onUpdateProgress={handleUpdateProgress}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === "print" && (
              <PrintCenter
                formulas={FORMULA_DATABASE}
                selectedPrintIds={selectedPrintIds}
                onTogglePrintId={handleTogglePrintId}
                onClearPrintList={handleClearPrintList}
              />
            )}
          </div>
        </div>
      </main>

      {/* 모바일 뷰 최적화를 위한 하단 탭 내비게이션 바 (웹 화면 아래, 인쇄 시 완벽히 숨김) */}
      <div className="no-print lg:hidden fixed bottom-4 left-4 right-4 bg-black/95 backdrop-blur-md rounded-md border-2 border-white/20 py-3 px-4 flex items-center justify-around z-35">
        <button
          onClick={() => handleNavigate("dashboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === "dashboard" ? "text-[#00FF41] scale-110 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[9px] font-black tracking-tighter">상황판</span>
        </button>

        <button
          onClick={() => handleNavigate("flashcard")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === "flashcard" ? "text-[#00FF41] scale-110 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <Flame className="h-5 w-5" />
          <span className="text-[9px] font-black tracking-tighter">암기카드</span>
        </button>

        <button
          onClick={() => handleNavigate("explorer")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === "explorer" ? "text-[#00FF41] scale-110 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-[9px] font-black tracking-tighter">탐색기</span>
        </button>

        <button
          onClick={() => handleNavigate("quiz")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === "quiz" ? "text-[#00FF41] scale-110 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <CheckSquare className="h-5 w-5" />
          <span className="text-[9px] font-black tracking-tighter">모의진단</span>
        </button>

        <button
          onClick={() => handleNavigate("notebook")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all relative ${
            activeTab === "notebook" ? "text-[#00FF41] scale-110 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <AlertOctagon className="h-5 w-5" />
          <span className="text-[9px] font-black tracking-tighter">오답노트</span>
          {FORMULA_DATABASE.filter((f) => studyState.progress[f.id]?.incorrectCount > 0).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white h-4 min-w-[16px] flex items-center justify-center rounded-full text-[8px] font-black px-1">
              {FORMULA_DATABASE.filter((f) => studyState.progress[f.id]?.incorrectCount > 0).length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavigate("print")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === "print" ? "text-[#00FF41] scale-110 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <Printer className="h-5 w-5" />
          <span className="text-[9px] font-black tracking-tighter">인쇄</span>
        </button>
      </div>

      {/* ================= 하단 티커 Ticker (인쇄 시 자동 숨김) ================= */}
      <footer className="no-print h-10 bg-white border-t border-white/15 flex items-center overflow-hidden fixed bottom-0 left-0 right-0 z-30">
        <div className="flex whitespace-nowrap animate-marquee text-black font-black uppercase tracking-tighter text-[11px] font-mono">
          <span className="px-8">Recent Check: 근의 공식 &middot;</span>
          <span className="px-8 font-extrabold italic text-rose-600">Strict Warning: 2022 개정 공통수학 행렬 추가 완료 &middot;</span>
          <span className="px-8">Recent Check: 삼각함수의 합성 &middot;</span>
          <span className="px-8">Recent Check: 로그의 성질 &middot;</span>
          <span className="px-8">Curriculum Update: 행렬의 곱셈 &middot;</span>
          <span className="px-8 font-extrabold italic text-rose-600">Local Safe Mode Active &middot;</span>
          
          {/* Loop duplicates to make marquee slide seamless */}
          <span className="px-8">Recent Check: 근의 공식 &middot;</span>
          <span className="px-8 font-extrabold italic text-rose-600">Strict Warning: 2022 개정 공통수학 행렬 추가 완료 &middot;</span>
          <span className="px-8">Recent Check: 삼각함수의 합성 &middot;</span>
          <span className="px-8">Recent Check: 로그의 성질 &middot;</span>
          <span className="px-8">Curriculum Update: 행렬의 곱셈 &middot;</span>
          <span className="px-8 font-extrabold italic text-rose-600">Local Safe Mode Active &middot;</span>
        </div>
      </footer>
    </div>
  );
}
