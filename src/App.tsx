/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HeroHeader from './components/HeroHeader';
import GeographyLesson from './components/GeographyLesson';
import HistoryArchive from './components/HistoryArchive';
import ModernTimeline from './components/ModernTimeline';
import ClassWorkbook from './components/ClassWorkbook';
import InteractiveDocChat from './components/InteractiveDocChat';
import KnowledgeQuiz from './components/KnowledgeQuiz';
import SovereigntyReflection from './components/SovereigntyReflection';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('geo');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'geo':
        return <GeographyLesson />;
      case 'history':
        return <HistoryArchive />;
      case 'modern':
        return <ModernTimeline />;
      case 'workbook':
        return <ClassWorkbook />;
      case 'chat':
        return <InteractiveDocChat />;
      case 'quiz':
        return <KnowledgeQuiz />;
      case 'reflection':
        return <SovereigntyReflection />;
      default:
        return <GeographyLesson />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#43423E] flex flex-col font-sans selection:bg-[#6B705C]/20 selection:text-[#353530]">
      
      {/* 1. Header Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Hero Section Header */}
      <HeroHeader activeTab={activeTab} />

      {/* 3. Main Stage Content Panel */}
      <main className="flex-1 px-6 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          {renderActiveTabContent()}
        </div>
      </main>

      {/* 4. Heritage Botanical Footer */}
      <footer className="mt-auto px-6 lg:px-16 py-8 border-t border-[#E8E6DF] flex flex-col sm:flex-row justify-between items-center bg-[#F8F7F2] text-center sm:text-left gap-4">
        <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-[10px] uppercase tracking-widest text-[#A5A58D] font-mono font-semibold">
          <span>Est. 2026</span>
          <span className="hidden sm:inline">•</span>
          <span>독도 영토 주권 교육 아카이브</span>
          <span className="hidden sm:inline">•</span>
          <span>전후 평화 공조 수호 보고서</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[#A5A58D] font-mono font-semibold">
          &copy; 대한민국 역사·지리 평화교육위원회
        </div>
      </footer>
    </div>
  );
}
