/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, BookOpen, Clock, Edit3, MessageCircle, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const navItems = [
    { id: 'geo', label: 'Chapter 01. 지리와 영역', icon: Compass },
    { id: 'history', label: 'Chapter 02. 역사와 사료', icon: BookOpen },
    { id: 'modern', label: 'Chapter 03. 현대사/수호공조', icon: Clock },
    { id: 'workbook', label: 'Chapter 04. 평화 활동지', icon: Edit3 },
    { id: 'chat', label: 'AI 학술 도우미', icon: MessageCircle },
    { id: 'quiz', label: '주권 인증 테스트', icon: HelpCircle },
  ];

  return (
    <nav className="flex flex-col lg:flex-row justify-between items-center px-6 lg:px-16 pt-8 pb-4 border-b border-[#E8E6DF] bg-[#FDFCF7]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-4 lg:mb-0 cursor-pointer" onClick={() => setActiveTab('geo')}>
        <div className="w-9 h-9 rounded-full bg-[#6B705C] flex items-center justify-center text-white font-serif italic text-lg shadow-sm">
          독
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-base lg:text-lg tracking-tight text-[#353530]">독도 주권 교육 종합 아카이브</span>
          <span className="text-[9px] text-[#A5A58D] uppercase tracking-[0.2em] font-mono">Territorial Sovereignty Education</span>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full border transition-all ${
                isActive
                  ? 'bg-[#6B705C] text-white border-[#6B705C]'
                  : 'text-[#5C5B56] border-[#E8E6DF] hover:bg-[#F8F7F2] hover:border-[#A5A58D]'
              }`}
            >
              <IconComp size={12} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
