/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Formula, SUBJECT_LIST } from "../data";
import { MathRenderer } from "./MathRenderer";
import { Printer, Check, Clipboard, RefreshCw, Layers, Layout, Grid } from "lucide-react";

interface PrintCenterProps {
  formulas: Formula[];
  selectedPrintIds: string[];
  onTogglePrintId: (id: string) => void;
  onClearPrintList: () => void;
}

export function PrintCenter({
  formulas,
  selectedPrintIds,
  onTogglePrintId,
  onClearPrintList,
}: PrintCenterProps) {
  const [schoolName, setSchoolName] = useState<string>("한국고등학교");
  const [printTitle, setPrintTitle] = useState<string>("2022 개정 교육과정 고교 수학 공식 가이드북");
  const [printLayout, setPrintLayout] = useState<"list" | "table">("list");
  const [selectedSubject, setSelectedSubject] = useState<string>("전체");

  // 인쇄할 총 타겟들 결정
  // 만약 선택된 특정 공식 ID가 있다면 그것을 우선으로 출력하고, 없다면 과목 필터에 따른 전제 공식을 가용한 인쇄 후보군으로 둡니다.
  const hasSelection = selectedPrintIds.length > 0;
  
  const targetFormulas = hasSelection
    ? formulas.filter((f) => selectedPrintIds.includes(f.id))
    : selectedSubject === "전체"
      ? formulas
      : formulas.filter((f) => f.subject === selectedSubject);

  const handlePrint = () => {
    window.print();
  };

  const addAllOfSubject = () => {
    const list = selectedSubject === "전체"
      ? formulas
      : formulas.filter((f) => f.subject === selectedSubject);
    
    list.forEach((f) => {
      if (!selectedPrintIds.includes(f.id)) {
        onTogglePrintId(f.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 설정을 담은 인쇄 통제 센터 (웹 전용 노출) */}
      <div className="rounded-md border-2 border-white bg-black p-6 no-print text-white font-mono space-y-5">
        <h3 className="text-xs font-black text-[#00FF41] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/10 pb-3">
          <Printer className="h-4.5 w-4.5 text-[#00FF41]" />
          배포용 부교재 및 인쇄 관리자
        </h3>
        <p className="text-sm text-white/60 leading-relaxed font-sans">
          원하는 공식 조합을 1열 레이아웃 내지 표 형태로 수려하게 정돈한 고품질 인쇄지(PDF)를 원터치 기획합니다. <br />
          아무것도 선택하지 않으면 해당 과목의 <strong>전체 공식 가이드</strong>가 출력되며, 공식 탐색기에서 특정 공식만 선택하여 출력할 수도 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          {/* 학교명 설정 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">소속 학교명</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full rounded-md border-2 border-white/10 bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white focus:border-[#00FF41] outline-hidden transition-all"
              placeholder="예: 서울고등학교"
            />
          </div>

          {/* 인쇄지 제목 설정 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">인쇄 요약집 주요 제호</label>
            <input
              type="text"
              value={printTitle}
              onChange={(e) => setPrintTitle(e.target.value)}
              className="w-full rounded-md border-2 border-white/10 bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white focus:border-[#00FF41] outline-hidden transition-all"
              placeholder="예: 기말고사 대비 등차/등비수열 요약집"
            />
          </div>

          {/* 레이아웃 구성 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block font-mono">인쇄물 레이아웃 구성</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPrintLayout("list")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md border-2 transition-all cursor-pointer ${
                  printLayout === "list"
                    ? "bg-[#00FF41] border-[#00FF41] text-black font-black"
                    : "bg-black border-white/10 text-white/70 hover:border-white"
                }`}
              >
                <Layout className="h-3.5 w-3.5" />
                세로 리스트 형태
              </button>
              <button
                onClick={() => setPrintLayout("table")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md border-2 transition-all cursor-pointer ${
                  printLayout === "table"
                    ? "bg-[#00FF41] border-[#00FF41] text-black font-black"
                    : "bg-black border-white/10 text-white/70 hover:border-white"
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                가로 테이블 형태
              </button>
            </div>
          </div>
        </div>

        {/* 선택 공식과 기능 버튼 영역 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
          <div className="flex flex-wrap items-center gap-3">
            {!hasSelection ? (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-md border-2 border-white/20 bg-neutral-900 px-3 py-2 text-xs font-black text-white focus:border-[#00FF41] focus:outline-hidden"
              >
                <option value="전체">과목: 전체 수록</option>
                {SUBJECT_LIST.map((subj) => (
                  <option key={subj} value={subj}>
                    과목: {subj}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs bg-[#00FF41]/10 border border-[#00FF41]/20 rounded-md px-2.5 py-1.5 text-[#00FF41] font-black">
                출력 대상 지정 수식 : <strong>{selectedPrintIds.length}</strong>개 공식 선택됨
              </span>
            )}

            {hasSelection && (
              <button
                onClick={onClearPrintList}
                className="rounded-md px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#FF3B30] border-2 border-[#FF3B30]/30 hover:border-[#FF3B30] hover:bg-[#FF3B30]/10 transition-all cursor-pointer"
              >
                전체 선택 해제
              </button>
            )}

            {!hasSelection && (
              <button
                onClick={addAllOfSubject}
                className="rounded-md bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white border border-white/20 hover:border-white transition-all cursor-pointer"
              >
                과목 내 전식을 출력 리스트에 추가
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-md bg-[#00FF41] hover:bg-[#00FF41]/85 text-black px-6 py-3 text-xs font-black uppercase tracking-widest border-2 border-black hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              출력물 인쇄하기 (Ctrl+P)
            </button>
          </div>
        </div>
      </div>

      {/* ================= 실제 인쇄 영역 (네오 클래식 배포 문서 양식) ================= */}
      <div className="bg-white rounded-md border-2 border-black p-8 md:p-12 font-sans max-w-4xl mx-auto print-area leading-relaxed text-black">
        {/* 인쇄 상단 양식 헤더 */}
        <div className="border-b-[6px] border-double border-black pb-5 mb-6 text-center space-y-4">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-bold tracking-wider uppercase">
            <span>{schoolName} 수학과 공식 학습지</span>
            <span>지도교사 서명: (인)</span>
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight uppercase border-y border-black py-3 font-sans">
            {printTitle}
          </h2>

          {/* 학교 시험 유인물 양식: 학생 서명란 */}
          <div className="grid grid-cols-4 border-2 border-black text-xs divide-x-2 divide-black text-center font-mono">
            <div className="bg-zinc-100 p-2 font-black text-black">교과 영역</div>
            <div className="p-2 font-bold text-black border-r border-black">고등학교 수학 (2022 개정)</div>
            <div className="bg-zinc-100 p-2 font-black text-black">학년 반 번호</div>
            <div className="p-2 text-zinc-400 font-bold">학년 &nbsp;&nbsp;&nbsp; 반 &nbsp;&nbsp;&nbsp; 번&nbsp;&nbsp;&nbsp; 이름: </div>
          </div>
        </div>

        {/* 인쇄 레이아웃 구현 및 가공 */}
        {targetFormulas.length === 0 ? (
          <div className="py-24 text-center text-zinc-400 text-xs border-2 border-dashed border-zinc-200 rounded-md">
            인쇄 대상으로 지정된 수식이 부재합니다. 위 통제 센터에서 인쇄 필터링 대상을 가미해 주십시오.
          </div>
        ) : printLayout === "list" ? (
          /* 1. 목록형 레이아웃 */
          <div className="grid grid-cols-1 gap-6">
            {targetFormulas.map((f, index) => (
              <div
                key={f.id}
                className="print-card border-2 border-black rounded-md p-5 space-y-4 bg-zinc-50/20"
              >
                <div className="flex items-baseline justify-between border-b-2 border-zinc-300 pb-2">
                  <h4 className="text-sm font-black text-black flex items-center gap-1.5 uppercase font-sans">
                    <span className="text-zinc-400 font-mono text-xs">[{index + 1}]</span>
                    {f.formula_name}
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider">
                    {f.subject} &middot; {f.chapter} &middot; {f.sub_chapter}
                  </span>
                </div>

                {/* 공식 블록 (진함) */}
                <div className="py-5 px-3 my-2 rounded-md bg-zinc-100 border border-zinc-300 text-center overflow-x-auto print:bg-white print:border-zinc-400">
                  <div className="text-black font-mono text-md sm:text-lg">
                    <MathRenderer math={f.formula_latex} block={true} />
                  </div>
                </div>

                {/* 내용 및 팁 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans">
                  <div className="space-y-1">
                    <span className="font-extrabold text-black tracking-wide block">■ 공식 설명</span>
                    <p className="text-zinc-700 font-medium text-justify leading-relaxed">
                      {f.description.replace(/\$/g, "")}
                    </p>
                  </div>
                  <div className="space-y-1 p-3 rounded-md bg-neutral-100 text-zinc-800 border border-zinc-200">
                    <span className="font-extrabold text-black block">■ 교사 출제 처방</span>
                    <p className="text-xs leading-relaxed">
                      {f.curriculum_note ? `${f.curriculum_note.replace("★2022 개정", "[2022 개정]")}` : "2022년 교육과정 출제 방향을 대조해 이해하세요."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 2. 표 레이아웃 (컴팩트 공식 사전형) */
          <div className="overflow-x-auto border-2 border-black">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b-2 border-black text-black font-black text-center divide-x divide-zinc-400">
                  <th className="p-3 w-12 border-r border-black">번호</th>
                  <th className="p-3 w-36 border-r border-black">과목 / 단원</th>
                  <th className="p-3 w-40 border-r border-black">공식 이름</th>
                  <th className="p-3 border-r border-black">핵심 공식 LaTeX 수식</th>
                  <th className="p-3">출제 성취기준 조언 및 메모</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-300">
                {targetFormulas.map((f, index) => (
                  <tr key={f.id} className="border-b border-black hover:bg-zinc-50/40 divide-x divide-zinc-300 font-sans">
                    <td className="p-2.5 text-center font-mono font-black text-zinc-500 bg-zinc-100/40">{index + 1}</td>
                    <td className="p-2.5">
                      <div className="font-black text-black">{f.subject}</div>
                      <div className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">{f.chapter}</div>
                    </td>
                    <td className="p-2.5 font-bold text-black">{f.formula_name}</td>
                    <td className="p-2.5 bg-zinc-50/10 font-mono text-center">
                      <div className="scale-90 select-all">
                        <MathRenderer math={f.formula_latex} block={false} />
                      </div>
                    </td>
                    <td className="p-2.5 text-xs leading-relaxed text-zinc-600">
                      {f.curriculum_note || "교과 성취기준 반영 필수 핵심 공식."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 인쇄용 꼬리말 */}
        <div className="mt-10 pt-4 border-t-2 border-black text-center text-[10px] text-zinc-400 font-mono flex items-center justify-between tracking-widest uppercase">
          <span>Printed: {new Date().toLocaleDateString("ko-KR")}</span>
          <span>© 2022 MATH MEMORY CLINIC MASTER</span>
          <span>SCHOOL: {schoolName}</span>
        </div>
      </div>
    </div>
  );
}
