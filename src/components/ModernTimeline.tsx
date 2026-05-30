/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { timelineEvents } from '../data';
import { Clock, ShieldCheck, HelpCircle, ArrowRight, BookOpen, Anchor } from 'lucide-react';

export default function ModernTimeline() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'POST_WAR' | 'DEFENSE' | 'CONFLICT' | 'AGREEMENT'>('ALL');

  const filteredEvents = activeFilter === 'ALL' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === activeFilter);

  const filters = [
    { id: 'ALL', label: '전체 사건 연표' },
    { id: 'POST_WAR', label: '연합국 전후 복원' },
    { id: 'DEFENSE', label: '평화 안착 수호' },
    { id: 'CONFLICT', label: '외교 대치 갈등' },
    { id: 'AGREEMENT', label: '협약/체결 영속' }
  ];

  return (
    <div className="space-y-12">
      
      {/* Category selector row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E6DF] pb-5">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#6B705C]" />
          <h3 className="font-serif text-2xl text-[#353530] italic">현대 주권 연표와 역사적 복원선</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#F8F7F2] p-1 border border-[#E8E6DF] rounded-full">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 text-[10px] font-bold rounded-full transition-all uppercase tracking-wider ${
                activeFilter === f.id
                  ? 'bg-[#6B705C] text-white'
                  : 'text-[#5C5B56] hover:bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Timeline on left, Special educational cards on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Timeline Axis (8 cols) */}
        <div className="lg:col-span-8 space-y-6 relative pl-6 border-l border-[#E8E6DF] ml-3">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt, idx) => (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative bg-white border border-[#E8E6DF] rounded-[28px] p-6 hover:shadow-sm transition-all"
              >
                {/* Node dot on line */}
                <div className="absolute left-[-31px] top-[30px] w-[11px] h-[11px] rounded-full bg-white border-2 border-[#6B705C] z-10"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif italic font-bold text-lg text-[#6B705C]">{evt.year}</span>
                    {evt.date && <span className="text-[10px] text-[#A5A58D] font-mono font-semibold bg-[#F8F7F2] px-2 py-0.5 rounded border border-[#E8E6DF]">{evt.date}</span>}
                  </div>
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold bg-[#6B705C]/10 text-[#6B705C] px-3 py-1 rounded-full border border-[#6B705C]/10">
                    {evt.badge}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#353530] mb-2">{evt.title}</h4>
                <p className="text-xs text-[#5C5B56] leading-relaxed font-light">{evt.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Informative Side Panels (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Volunteer guards focus block */}
          <div className="border border-[#CBD8CB] rounded-[36px] p-6 bg-[#E6ECE6]/50 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 text-[#2C4A2C] mb-3">
              <ShieldCheck size={16} />
              <h4 className="font-serif text-base font-bold italic">독도의용수비대의 영웅담</h4>
            </div>
            <p className="text-xs leading-relaxed text-[#5C5B56] mb-4 font-light">
              6·25 전쟁의 포화 속에서 국가 정규 방위 능력이 독도까지 닿지 못하던 혼란기에, 홍순칠 대장을 원류로 울릉도 전역 군인 출신 청년들이 결성한 <strong>독도의용수비대(1953~1956)</strong>는 지고한 가치를 지닙니다.
            </p>
            <div className="bg-white/80 border border-[#CBD8CB]/60 p-3.5 rounded-2xl text-[11px] text-[#2C4A2C]">
              <strong>가짜 나무 대포 설치 :</strong> 침범하던 일본 순시선을 위협하기 위해 통나무를 시커멓게 깎아 해안 포대 자리에 설치해 속이며, 몸과 화기를 보태어 독도의 실효적 지배를 평화적으로 연장 수호했습니다.
            </div>
          </div>

          {/* Fisheries agreement debunking panel */}
          <div className="border border-[#CECBD8] rounded-[36px] p-6 bg-[#EAE8F2]/40 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 text-[#342C4F] mb-3">
              <Anchor size={16} />
              <h4 className="font-serif text-base font-bold italic">신한일어업협정 오해 해소</h4>
            </div>
            <p className="text-xs leading-relaxed text-[#5C5B56] mb-4 font-light">
              1998년 신한일어업협정 조인 타결로 독도 근해가 어업 <strong>\'중간수역\'</strong>으로 설정되자 "독도의 영유권을 스스로 양보했거나 훼손시켰다"는 오해가 대중에 퍼지기도 했습니다.
            </p>
            <div className="bg-white/80 border border-[#CECBD8]/60 p-3.5 rounded-2xl text-[11px] text-[#342C4F] space-y-1.5">
              <p><strong>국제법상 팩트 체크 :</strong></p>
              <p className="leading-relaxed">
                어업협정은 해양 배수자원(물고기 조업)의 구역을 배정한 조약일 뿐이며, 영유 수권 주권 경계 획정과는 국제법상 무관합니다. 대한민국 헌법재판소 역시 본 협정이 독도 영유권의 어떠한 법적 영향도 주지 않음을 분명히 확인했습니다.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
