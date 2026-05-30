/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Sparkles, HelpCircle, RefreshCw, User, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  isFallback?: boolean;
}

const PRESET_QUESTIONS = [
  {
    q: "태정관 지령이 왜 일본 측 고유영토 주장을 정면 반박하는 증거인가요?",
    short: "태정관 지령의 의의"
  },
  {
    q: "울릉도와 오키섬에서 독도 육안 관측 여부의 지리적 의의는 무엇인가요?",
    short: "육안 관측성과 거리 분석"
  },
  {
    q: "대한제국 칙령 제41호와 일본 시마네현 고시의 선후 관계를 알고 싶어요.",
    short: "칙령 제41호 vs 시마네현 고시"
  },
  {
    q: "샌프란시스코 강화조약 2조에서 왜 독도 명칭이 누락되었으며 팩트는 무엇인가요?",
    short: "샌프란시스코 조약 누락의 팩트"
  }
];

export default function InteractiveDocChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: '안녕하세요! 대한민국 역사·지리 평화교육위원회 독도 아카이브 AI 융합 보조 교사입니다. 고문서 증거, 고지도 대비, 지리적 원리 기반의 학술적 질문에 친절하고 사실(Fact) 중심으로 대답해 드립니다. 궁금하신 사료나 한일 주장 대조를 질문해 보세요.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Map history format safely
      const history = messages
        .filter(m => m.text !== messages[0].text) // filter first greeting out for cleaner api context
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });

      if (!res.ok) {
        throw new Error('서버 통신에 실패했습니다.');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.text,
        isFallback: data.isFallback 
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: '오류가 발생해 답변을 불러오지 못했습니다. (서버 연결 실패 또는 타임아웃). 대안으로 교재 데이터베이스 기반 로컬 답변을 찾아보실 수 있습니다.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: '안녕하세요! 대한민국 역사·지리 평화교육위원회 독도 아카이브 AI 융합 보조 교사입니다. 고문서 증거, 고지도 대비, 지리적 원리 기반의 학술적 질문에 친절하고 사실(Fact) 중심으로 대답해 드립니다. 궁금하신 사료나 한일 주장 대조를 질문해 보세요.'
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[580px] border border-[#E8E6DF] rounded-[32px] bg-white overflow-hidden shadow-sm" id="interactive-chat-widget">
      {/* Header bar */}
      <div className="bg-[#F8F7F2] border-b border-[#E8E6DF] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#6B705C] flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="font-serif italic text-sm font-semibold text-[#353530]">AI 학술 수호 교육 어시스턴트</h4>
            <p className="text-[10px] text-[#A5A58D] font-mono tracking-wider">GEOGRAPHY & HISTORY AI SCHOLAR</p>
          </div>
        </div>
        <button 
          onClick={handleResetChat}
          className="p-2 text-[#A5A58D] hover:text-[#6B705C] transition-colors rounded-full hover:bg-white border border-transparent hover:border-[#E8E6DF]"
          title="대화 초기화"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Preset prompt helper badges */}
      <div className="px-5 pt-3.5 pb-2 border-b border-[#F2EFE9] bg-[#FDFCF7]">
        <p className="text-[10px] font-bold text-[#A5A58D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle size={12} /> 빠른 사료 팩트 검증 질문 선택
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pq.q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full border border-[#E8E6DF] bg-white text-[#5C5B56] hover:bg-[#F8F7F2] hover:border-[#6B705C] hover:text-[#353530] transition-all text-left truncate max-w-[280px] disabled:opacity-50"
            >
              {pq.short}
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 bg-[#FCFBF7] space-y-4"
      >
        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.role === 'user' ? 'bg-[#A5A58D] text-white' : 'bg-[#6B705C] text-white font-serif italic'
                }`}>
                  {m.role === 'user' ? <User size={13} /> : 'B'}
                </div>
                
                <div className="flex flex-col">
                  <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm font-sans ${
                    m.role === 'user'
                      ? 'bg-[#6B705C] text-white rounded-tr-none'
                      : 'bg-white text-[#43423E] border border-[#E8E6DF] rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                  
                  {m.isFallback && m.role === 'assistant' && (
                    <span className="text-[9px] text-[#A5A58D] mt-1.5 flex items-center gap-1 font-mono">
                      <ShieldAlert size={10} className="text-amber-600" /> 로컬 오프라인 사료 검색 모델 가동 중
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-2.5 items-center pl-1">
                <div className="w-7 h-7 rounded-full bg-[#6B705C] text-white font-serif italic flex items-center justify-center text-xs animate-pulse">
                  B
                </div>
                <div className="bg-white border border-[#E8E6DF] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A5A58D] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A5A58D] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A5A58D] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
        className="p-3 bg-white border-t border-[#E8E6DF] flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="독도 지리적 최단거리, 대한제국 칙령 41호 등에 대해 입력해보세요..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-full text-xs text-[#43423E] border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] placeholder-[#A5A58D]"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-[#6B705C] hover:bg-[#5A5E4E] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
