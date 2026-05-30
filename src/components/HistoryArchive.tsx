/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { historicalDocs, historicalMaps } from '../data';
import { BookOpen, Map, CheckCircle2, AlertTriangle, ArrowRightRight, Eye, ShieldCheck } from 'lucide-react';

export default function HistoryArchive() {
  const [docCategory, setDocCategory] = useState<'KOREA' | 'JAPAN'>('KOREA');
  const [selectedMapId, setSelectedMapId] = useState<string>('map-paldo');

  const filteredDocs = historicalDocs.filter(doc => doc.country === docCategory);
  const activeMap = historicalMaps.find(m => m.id === selectedMapId) || historicalMaps[0];

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: Documents Comparer */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#6B705C]" />
            <h3 className="font-serif text-2xl text-[#353530] italic">양국 관찬 사료 비교·대조 아카이브</h3>
          </div>

          {/* Symmetrical Category Switcher */}
          <div className="flex border border-[#E8E6DF] rounded-full p-1 bg-white shadow-sm shrink-0">
            <button
              onClick={() => setDocCategory('KOREA')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                docCategory === 'KOREA'
                  ? 'bg-[#6B705C] text-white'
                  : 'text-[#5C5B56] hover:bg-[#F8F7F2]'
              }`}
            >
              <CheckCircle2 size={13} />
              대한민국 주권 선포 문헌
            </button>
            <button
              onClick={() => setDocCategory('JAPAN')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                docCategory === 'JAPAN'
                  ? 'bg-rose-800 text-white'
                  : 'text-[#5C5B56] hover:bg-[#F8F7F2]'
              }`}
            >
              <AlertTriangle size={13} />
              일본 자백 배제 문헌
            </button>
          </div>
        </div>

        {/* Dynamic Card Stagger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDocs.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col border border-[#E8E6DF] rounded-[36px] p-6 bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden`}
              >
                {/* Visual Accent Layer */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${docCategory === 'KOREA' ? 'bg-[#6B705C]' : 'bg-rose-800'}`}></div>

                <div className="flex justify-between items-start mb-4 pt-1">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#A5A58D] uppercase tracking-wider block">문서 고유 식별 명기 / {doc.year}</span>
                    <h4 className="font-serif text-lg text-[#353530] font-bold mt-1">{doc.title}</h4>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                    docCategory === 'KOREA' 
                      ? 'bg-[#6B705C]/10 text-[#6B705C] border-[#6B705C]/20' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {docCategory === 'KOREA' ? '조선 칙령/지리지' : '일본 관방/고백'}
                  </span>
                </div>

                <div className="text-[10px] text-[#A5A58D] font-mono mb-2">
                  <strong>문헌 출처 :</strong> {doc.book}
                </div>

                {/* Original Document script */}
                <div className="bg-[#F8F7F2] border border-[#E8E6DF] rounded-2xl p-4 mb-4 select-all">
                  <p className="font-serif text-xs italic leading-relaxed text-[#5C5B56]">
                    &ldquo; {doc.originalText} &rdquo;
                  </p>
                </div>

                {/* Translation text */}
                <div className="mb-6">
                  <span className="text-[9px] uppercase font-mono font-bold text-[#A5A58D] block mb-1">우리말 완역 대조 (Translation)</span>
                  <p className="text-[12px] leading-relaxed text-[#43423E] font-medium font-sans">
                    {doc.translation}
                  </p>
                </div>

                {/* Historical Significance Block */}
                <div className={`mt-auto border-t border-[#F2EFE9] pt-4 ${docCategory === 'KOREA' ? 'bg-[#6B705C]/5' : 'bg-rose-50/50'} p-4 rounded-2xl`}>
                  <span className="text-[9px] uppercase font-mono font-bold text-[#A5A58D] tracking-wider block mb-1 flex items-center gap-1">
                    <ShieldCheck size={11} className={docCategory === 'KOREA' ? 'text-[#6B705C]' : 'text-rose-800'} />
                    학술적 실증 및 주권 검증력
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#43423E] font-sans">
                    {doc.significance}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: Map Viewer Comparison */}
      <div className="border border-[#E8E6DF] rounded-[40px] p-8 bg-white/60 shadow-sm" id="map-interactive-panel">
        <div className="flex items-center gap-2 mb-6">
          <Map size={18} className="text-[#6B705C]" />
          <h3 className="font-serif text-2xl text-[#353530] italic">고지도(Paleo-Map) 실증 대조 뷰어</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Nav Buttons list */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            {historicalMaps.map((map) => (
              <button
                key={map.id}
                onClick={() => setSelectedMapId(map.id)}
                className={`text-left p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  selectedMapId === map.id
                    ? 'bg-gradient-to-r from-[#F8F7F2] to-white border-[#6B705C] shadow-sm font-semibold'
                    : 'border-[#E8E6DF] hover:bg-[#F8F7F2]/50'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-serif text-sm text-[#353530]">{map.title}</span>
                  <span className="text-[10px] font-mono text-[#A5A58D]">{map.year}</span>
                </div>
                <div className="flex justify-between items-center w-full mt-1.5">
                  <span className="text-[9px] text-[#A5A58D] font-mono">{map.producer}</span>
                  <span className={`text-[8px] font-mono rounded-full px-2 py-0.5 border ${
                    map.country === 'KOREA' 
                      ? 'bg-[#6B705C]/10 text-[#6B705C] border-[#6B705C]/20' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {map.country === 'KOREA' ? '대한민국 관찬 전도' : '일본 고도서 부지도'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Map Visual Desk */}
          <div className="lg:col-span-8 flex flex-col border border-[#E8E6DF] rounded-3xl bg-[#F8F7F2] p-6 relative overflow-hidden justify-between">
            
            {/* Map Placeholder Graphic with rich metadata annotation */}
            <div className="relative w-full aspect-[16/9] rounded-2xl bg-white border border-[#E8E6DF] shadow-inner flex items-center justify-center p-6 mb-4 select-none">
              
              {/* Graphic Backdrop */}
              <div className="absolute inset-0 bg-[#E8E6DF]/20 opacity-40 mix-blend-multiply radial-grid-design"></div>

              {/* Dynamic Map Illustration mock based on selected map */}
              <div className="z-10 text-center max-w-lg space-y-3 p-4 border border-[#E8E6DF]/60 bg-white/90 rounded-2xl backdrop-blur-sm shadow-sm">
                
                {selectedMapId === 'map-paldo' && (
                  <>
                    <div className="w-14 h-14 rounded-full bg-[#6B705C]/10 border border-[#6B705C] mx-auto flex items-center justify-center">
                      <span className="font-serif italic font-bold text-lg text-[#6B705C]">팔도</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono px-2 py-0.5 border border-[#6B705C]/30 bg-[#6B705C]/10 text-[#6B705C] rounded-full uppercase font-bold">우산도(독도) 동시 기입</span>
                      <p className="text-xs text-[#5C5B56] leading-relaxed mt-2 font-serif font-semibold italic">"동해 바다 깊이 울릉도 정동측에 두 개의 섬(울릉과 우산)을 확연히 기입해 국가 관리로 규정"</p>
                    </div>
                  </>
                )}

                {selectedMapId === 'ja-roji' && (
                  <>
                    <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-400 mx-auto flex items-center justify-center">
                      <span className="font-serif italic text-lg text-slate-500">여지</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono px-2 py-0.5 border border-slate-300 bg-slate-100 text-slate-600 rounded-full uppercase font-bold">일본 판도 채색 무설정(투명)</span>
                      <p className="text-xs text-[#5C5B56] leading-relaxed mt-2 font-serif font-semibold italic">"막부 공인 제도사 세키스이가 수립 당시, 독도를 무색 투명하게 처리해 자국 국치선 밖 영역으로 규정"</p>
                    </div>
                  </>
                )}

                {selectedMapId === 'ja-samguk' && (
                  <>
                    <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-500 mx-auto flex items-center justify-center animate-pulse">
                      <span className="font-serif italic font-bold text-base text-amber-900">朝鮮ノ持</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono px-2 py-0.5 border border-amber-300 bg-amber-100 text-[#7C5A14] rounded-full uppercase font-extrabold">황색 조선령 표기 및 '조선의 것' 문자 기입</span>
                      <p className="text-xs text-[#5C5B56] leading-relaxed mt-2 font-serif font-semibold italic">"사료 지도상 독도를 노란색 조선 채색과 함께 조선지 소유(朝鮮ノ持)라고 직접 서명 표시"</p>
                    </div>
                  </>
                )}

              </div>

              {/* Stamp watermark */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 opacity-50">
                <span className="text-[8px] font-mono font-bold tracking-widest text-[#A5A58D]">SOVEREIGN ARCHIVE PLOT</span>
              </div>
            </div>

            {/* Explanatory texts details */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-[#353530] text-sm">{activeMap.title} 의 해설 및 시사점</h4>
              <p className="text-xs leading-relaxed text-[#5C5B56]">{activeMap.description}</p>
              
              <div className="bg-white/70 p-3 rounded-2xl border border-[#E8E6DF] mt-2">
                <span className="text-[9px] font-mono uppercase font-bold text-[#6B705C] block mb-0.5">정무적 판단 및 사법 수호 근거</span>
                <p className="text-[11px] leading-relaxed text-[#43423E]">{activeMap.significance}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
