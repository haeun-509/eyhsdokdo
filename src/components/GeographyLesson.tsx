/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { locationDetails, distances, territoryElements } from '../data';
import { Globe, ArrowRight, Eye, EyeOff, Navigation, Info, Sun, CloudRain } from 'lucide-react';

export default function GeographyLesson() {
  const [visibility, setVisibility] = useState<number>(65); // Default 65% visibility

  // Earth Curvature Analysis:
  // Horizon limit formula: Distance = 3.57 * (sqrt(h1) + sqrt(h2)) km
  // Ulleungdo peak (e.g. 석포 고지대 200m or 성인봉 984m) -> easily see Dokdo peak (168.5m).
  // From Oki Island (peak 321m) to Dokdo (168.5m) is 157.5km.
  // The extreme physical line-of-sight limit is far below 150km even with standard atmospheric refraction,
  // meaning earth curvature completely blocks light rays from Dokdo to Oki Island!
  // This simulator visualizes this scientific reality.

  const isUlleungdoVisible = visibility >= 45; // Visible starting at 45% haze clearance
  const isOkiVisible = false; // Always invisible due to earth's curvature!

  return (
    <div className="space-y-12">
      {/* Grid: Coordinates & Specific Area Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Geography Card */}
        <div className="lg:col-span-1 flex flex-col border border-[#E8E6DF] rounded-[40px] p-8 bg-white/50 relative overflow-hidden" id="geo-coordinates-card">
          <div className="absolute right-6 top-6 text-[#6B705C]/15 select-none animate-pulse">
            <Globe size={110} strokeWidth={1.5} />
          </div>
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#6B705C] mb-4">Location & Coordinates</span>
          <h3 className="font-serif text-2xl lg:text-3xl mb-6 italic text-[#353530] font-bold">지리적 좌표와 명세서</h3>
          
          <div className="space-y-5">
            <div className="border-b border-[#E8E6DF] pb-3">
              <span className="text-xs text-[#6B705C] font-mono block uppercase font-bold mb-1">Latitude / 북위 위도</span>
              <span className="font-serif text-lg text-[#353530] font-bold">{locationDetails.latitude}</span>
            </div>
            <div className="border-b border-[#E8E6DF] pb-3">
              <span className="text-xs text-[#6B705C] font-mono block uppercase font-bold mb-1">Longitude / 동경 경도</span>
              <span className="font-serif text-lg text-[#353530] font-bold">{locationDetails.longitude}</span>
            </div>
            <div className="border-b border-[#E8E6DF] pb-3">
              <span className="text-xs text-[#6B705C] font-mono block uppercase font-bold mb-1">Total Area / 구성 면적</span>
              <span className="font-serif text-lg text-[#353530] font-bold">{locationDetails.areaTotal}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-3">
              <div>
                <span className="text-xs text-[#6B705C] font-mono block uppercase font-bold mb-1">동도 면적</span>
                <span className="text-sm text-[#353530] font-bold">{locationDetails.areaEast}</span>
              </div>
              <div>
                <span className="text-xs text-[#6B705C] font-mono block uppercase font-bold mb-1">서도 면적</span>
                <span className="text-sm text-[#353530] font-bold">{locationDetails.areaWest}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-[#6B705C] font-mono block uppercase font-bold mb-1">부속 도서 수</span>
              <span className="text-sm text-[#353530] font-extrabold bg-[#6B705C]/10 px-2.5 py-1 rounded-md inline-block mt-0.5">보조 암초 및 도서 총 {locationDetails.subIslandsCount}개</span>
            </div>
          </div>
        </div>

        {/* Dynamic Earth Curvature & Horizon Simulator Column */}
        <div className="lg:col-span-2 flex flex-col border border-[#E8E6DF] rounded-[40px] p-8 bg-white/70" id="geo-horizon-simulator">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#6B705C] mb-4">Scientific Demonstration</span>
          <h3 className="font-serif text-2xl lg:text-3xl mb-2 italic text-[#353530] font-bold">지구 곡률기반 육안 관측 불가능성 검증</h3>
          <p className="text-sm text-[#353530] leading-relaxed mb-6 font-normal">
            역사적으로 동해 거주민들이 독도를 "마음에 품고 자연히 영속 주권"을 다진 배경에는 울릉도에서의 <strong>육안 관측 가능성</strong>이 있습니다. 지구 곡률과 거리를 고려하여 기상 조건에 따른 독도 관찰성을 실증해 보십시오.
          </p>

          {/* Visibility Index Slider */}
          <div className="mb-6 bg-[#F8F7F2] p-4 rounded-2xl border border-[#E8E6DF]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <label className="text-sm font-bold text-[#353530] flex items-center gap-1.5 select-none">
                {visibility < 40 ? <CloudRain size={16} className="text-slate-600 animate-pulse" /> : <Sun size={16} className="text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />}
                <span>대기 투명성 및 기상 조건 지수 (Haze Clearance): <strong className="text-lg text-[#6B705C]">{visibility}%</strong></span>
              </label>
              <span className="text-xs font-mono font-bold text-[#6B705C] bg-[#6B705C]/5 px-2 py-0.5 rounded-full border border-[#6B705C]/20">
                {visibility < 45 ? "안개와 미세먼지로 바다 흐림" : visibility < 75 ? "부분 맑음 (평균 수평 시야)" : "완벽한 고기압 고정 시야"}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={visibility}
              onChange={(e) => setVisibility(Number(e.target.value))}
              className="w-full h-2 bg-[#E8E6DF] rounded-lg appearance-none cursor-pointer accent-[#6B705C]"
            />
          </div>

          {/* Visual SVG curvature box */}
          <div className="flex-1 min-h-[220px] bg-[#E7EBE8]/30 border border-[#CBD8CB]/60 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
            
            {/* Horizon Graphic area */}
            <div className="relative w-full h-[140px] border-b border-[#6B705C]/45 flex items-end justify-between select-none">
              
              {/* Ulleungdo side */}
              <div className="flex flex-col items-center z-10">
                <div className="w-16 h-14 bg-gradient-to-t from-[#6B705C] to-[#A5A58D] rounded-t-full relative flex items-center justify-center">
                  <span className="text-[11px] text-white font-mono font-bold">울릉도</span>
                  <div className="absolute top-[-12px] text-[10px] bg-white px-1.5 py-0.5 border border-[#E8E6DF] rounded font-mono text-[#353530] font-bold">h=984m</div>
                </div>
                <span className="text-xs text-[#6B705C] font-bold mt-1">거리 87.4km</span>
              </div>

              {/* Dokdo Middle (The Target) */}
              <div className="flex flex-col items-center justify-end h-full z-10 pb-0 shrink-0">
                <div className="relative flex flex-col items-center">
                  {/* Dokdo Peaks (East & West) in Silhouette */}
                  <motion.div 
                    animate={{ 
                      opacity: isUlleungdoVisible ? (visibility / 100) : 0,
                      filter: `blur(${Math.max(0, (100 - visibility) / 20)}px)`
                    }}
                    className="flex gap-1.5 items-end transition-all"
                  >
                    {/* West island */}
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#353530] to-[#5C5B56] rounded-t-md relative">
                      <span className="absolute bottom-1 right-1 text-[9px] text-white/90 font-mono font-bold">서</span>
                    </div>
                    {/* East island */}
                    <div className="w-8 h-8 bg-gradient-to-tl from-[#353530] to-[#5C5B56] rounded-t-[5px] relative">
                      <span className="absolute bottom-1 left-1 text-[9px] text-white/90 font-mono font-bold">동</span>
                    </div>
                  </motion.div>
                  
                  {/* Status Indicator bubble */}
                  <div className="absolute bottom-11 bg-white px-3 py-1 rounded-full border border-emerald-500 text-xs font-bold shadow-md whitespace-nowrap">
                    {isUlleungdoVisible ? (
                      <span className="text-emerald-800 flex items-center gap-1"><Eye size={12} /> 울릉도에서 또렷이 육안 관장</span>
                    ) : (
                      <span className="text-slate-600 flex items-center gap-1"><EyeOff size={12} /> 기상 불량으로 은폐</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#353530] font-serif italic mt-1.5 font-bold">독도 (h=168.5m)</span>
              </div>

              {/* Japanese Oki Island side */}
              <div className="flex flex-col items-center z-10">
                <div className="w-16 h-10 bg-gradient-to-t from-slate-400 to-slate-300 rounded-t-full relative flex items-center justify-center opacity-70">
                  <span className="text-[11px] text-[#43423E] font-mono font-bold">오키섬</span>
                  <div className="absolute top-[-12px] text-[10px] bg-white px-1.5 py-0.5 border border-[#E8E6DF] rounded font-mono text-slate-700 font-bold">h=321m</div>
                  {/* Red block symbolizing curvature blockade */}
                  <div className="absolute inset-0 bg-red-900/10 rounded-t-full flex items-center justify-center">
                    <span className="text-[9px] text-red-800 font-bold tracking-tighter">곡률 은폐</span>
                  </div>
                </div>
                <span className="text-xs text-[#A5A58D] font-bold mt-1">거리 157.5km</span>
              </div>

            </div>

            {/* Curvature Comparison Text details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5 mt-2 bg-white/70 p-4 rounded-2xl border border-[#CBD8CB]/20">
              <div className="text-left md:border-r border-[#CBD8CB]/60 md:pr-4">
                <span className="text-[11px] uppercase font-mono text-[#6B705C] font-extrabold block mb-1">울릉도 방면 (87.4km)</span>
                <p className="text-xs leading-relaxed text-[#353530]">
                  빛의 굴절과 해발 984m 성인봉의 환절 효과로 인해 수평선 아래 가려지지 않고 <strong>연중 맑은 날 언제나 또렷이 육안으로 지각</strong>됩니다. 역사적으로 독도가 한반도의 자각 영토였던 지리학적 모태입니다.
                </p>
              </div>
              <div className="text-left md:pl-2">
                <span className="text-[11px] uppercase font-mono text-rose-800 font-extrabold block mb-1">일본 오키섬 방면 (157.5km)</span>
                <p className="text-xs leading-relaxed text-[#353530]">
                  지구 곡률에 밀린 시각 간섭으로 <strong>기압이 극단적으로 맑은 날에도 절대 독도가 수평선 위로 떠오르지 않습니다.</strong> 즉, 계획적인 나침반 독해와 함선 여행 없이는 인지조차 불가한 별도의 타국 영지였습니다.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Grid: 3 Pillars of Territory Concept Panels */}
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <Globe size={22} className="text-[#6B705C]" />
          <h3 className="font-serif text-2xl lg:text-3xl text-[#353530] italic font-bold">국가 주권 영역의 3요소와 독도</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {territoryElements.map((el, i) => (
            <div key={i} className={`border rounded-[32px] p-6 flex flex-col justify-between ${el.bgColor} shadow-md`}>
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#6B705C] font-mono">Element 0{i+1}</span>
                <h4 className="font-serif text-xl font-bold mt-1.5 mb-2 text-[#353530]">{el.type}</h4>
                <p className="text-xs leading-relaxed text-[#353530] font-mono font-semibold opacity-90 italic mb-4">{el.definition}</p>
              </div>
              <div className="border-t border-black/10 pt-4 mt-auto">
                <p className="text-sm leading-relaxed font-sans text-stone-900 font-medium">{el.dokdoStatus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Card: Beautiful Korean Road Address Registry */}
      <div className="border border-[#E8E6DF] rounded-[36px] p-8 bg-[#F8F7F2] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6" id="geo-address-banner">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-1.5 bg-white border border-[#E8E6DF] py-1 px-3 rounded-full w-fit">
            <Navigation size={13} className="text-[#6B705C]" />
            <span className="text-xs font-mono uppercase font-bold text-[#6B705C]">대한민국 법정 도로명 주소 기설</span>
          </div>
          <h4 className="font-serif text-xl lg:text-2xl text-[#353530] font-bold">경북 울릉군 울릉읍 독도리 1~96번지</h4>
          <p className="text-sm text-[#353530] leading-relaxed max-w-xl font-normal">
            독도는 국토지리정보원에 의해 정식 지번 등기가 설정되어 있습니다. 또한 영토 수호 역사 인물의 이름을 딴 <strong>독도이사부길(East Island)</strong>과 <strong>독도안용복길(West Island)</strong>이라는 실제 도로명 주소가 선명히 부여되어 운용되고 있습니다.
          </p>
        </div>

        <div className="flex gap-4 shrink-0">
          <div className="border border-[#E8E6DF] rounded-2xl bg-white p-5 text-center w-[150px] flex flex-col justify-between shadow-md">
            <span className="text-xs text-[#6B705C] font-mono font-extrabold block mb-1">동도 주도로</span>
            <span className="font-serif text-lg font-bold text-[#6B705C]">이사부길</span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Dokdoisabu-gil</span>
          </div>

          <div className="border border-[#E8E6DF] rounded-2xl bg-white p-5 text-center w-[150px] flex flex-col justify-between shadow-md">
            <span className="text-xs text-[#6B705C] font-mono font-extrabold block mb-1">서도 주도로</span>
            <span className="font-serif text-lg font-bold text-[#6B705C]">안용복길</span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Dokdoanyongbok-gil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
