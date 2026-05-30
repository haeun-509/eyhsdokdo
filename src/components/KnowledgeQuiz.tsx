/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { quizQuestions } from '../data';
import { Award, HelpCircle, ArrowRight, CheckCircle2, XCircle, RefreshCw, Star, Info } from 'lucide-react';

export default function KnowledgeQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const activeQuestion = quizQuestions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isSubmitted) return;
    
    setIsSubmitted(true);
    if (selectedOpt === activeQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsSubmitted(false);

    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  // Determine honorific title based on score
  const getSovereigntyTitle = () => {
    if (score === 4) {
      return {
        title: '독도 영토 주권 명예박사',
        abbr: 'D.Dokdo (Honorary Degree)',
        desc: '역사 사료문헌과 법적 선후 관계 및 지리학 이론을 완벽하게 파지하고 있는 1급 학술 수호 전사로 임명합니다.',
        color: 'bg-[#6B705C] text-white border-[#6B705C]'
      };
    } else if (score >= 2) {
      return {
        title: '독도 평화역사 수호연구원',
        abbr: 'Dokdo Peace Scholar',
        desc: '대부분의 사료 비교 및 역사적 의의를 훌륭히 설명할 수 있는 탁월한 지성을 보유하고 있습니다.',
        color: 'bg-[#A5A58D] text-white border-[#A5A58D]'
      };
    } else {
      return {
        title: '독도 해양 탐사대원',
        abbr: 'Ocean Cadet Explorer',
        desc: '지정과 지질 사료적 학습을 조금만 더 연마하면 동해 영속 주권 수호대의 주역이 될 자격이 충분합니다.',
        color: 'bg-zinc-600 text-white border-zinc-600'
      };
    }
  };

  const titleMeta = getSovereigntyTitle();

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="border border-[#E8E6DF] rounded-[40px] p-8 bg-white/70 shadow-sm relative overflow-hidden"
          >
            {/* Header / Progress bar */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono tracking-widest font-bold text-[#A5A58D] uppercase">
                주권 지식 검증 / Question {currentIdx + 1} of {quizQuestions.length}
              </span>
              <div className="w-24 h-1 bg-[#F2EFE9] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#6B705C] transition-all duration-300" 
                  style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question title text */}
            <h3 className="font-serif text-xl text-[#353530] font-bold leading-relaxed mb-6">
              {activeQuestion.question}
            </h3>

            {/* Options list */}
            <div className="space-y-3.5 mb-6">
              {activeQuestion.options.map((opt, idx) => {
                let btnStyle = 'border-[#E8E6DF] bg-white text-[#43423E] hover:bg-[#F8F7F2]';
                
                if (selectedOpt === idx) {
                  btnStyle = 'border-[#6B705C] bg-[#6B705C]/5 text-[#353530] font-medium';
                }

                // Color choices upon submission
                if (isSubmitted) {
                  if (idx === activeQuestion.correctAnswerIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (selectedOpt === idx) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                  } else {
                    btnStyle = 'border-[#E8E6DF] bg-white text-[#A5A58D] opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-xs text-left transition-all flex items-center justify-between group disabled:cursor-default ${btnStyle}`}
                  >
                    <span className="leading-relaxed flex-1 pr-4">{opt}</span>
                    <div className="shrink-0 flex items-center">
                      {isSubmitted && idx === activeQuestion.correctAnswerIndex && <CheckCircle2 size={16} className="text-emerald-700 font-bold" />}
                      {isSubmitted && selectedOpt === idx && selectedOpt !== activeQuestion.correctAnswerIndex && <XCircle size={16} className="text-rose-700" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation box under submit */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#F8F7F2] border border-[#E8E6DF] rounded-2xl p-4 mb-6 text-left"
              >
                <span className="text-[9px] uppercase font-mono font-bold text-[#6B705C] tracking-wide block mb-1 flex items-center gap-1">
                  <Info size={11} /> 학과적 사료 해설 해독
                </span>
                <p className="text-xs leading-relaxed text-[#5C5B56]">
                  {activeQuestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Action buttons footer */}
            <div className="flex justify-end pt-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="px-6 py-2.5 bg-[#43423E] hover:bg-[#353530] text-white text-xs font-bold rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>정답 제출하기</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-[#6B705C] hover:bg-[#5A5E4E] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
                >
                  <span>{currentIdx + 1 === quizQuestions.length ? '종합 성적표 보기' : '다음 문항 보기'}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

          </motion.div>
        ) : (
          /* RESULT SCREEN OF THE QUIZ WITH CREDENTIAL HONORS */
          <motion.div
            key="results-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-[#6B705C]/35 rounded-[44px] p-8 md:p-12 bg-[#FDFCF7] shadow-lg text-center flex flex-col items-center relative overflow-hidden font-serif"
          >
            <div className="absolute inset-4 border border-[#E8E6DF] rounded-[28px] pointer-events-none"></div>

            {/* Rosette emblem of honors */}
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center mb-6 relative">
              <Star size={32} className="text-amber-500 fill-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="absolute bottom-[-6px] left-[50%] translate-x-[-50%] bg-[#A5A58D] text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded-full uppercase">SCORE</span>
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A5A58D] font-bold block">Course Completion Certificate</span>
            <h2 className="text-xl md:text-2xl font-serif text-[#353530] font-bold mt-2 mb-1">독도 주권 지식 수강 성적 결과</h2>
            <p className="text-3xl font-mono text-[#6B705C] font-black tracking-wide my-3">{score} / {quizQuestions.length} 문항 정답</p>

            {/* Honor Medal Frame */}
            <div className="my-6 border border-[#E8E6DF] bg-white rounded-3xl p-6 max-w-md w-full relative">
              <span className="text-[9px] uppercase font-mono text-[#A5A58D] font-bold block mb-1">인증 칭호 수여</span>
              <h4 className="font-bold text-[#353530] text-lg mb-0.5">{titleMeta.title}</h4>
              <p className="text-[10px] text-[#A5A58D] font-mono tracking-widest font-bold uppercase mb-3">{titleMeta.abbr}</p>
              <p className="text-xs text-[#5C5B56] leading-relaxed font-sans font-light px-2">
                {titleMeta.desc}
              </p>
            </div>

            <p className="text-[11px] text-[#A5A58D] max-w-sm leading-relaxed mb-6 font-sans font-medium">
              이로써 본인은 대한민국 역사·지리 평화교육위원회에 의해, 역사적 진실과 실증 사료에 기초해 우리 부속 도서 독도를 끝까지 지키는 명예 주권 서언에 보조를 마쳤음을 인증합니다.
            </p>

            <button
              onClick={handleRetakeQuiz}
              className="py-3 px-8 text-xs font-bold bg-[#6B705C] hover:bg-[#5A5E4E] text-white rounded-full transition-colors flex items-center gap-1.5 font-sans"
            >
              <RefreshCw size={13} />
              테스트 다시 세팅하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
