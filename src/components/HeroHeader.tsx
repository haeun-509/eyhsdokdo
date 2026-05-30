/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeroHeaderProps {
  activeTab: string;
}

export default function HeroHeader({ activeTab }: HeroHeaderProps) {
  const getHeaderDetails = () => {
    switch (activeTab) {
      case 'geo':
        return {
          ch: 'Chapter 01',
          title: '지리적 특성과 영역의 이해',
          desc: '독도의 물리적 자각과 영역의 3요소(영토, 영해, 영공). 울릉도와 일본 오키섬에서의 거리 차이가 갖는 영토 인지의 기원적 차이를 조명합니다.'
        };
      case 'history':
        return {
          ch: 'Chapter 02',
          title: '사료와 지도로 규명하는 역사적 권원',
          desc: '세종실록지리지에서 대한제국 칙령 제41호까지의 국치 공고문헌과, 메이지 최고기구 ‘태정관 지령’ 및 지도 대조를 통해 독도가 명백한 한반도 고유 영역임을 입증합니다.'
        };
      case 'modern':
        return {
          ch: 'Chapter 03',
          title: '현대 독도 갈등의 전개와 상생의 길',
          desc: 'SCAPIN 677호의 전후 수지 조치부터 이승만 평화선, 민간 의용수비대의 헌신, 어업 조약 중간수역 쟁점 및 다케시마의 날 조례와 역사 왜곡을 극복하는 평화 평행 로드맵을 걷습니다.'
        };
      case 'workbook':
        return {
          ch: 'Chapter 04 / 수행 활동지',
          title: '한·일 평화 공동 역사교과서 집필관',
          desc: '감정적인 대립과 정형 왜곡을 극복하고, 양국 관찬 사료 팩트에 입각하여 평화 공존을 제창할 미래 교과서를 공동 저술하고 가상 심사 평가를 받아 봅니다.'
        };
      case 'chat':
        return {
          ch: '학술 교육 지원',
          title: '독도 주권 보조 AI 학술 연구실',
          desc: '가감 없는 양국 고문헌 자료들과 지리적 측량 실측치를 바탕으로 역사 지리 탐구 과정에서 마주치는 온갖 쟁점들을 일대일 학술적으로 심층 대화 대조합니다.'
        };
      case 'quiz':
        return {
          ch: '종합 주권 평가',
          title: '독도 영토 주권 박사 인증 시험',
          desc: '교육 과정을 총수강한 결과를 검정하는 다단계 퀴즈 프로그램입니다. 통과 시 독도 아카이브 공인 명예 수호 인장을 수여받습니다.'
        };
      case 'reflection':
        return {
          ch: 'Chapter 05 / 배움의 기록',
          title: '독도 주권 배움 소감문 저술관',
          desc: '축척된 사실의 검증과 이성적인 사료 고찰의 여정을 지나, 학생 및 명예 수호 원사들이 직접 깨닫고 성찰한 바를 정갈한 문맥의 소감문으로 등재하고 선언하는 전당입니다.'
        };
      default:
        return {
          ch: '독도 주권 교육',
          title: 'Cultivating Quiet Spaces',
          desc: '한반도 동쪽 바다 끝, 자연과 역사의 증거가 살아 숨 쉬는 우리 고유 영토 독도의 학술 전당입니다.'
        };
    }
  };

  const header = getHeaderDetails();

  return (
    <header className="px-6 lg:px-16 pt-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#FDFCF7]">
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-10 bg-[#6B705C]"></div>
          <span className="text-xs uppercase tracking-[0.15em] font-extrabold text-[#6B705C] font-mono">{header.ch}</span>
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl leading-[1.12] mb-4 text-[#353530] font-bold">
          {header.title.split(' ')[0]} <span className="italic text-[#6B705C] font-normal">{header.title.substring(header.title.indexOf(' ') + 1)}</span>
        </h1>
        <p className="text-sm md:text-base max-w-2xl leading-relaxed text-[#353530] font-normal">
          {header.desc}
        </p>
      </div>
      
      {/* Decorative Stamp Card */}
      <div className="hidden md:flex flex-col items-end border-l border-[#E8E6DF] pl-6 text-right select-none shrink-0">
        <span className="text-xs uppercase tracking-widest text-[#6B705C] font-mono font-bold">EST. 2026 / 아카이브 관인</span>
        <span className="font-serif italic text-sm text-[#6B705C] mt-1 font-semibold">대한민국 역사·지리 평화교육위원회</span>
        <span className="text-[11px] text-[#A5A58D] font-mono font-bold mt-0.5 tracking-wide">TERRITORIAL RIGHTS VERIFIED</span>
      </div>
    </header>
  );
}
