/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Award, Download, Check, Save, User, RefreshCw, Printer } from 'lucide-react';

const SAMPLE_TEXT = `독도는 지리적으로 울릉도에서 87.4km에 위치하여 예로부터 본토 생활 영역의 일부였습니다. 대한제국은 1900년 칙령 제41호로 주권을 명시했고, 일본 메이지 최고기구 역시 1877년 태정관 지령을 통해 독도가 일본령이 아님을 인정했습니다. 우리는 과거 침탈의 역사가 주는 왜곡된 갈등을 극복하고, 양국 관찬 사료의 객관성 위에서 평화로운 어업 평화권과 상생 공존의 바다를 다음 세대에 물려줄 역사를 공동 집필할 의무가 있습니다.`;

export default function ClassWorkbook() {
  const [korStudent, setKorStudent] = useState('');
  const [japStudent, setJapStudent] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [content, setContent] = useState('');
  const [evaluator, setEvaluator] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const characterLimit = 500;
  const wordCount = content.length;

  const handleFillSample = () => {
    setKorStudent('김다서 (대한민국 평화고교 2년)');
    setJapStudent('사토 하루토 (일본 돗토리 상생고교 2년)');
    setSectionTitle('제5장. 오키와 울릉 너머, 사실로 여는 상생의 독도 평화선');
    setContent(SAMPLE_TEXT);
    setEvaluator('최은경 역사교육 자문위원');
    setIsSigned(true);
  };

  const handleReset = () => {
    setKorStudent('');
    setJapStudent('');
    setSectionTitle('');
    setContent('');
    setEvaluator('');
    setIsSigned(false);
    setShowCertificate(false);
  };

  const isFormValid = korStudent && japStudent && sectionTitle && content && evaluator && isSigned;

  return (
    <div className="space-y-12">
      <div className="border border-[#E8E6DF] rounded-[40px] p-8 bg-white/50 shadow-sm" id="workbook-interactive-box">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#A5A58D] mb-4 block">Interactive Workshop</span>
        <h3 className="font-serif text-3xl mb-3 text-[#353530] italic font-bold">한·일 평화 공동 교과서 집필관</h3>
        <p className="text-xs text-[#5C5B56] max-w-3xl leading-relaxed mb-8 font-light">
          양국의 일방적인 프로파간다와 감정 수위를 뛰어넘어, <strong>1차 역사 사료(태정관 지령, 세종실록지리지 등)</strong>의 팩트를 고스란히 담아 동해 평화와 역사적 진실을 가르칠 미래의 통합 공동 교과서 한 장을 직접 기초 집필해 보세요.
        </p>

        {/* Input Work Space divided */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-white p-6 rounded-3xl border border-[#E8E6DF] shadow-sm">
            <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-3 mb-1">
              <span className="text-[11px] font-mono uppercase font-bold text-[#6B705C] flex items-center gap-1.5">
                <Edit3 size={13} /> 집필 제안서 양식 기초 등록
              </span>
              <button 
                onClick={handleFillSample}
                className="text-[10px] font-bold text-[#6B705C] hover:text-[#5A5E4E] flex items-center gap-1 bg-[#F8F7F2] border border-[#E8E6DF] px-3 py-1 rounded-full transition-colors"
              >
                우수 집필 예시문 채우기
              </button>
            </div>

            {/* Students metadata row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#A5A58D] uppercase font-mono block mb-1">대한민국 저술 대표자 (소속 & 성명)</label>
                <input
                  type="text"
                  value={korStudent}
                  onChange={(e) => setKorStudent(e.target.value)}
                  placeholder="예: 김민우 (새날고 2학년)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#43423E]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#A5A58D] uppercase font-mono block mb-1">일본국 저술 대표자 (소속 & 성명)</label>
                <input
                  type="text"
                  value={japStudent}
                  onChange={(e) => setJapStudent(e.target.value)}
                  placeholder="예: 사토 렌 (돗토리 상생고 2학년)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#43423E]"
                />
              </div>
            </div>

            {/* Proposed title */}
            <div>
              <label className="text-[10px] font-bold text-[#A5A58D] uppercase font-mono block mb-1">공동 역사교과서 대단원/소단원 제목</label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="예: 제3단원. 사료와 사실을 통해 마주하는 동해와 독도 평화의 날개"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#43423E]"
              />
            </div>

            {/* Document contents markdown */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-[#A5A58D] uppercase font-mono block">집필 원서 본문 기술 (양국 사료 증명 팩트 기록)</label>
                <span className={`text-[9px] font-mono ${wordCount > characterLimit ? 'text-red-500 font-bold' : 'text-[#A5A58D]'}`}>
                  {wordCount} / {characterLimit}자 제한
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
                rows={6}
                placeholder="지면 제약상 10줄 이내(500자 이하)로 한일 양국 사료를 교차 대조하여 극단적 영토 갈등을 극복하고 평화적 미래로 갈 사설 원서를 작성하십시오..."
                className="w-full text-xs px-3.5 py-3 rounded-2xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#43423E] leading-relaxed resize-none"
              ></textarea>
              {/* Progress bar of limit */}
              <div className="w-full h-1 bg-[#F2EFE9] rounded-full overflow-hidden mt-1.5">
                <div 
                  className={`h-full transition-all duration-300 ${wordCount > characterLimit * 0.9 ? 'bg-amber-600' : 'bg-[#6B705C]'}`}
                  style={{ width: `${Math.min(100, (wordCount / characterLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Evaluator signature section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#F2EFE9] items-end">
              <div>
                <label className="text-[10px] font-bold text-[#A5A58D] uppercase font-mono block mb-1">집필물 심사위원/지도교사 성명</label>
                <input
                  type="text"
                  value={evaluator}
                  onChange={(e) => setEvaluator(e.target.value)}
                  placeholder="예: 최서원 역사교사"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#43423E]"
                />
              </div>

              {/* Styled signature clicking */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#A5A58D] uppercase font-mono block mb-1">심사위원 전자 날인/승인</span>
                <button
                  type="button"
                  onClick={() => setIsSigned(!isSigned)}
                  disabled={!evaluator}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSigned 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'border-[#E8E6DF] hover:bg-[#F8F7F2] text-[#5C5B56] disabled:opacity-50'
                  }`}
                >
                  {isSigned ? (
                    <>
                      <Check size={14} className="text-emerald-700" />
                      <span>서명 날인 완료 (Signed)</span>
                    </>
                  ) : (
                    <span>여기에 클릭하여 전자날인</span>
                  )}
                </button>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 text-xs font-semibold text-[#5C5B56] border border-[#E8E6DF] rounded-full hover:bg-[#F8F7F2] transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={13} />
                새로 쓰기
              </button>
              <button
                type="button"
                disabled={!isFormValid}
                onClick={() => setShowCertificate(true)}
                className="flex-2 py-3 text-xs font-bold text-white bg-[#6B705C] rounded-full hover:bg-[#5A5E4E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Award size={14} />
                아카이브 등재 및 주권인증서 발급
              </button>
            </div>

          </div>

          {/* Book live simulation Preview Side (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between self-stretch bg-[#FBF9F4] border border-[#E8E6DF] rounded-3xl p-6 relative overflow-hidden select-none">
            <div className="absolute top-[-10px] right-[-10px] w-24 h-24 rounded-full bg-[#6B705C]/5 border border-[#6B705C]/10 flex items-center justify-center">
              <span className="font-serif italic text-[#6B705C]/20 text-3xl">P</span>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono font-bold text-[#A5A58D] uppercase tracking-wider block">교과서 내장 실시간 렌더링 뷰 (Pre-View)</span>
              
              {/* Textbook mock design */}
              <div className="border border-[#E8E6DF] bg-white rounded-2xl p-5 shadow-sm space-y-3 font-serif min-h-[300px] flex flex-col justify-between">
                
                {/* Book header */}
                <div className="border-b border-[#F2EFE9] pb-2 text-center text-[10px] text-[#A5A58D] font-mono">
                  SECTION V. COOPERATION & FACT PRESERVATION 
                </div>

                {/* Main page content area */}
                <div className="space-y-3 flex-1 pt-1">
                  <h4 className="text-center font-bold text-[#353530] text-sm leading-snug">
                    {sectionTitle || '소단원 제목을 양식에 입력하십시오.'}
                  </h4>
                  
                  <p className="text-[11px] leading-relaxed text-[#43423E] indent-3 text-justify whitespace-pre-wrap font-sans font-light">
                    {content || '집필 본문을 기재하면 교과서 모형으로 자동 렌더링되어 표시됩니다. 사료 명세와 평화 상생 슬로건을 균형 있게 다루어 보세요.'}
                  </p>
                </div>

                {/* Footer of the book page */}
                <div className="border-t border-[#F2EFE9] pt-3 flex justify-between items-center text-[9px] text-[#A5A58D]">
                  <div className="flex flex-col">
                    <span>저술역자 : {korStudent ? korStudent.split(' ')[0] : '한국인 학생'} & {japStudent ? japStudent.split(' ')[0] : '일본인 학생'}</span>
                    <span>감사승인 : {evaluator || '심사 교사'}</span>
                  </div>
                  <div className="text-right">
                    <span>PAGE 152</span>
                  </div>
                </div>

              </div>

              {/* Guidance alerts */}
              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-[#E8E6DF] text-[11px] text-[#5C5B56] space-y-1">
                <p className="font-bold text-[#6B705C]">✓ 공동 집필 가이드 라인:</p>
                <p className="leading-relaxed">
                  자장된 1차 자료인 <strong>태정관 지령</strong>이나 <strong>칙령 제41호</strong>를 인용하여 논리를 구성하고, 감정적인 적대를 지양하는 미래지향적 상생 구호를 조화롭게 작성해 통과 하십시오.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* POPUP OVERLAY modal for printable certificate of accomplishment */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 bg-black/65 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FDFCF7] border-4 border-[#6B705C]/40 rounded-[48px] max-w-2xl w-full p-8 md:p-12 relative overflow-hidden shadow-2xl text-center flex flex-col items-center justify-between font-serif"
            >
              {/* Certificate Border accents design */}
              <div className="absolute inset-4 border border-[#E8E6DF]/80 rounded-[32px] pointer-events-none"></div>

              {/* Top seal decoration */}
              <div className="w-16 h-16 rounded-full bg-[#6B705C]/10 border border-[#6B705C]/30 flex items-center justify-center mb-6 relative">
                <Award size={36} className="text-[#6B705C]" />
                <div className="absolute inset-[-4px] border border-[#6B705C]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              </div>

              {/* Title cert */}
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-[#A5A58D]">Certification of Accomplishment</span>
              <h2 className="text-2xl md:text-3xl text-[#353530] font-bold mt-2 mb-6">독도 평화역사 공동 집필 등재증서</h2>

              {/* Content description */}
              <div className="text-xs md:text-sm leading-relaxed text-[#5C5B56] max-w-xl space-y-4 px-4 font-sans font-light">
                <p>
                  <strong>등재자 :</strong> {korStudent} &amp; {japStudent}
                </p>
                
                <p className="indent-3 font-serif italic text-justify text-[#43423E] bg-[#F8F7F2] p-4 rounded-2xl border border-[#E8E6DF]">
                  &ldquo; {content} &rdquo;
                </p>

                <p className="border-t border-[#E8E6DF] pt-4 leading-relaxed font-sans mt-2">
                  위 공동 연구자들은 한해 고유 영토인 독도의 1차 역사 사료를 교차 고찰하고, 사실의 무게 위에 조국의 감정 벽을 뛰어넘어 평화 상생이 가득한 교과서 본문을 성실히 공동 창안 저술하였음을 증명합니다.
                </p>
              </div>

              {/* Seal signatures details row */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md border-t border-[#E8E6DF] pt-6 mt-6 pb-2 font-serif">
                <div className="text-left pl-6">
                  <span className="text-[9px] text-[#A5A58D] block uppercase font-mono">Date of Registry / 승인 일시</span>
                  <span className="text-xs text-[#43423E] font-medium block">2026년 05월 30일</span>
                </div>
                <div className="text-right pr-6">
                  <span className="text-[9px] text-[#A5A58D] block uppercase font-mono">신고 및 지도교사 마크</span>
                  <div className="flex justify-end items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-[#6B705C] font-bold italic">{evaluator}</span>
                    <span className="text-[9px] bg-red-100/60 border border-red-200 text-red-800 rounded-full py-0.5 px-1.5 text-center leading-none font-bold scale-90">인 (印)</span>
                  </div>
                </div>
              </div>

              {/* Buttons for interactive closure */}
              <div className="flex gap-4 mt-8 w-full z-10 font-sans">
                <button
                  onClick={() => alert('본 증서와 집필 교과서를 프린트 출력하기 위해 브라우저 PDF 변환 드라이버를 준비 중입니다. (시연 테스트 작동)')}
                  className="flex-1 py-3 bg-[#6B705C] hover:bg-[#5A5E4E] text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer size={13} />
                  인쇄 / PDF 저장
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="flex-1 py-3 bg-[#E8E6DF] hover:bg-[#D6D3C9] text-[#43423E] text-xs font-semibold rounded-full transition-colors"
                >
                  등재 창 닫기
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
