/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, PenTool, CheckCircle2, Bookmark, Trash2, Printer, Award, Sparkles, BookOpen } from 'lucide-react';

interface Reflection {
  id: string;
  title: string;
  author: string;
  school: string;
  topic: string;
  content: string;
  tone: 'scholarly' | 'peace' | 'patriotic' | 'future';
  date: string;
  isSystem?: boolean; // System-prepopulated ones that shouldn't be deleted
}

const PRESETS = [
  {
    placeholder: '사료를 기초로 역사적 권원을 설명하는 글',
    title: '태정관 지령과 대한제국 칙령 제41호가 밝히는 진실',
    content: '그동안 독도가 우리 땅인 이유를 감정적으로만 외쳤던 저의 태도를 반성하게 되었습니다. 메이지 시대의 국가 최고 사법/정무 기관이었던 일본 태정관이 스스로 "독도는 일본과 무관한 땅"이라고 명문화한 태정관 지령을 직접 사료로 확인하고 나니, 어떤 수치화된 허위 주장 앞에서도 흔들리지 않을 확신이 생겼습니다. 무조건적인 미움보다는 양국 관찬 사료의 역사적 팩트를 공유하고 올바르게 교차 대조함으로써 지속 가능한 평화의 길을 닦는 노력이 미래 세대에게 시급함을 깨달았습니다.',
  },
  {
    placeholder: '지리적 상식을 바탕으로 한 성찰글',
    title: '울릉도에서 정동측으로 거리를 가늠하며 느낀 영토 인식',
    content: '우리가 흔히 무의식적으로 노래 가사로 외우던 "울릉도 동남쪽 물길 따라 이백리"의 무게를 이번 학술 교육을 통해 지리학적 실증으로 알게 되었습니다. 일본 오키섬과의 거리는 157.5km나 되는 반면, 울릉도에서는 불과 87.4km에 불과해 아주 맑은 날에도 육안으로 확연히 가시권에 도달하는 유일한 섬이 독도라는 사실은 삼국사기의 신라 영토 편입 기사가 결코 우연이나 창작이 아니었음을 증명합니다. 지리적 최단 접근성은 독도를 대하는 옛 조상들의 고유 영토 인지 구조를 투명하게 비춰 줍니다.',
  },
  {
    placeholder: '한일 청소년 상생과 미래 공존을 제창하는 글',
    title: '과거사의 올바른 정리와 미래 한·일 청소년들의 동해 평화 협력',
    content: '러일전쟁 중 일본 군부의 야욕으로 국권 강탈 단계에서 무단 침범당한 독도를 6·25 전쟁의 포화 속에서도 맨몸으로 사수해낸 독도의용수비대의 통나무 대포 이야기가 가슴 뭉클했습니다. 다케시마의 날 조례 제정이나 교과서 서술 논란 등 일본의 일방적 주장도 결국 과거 제국주의 시대의 반성적 사료 대조를 통해 청산될 수 있는 오해라고 믿습니다. 양국의 우수한 청소년들이 상생 활동지를 함께 메워 가듯 역사의 팩트 위에서 평화로운 미래를 함께 설계하는 진정한 주역이 되겠습니다.',
  }
];

const PRE_LOADED_REFLECTIONS: Reflection[] = [
  {
    id: 'ref-1',
    title: '사료의 이성이 주는 영토 주권의 흔들림 없는 확신',
    author: '이영서',
    school: '한국 민족사관화합고 2학년',
    topic: '학술적 사료와 문헌 근거',
    content: '막연히 애국심에만 기댔을 때는 일본 측 우익 세력의 정교하게 다듬어진 선전 문구를 목격했을 때 심장이 덜컥 내려앉기도 했습니다. 하지만 1877년 태정관 지령 원문을 한 글자 한 글자 해석하며 조선 소유 영토를 확인한 순간, 진정한 영토 수호는 감정이 아닌 차가운 학술 사료 연구로부터 나옴을 뼈저리게 실감했습니다. 양국이 서로를 향한 비난을 거두고, 공인된 문서 대조를 통한 지적 합의를 시작하기를 기대합니다.',
    tone: 'scholarly',
    date: '2026-05-29',
    isSystem: true
  },
  {
    id: 'ref-2',
    title: '동해의 잔잔한 물결 위에 띄우는 한일 동반자의 약속',
    author: '사토 아키라 (佐藤 彰)',
    school: '일본 돗토리 현립 평화고 2학년',
    topic: '한일 청소년 평화 상생',
    content: '삼국통합도나 세키스이의 무색 지도 개정판 사료를 세심히 대조하는 한국 친구들의 진지한 자세에 감탄했습니다. 사실 일본 내 교육 과정에서는 다소 편향된 지적 배치를 학습하여 왔으나, 역사적 실증 지도가 기리키는 노란 조선령 표식(삼국통합도)은 부정할 수 없는 사실이었습니다. 비난에 휩쓸려 다투는 이웃 국가가 아니라, 정합적 진실을 손에 쥐고 손잡는 미래를 꿈꿉니다.',
    tone: 'peace',
    date: '2026-05-30',
    isSystem: true
  }
];

export default function SovereigntyReflection() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [school, setSchool] = useState('');
  const [topic, setTopic] = useState('학술적 사료와 문헌 근거');
  const [content, setContent] = useState('');
  const [tone, setTone] = useState<'scholarly' | 'peace' | 'patriotic' | 'future'>('scholarly');
  const [isPledged, setIsPledged] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const characterLimit = 1000;

  useEffect(() => {
    const saved = localStorage.getItem('dokdo_sovereignty_reflections');
    if (saved) {
      try {
        setReflections(JSON.parse(saved));
      } catch (e) {
        setReflections(PRE_LOADED_REFLECTIONS);
      }
    } else {
      setReflections(PRE_LOADED_REFLECTIONS);
      localStorage.setItem('dokdo_sovereignty_reflections', JSON.stringify(PRE_LOADED_REFLECTIONS));
    }
  }, []);

  const saveReflectionsToStorage = (newData: Reflection[]) => {
    setReflections(newData);
    localStorage.setItem('dokdo_sovereignty_reflections', JSON.stringify(newData));
  };

  const handleFillPreset = (index: number) => {
    const preset = PRESETS[index];
    setTitle(preset.title);
    setContent(preset.content);
    if (index === 0) setTone('scholarly');
    if (index === 1) setTone('patriotic');
    if (index === 2) setTone('future');
  };

  const handleGenerateAiReflection = async () => {
    if (!aiKeywords.trim()) return;

    if (!author.trim() || !school.trim()) {
      alert('AI 소감문 생성을 위해 먼저 작성 대표 성명과 소속 학교명을 입력해 주십시오.');
      return;
    }

    setIsGenerating(true);
    setAiMessage(null);

    try {
      const response = await fetch('/api/generate-reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: aiKeywords,
          topic,
          tone,
          author: author.trim(),
          school: school.trim()
        })
      });

      if (!response.ok) {
        throw new Error('소감문 생성 중 서버 응답 장애가 발생했습니다.');
      }

      const data = await response.json();
      setTitle(data.title || '');
      setContent(data.content || '');
      setAiMessage(
        data.isFallback
          ? '💡 로컬 사료 알고리즘을 빌려 성찰문을 작성했습니다.'
          : '✨ AI 주권 가치 어시스턴트가 입력된 키워드와 톤에 맞춰 입체적으로 성찰문을 완성했습니다!'
      );

      setAiKeywords('');

      setTimeout(() => {
        setAiMessage(null);
      }, 6000);
    } catch (error: any) {
      console.error(error);
      alert('소감문 생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !school.trim() || !content.trim() || !isPledged) {
      setAlertMessage('작성자 정보, 소감문 본문을 모두 채우고 명예 수호 및 평화 상양 서약에 동의해 주십시오.');
      return;
    }

    const newReflection: Reflection = {
      id: `ref-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      school: school.trim(),
      topic,
      content: content.trim(),
      tone,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newReflection, ...reflections];
    saveReflectionsToStorage(updated);

    // Reset Form (except personal details which can remain for helper value)
    setTitle('');
    setContent('');
    setIsPledged(false);
    setSelectedReflection(newReflection); // instantly open preview
    setAlertMessage('작성하신 소감문이 성공적으로 독도 학술 아카이브 벽에 등재되었습니다!');
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening detailed modal
    const target = reflections.find(r => r.id === id);
    if (target?.isSystem) {
      alert('대표 예비 사례 소감문은 보관상 임의로 지울 수 없습니다.');
      return;
    }
    const confirmed = window.confirm('해당 소감문을 아카이브 벽에서 내리시겠습니까?');
    if (confirmed) {
      const updated = reflections.filter(r => r.id !== id);
      saveReflectionsToStorage(updated);
      if (selectedReflection?.id === id) {
        setSelectedReflection(null);
      }
    }
  };

  const handlePrint = (ref: Reflection) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('브라우저에서 새 팝업/인쇄 창을 띄울 수 있도록 허용해 주십시오.');
      return;
    }

    const toneTitle = {
      scholarly: '학술적 이성의 톤 (Academic & Scholarly Truth)',
      peace: '평화와 조화의 톤 (Peace & Borderless Harmony)',
      patriotic: '조국 영토 수호의 톤 (Patriotic Integrity)',
      future: '미래 지향적 상생의 톤 (Future-Oriented Shared Legacy)'
    }[ref.tone];

    const logoMark = {
      scholarly: '✒️ 학술적 사실 실증 부문',
      peace: '🕊️ 평화적 미래 상생 부문',
      patriotic: '🛡️ 독도 영토 주권 수호 부문',
      future: '🌱 차세대 역량 동반성장 부문'
    }[ref.tone];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>독도의 날 기념 교육 소감문 - ${ref.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:ital,wght@1,600&family=Sunflower:wght@500;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #353530;
            background: #fff;
            padding: 40px;
            line-height: 1.8;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            border: 8px double #6B705C;
            padding: 40px;
            position: relative;
            background-image: radial-gradient(#6B705C10 1px, transparent 1px);
            background-size: 15px 15px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #E8E6DF;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          .sub {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #6B705C;
            font-weight: bold;
          }
          .title {
            font-family: serif;
            font-size: 26px;
            font-weight: bold;
            margin: 15px 0 5px 0;
            color: #2E3025;
          }
          .meta {
            text-align: right;
            font-size: 13px;
            color: #555;
            margin-bottom: 30px;
            border-bottom: 1px dashed #E8E6DF;
            padding-bottom: 15px;
          }
          .content {
            font-size: 14px;
            text-align: justify;
            text-indent: 20px;
            white-space: pre-line;
            color: #333;
            min-height: 250px;
          }
          .pledge {
            margin-top: 40px;
            background: #F8F7F2;
            border: 1px solid #E8E6DF;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            font-style: italic;
            text-align: center;
            color: #5C5B56;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            border-top: 1px solid #E8E6DF;
            padding-top: 25px;
            font-size: 12px;
            color: #888;
          }
          .seal {
            float: right;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 2px dashed #9E3A3A;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9E3A3A;
            font-weight: bold;
            font-size: 12px;
            margin-top: -20px;
            transform: rotate(-10deg);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="sub">HISTORICAL RECORD & INDEPENDENCE STUDY</div>
            <div class="title">${ref.title}</div>
            <div style="font-size: 12px; font-weight: bold; color: #6B705C; margin-top: 5px;">${logoMark} (${toneTitle})</div>
          </div>
          <div class="meta">
            <strong>작성 학교:</strong> ${ref.school} &nbsp;|&nbsp; <strong>저술 대표자:</strong> ${ref.author}<br />
            <strong>탐구 소주제:</strong> ${ref.topic} &nbsp;|&nbsp; <strong>등재 일자:</strong> ${ref.date}
          </div>
          <div class="content">
            ${ref.content}
          </div>
          <div class="pledge">
            "본 소감서의 작성자는 철저히 공인 문헌 사료적 팩트에 기인하여 영토 갈등을 종식하고,<br />
            대한민국의 동해 고유 영토 독도에 관한 학술 가치를 평화적인 인류 공조선에서 수호 수양할 것을 서약합니다."
          </div>
          <div class="footer">
            <div class="seal">인증필<br/>(印)</div>
            대한민국 역사·지리 평화교육위원회 아카이브 소감 등록서 <br />
            <span style="font-size: 10px; color: #aaa;">Sovereign Territory Action Initiative • Est. 2026</span>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const toneColors = {
    scholarly: {
      border: 'border-[#6B705C]',
      bg: 'bg-[#6B705C]/5',
      badgeBg: 'bg-[#6B705C]/10 text-[#6B705C] border-[#6B705C]/20',
      tag: '학술적 이성 톤'
    },
    peace: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500/5',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      tag: '평화와 조화 톤'
    },
    patriotic: {
      border: 'border-rose-700',
      bg: 'bg-rose-700/5',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      tag: '영토 수호 의지 톤'
    },
    future: {
      border: 'border-amber-600',
      bg: 'bg-amber-600/5',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      tag: '미래 지향적 상생 톤'
    }
  };

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="border border-[#E8E6DF] rounded-[40px] p-8 bg-white/50 shadow-sm" id="reflection-welcome-section">
        <span className="text-xs uppercase tracking-wider font-extrabold text-[#6B705C] mb-4 block">Reflective Legacy Entry</span>
        <h3 className="font-serif text-3xl mb-3 text-[#353530] italic font-bold">독도 주권 배움 소감문 저술관</h3>
        <p className="text-sm text-[#353530] max-w-4xl leading-relaxed font-normal">
          지식이 단순히 머무르는 것을 넘어, 스스로 가치를 발견하는 능력이 진정한 교육입니다. 고문헌 사료와 현대 법적 가치를 총망라하여 탐색하면서 가슴속에 일어난 울림과 성찰을 차분히 <strong>소감문(Reflection)</strong>으로 기록해 보세요. 양국이 공유할 만한 평화 공존의 목소리는 우리 영해를 지탱하는 보이지 않는 든든한 방벽이 됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Creation Form (7 cols) */}
        <div className="xl:col-span-7 bg-white border border-[#E8E6DF] rounded-[36px] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
            <span className="text-sm font-mono uppercase font-bold text-[#6B705C] flex items-center gap-2">
              <PenTool size={16} /> 새로운 주권 소감서 기록
            </span>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-xs font-bold text-[#6B705C] uppercase font-mono block mb-2">집필 참고용 아이디어 샘플 불러오기</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFillPreset(idx)}
                  className="text-left text-xs p-3 border border-[#E8E6DF] hover:border-[#6B705C] bg-[#FDFCF7] hover:bg-white rounded-2xl transition-all cursor-pointer font-sans font-medium flex flex-col justify-between h-[85px] group shadow-2xs"
                >
                  <span className="text-[#6B705C] font-extrabold block mb-1 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-600 shrink-0" />
                    예시 {idx + 1}
                  </span>
                  <span className="text-slate-500 font-bold group-hover:text-stone-800 line-clamp-2 leading-relaxed">
                    "{p.title}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Writer Metadata Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#6B705C] uppercase font-mono block mb-1.5">작성 및 저술 대표 성명</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 최하랑"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#353530] font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#6B705C] uppercase font-mono block mb-1.5">소속 기관 / 학교명 및 학년</label>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="예: 온양고등학교 2학년"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#353530] font-semibold"
                />
              </div>
            </div>

            {/* Title & Topic selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[#6B705C] uppercase font-mono block mb-1.5">소감문 제목</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하십시오..."
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#353530] font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#6B705C] uppercase font-mono block mb-1.5">선택 소주제 분류</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#353530] font-bold"
                >
                  <option value="지리적 특성 및 가시성">지리적 가시성과 최단거리</option>
                  <option value="학술적 사료와 문헌 근거">학술적 고문헌·사료 대조</option>
                  <option value="영토 의용대의 헌신">의용수비대 수호 극장</option>
                  <option value="한일 청소년 평화 상생">한일 미래 청소년 평화 공존</option>
                </select>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-xs font-bold text-[#6B705C] uppercase font-mono block mb-2">저술의 철학 및 색상 분위기 (Emotional Tone Accent)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.keys(toneColors) as Array<keyof typeof toneColors>).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTone(opt)}
                    className={`p-3.5 rounded-2xl border text-xs font-extrabold text-[#353530] flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer select-none ${
                      tone === opt
                        ? `${toneColors[opt].border} ${toneColors[opt].bg} ring-2 ring-offset-2 ring-stone-900`
                        : 'border-[#E8E6DF] bg-white hover:bg-[#F8F7F2]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${
                      opt === 'scholarly' ? 'bg-[#6B705C]' :
                      opt === 'peace' ? 'bg-emerald-500' :
                      opt === 'patriotic' ? 'bg-rose-700' : 'bg-amber-600'
                    }`}></span>
                    <span>{toneColors[opt].tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Auto-Writer Integration */}
            <div className="p-5 border border-dashed border-[#6B705C]/30 bg-[#FDFCF7]/80 rounded-3xl space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6B705C] uppercase font-mono">
                <Sparkles size={15} className="text-amber-600 animate-pulse" />
                <span>AI 소감 자동 집필 공방 (AI-Powered Studio)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                원하는 핵심 단어(예: <span className="font-mono bg-stone-200/60 px-1 py-0.5 rounded text-stone-700">태정관 지령, 가시성, 평화협력</span>)를 쉼표(,)로 구분해 기재하시면, 상단의 주제 분류와 철학 분위기에 완벽히 맞춰진 학술 조언 소감문을 즉석에서 다듬어 작성해 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="예: 대한제국 칙령 41호, 석도, 대한민국 영토, 평화 주권"
                  className="flex-1 text-xs px-4 py-3 rounded-xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-white text-stone-850 font-bold placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiReflection}
                  disabled={isGenerating || !aiKeywords.trim()}
                  className="px-5 py-3 text-xs font-semibold text-white bg-[#6B705C] hover:bg-[#5A5E4E] disabled:bg-stone-200 disabled:text-stone-400 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></span>
                      <span>AI 집필 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-amber-300" />
                      <span>초안 생성하기</span>
                    </>
                  )}
                </button>
              </div>
              {aiMessage && (
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-left animate-pulse">
                  {aiMessage}
                </div>
              )}
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#6B705C] uppercase font-mono block">소감 본문 서술 (학습 성찰 및 장기 선언)</label>
                <span className={`text-xs font-mono font-bold ${content.length > characterLimit ? 'text-red-600 font-extrabold' : 'text-[#6B705C]'}`}>
                  {content.length} / {characterLimit}자 제한
                </span>
              </div>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
                rows={9}
                placeholder="지리와 역사적 고찰 학습을 통하여 배우고 성찰한 올바른 주권 가치관을 주체적으로 작성하십시오. 감성 일변도 제어, 실증사료 중심 성찰, 동해와 동아시아 전체의 영구적인 상생 제안 등이 훌륭한 문맥을 이룹니다."
                className="w-full text-sm px-4 py-3.5 rounded-2xl border border-[#E8E6DF] focus:outline-none focus:border-[#6B705C] bg-[#FDFCF7] text-[#353530] leading-relaxed resize-none font-medium"
              ></textarea>
            </div>

            {/* Pledge Tick Box */}
            <div className="p-4 bg-[#F8F7F2] border border-[#E8E6DF] rounded-2xl">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPledged}
                  onChange={(e) => setIsPledged(e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 rounded text-[#6B705C] focus:ring-[#6B705C] cursor-pointer"
                />
                <div className="text-xs leading-relaxed text-stone-700 font-semibold text-left">
                  <span className="text-[#6B705C] font-extrabold">독도 학술 평화서 서약 (Pledge) :</span> 나는 감정 편향적 선동에 흔들리지 않으며, 철저히 사실에 입각한 1차 측량 지도와 고관 사료 팩트에 근거하여 주권적 논리를 이해하고, 한·일 평화의 미래를 책임질 건강한 주권 수호 청년이 될 것을 서약합니다.
                </div>
              </label>
            </div>

            {/* Action Submissions */}
            {alertMessage && (
              <div className="bg-[#6B705C]/10 border border-[#6B705C]/35 px-4.5 py-3 rounded-2xl text-xs font-bold text-[#6B705C] font-sans text-center">
                {alertMessage}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setAuthor('');
                  setSchool('');
                  setContent('');
                  setIsPledged(false);
                }}
                className="flex-1 py-4 text-sm font-bold text-[#43423E] border border-[#E8E6DF] rounded-full hover:bg-[#F8F7F2] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                지면 비우기
              </button>
              <button
                type="submit"
                disabled={!isPledged || !title.trim() || !author.trim() || !school.trim() || !content.trim()}
                className="flex-[2] py-4 text-sm font-extrabold text-white bg-[#6B705C] hover:bg-[#5A5E4E] rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Bookmark size={15} />
                공동 아카이브 벽 등재하기
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Archive Display Wall (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E6DF] rounded-[36px] p-6 shadow-sm">
            <span className="text-xs font-mono uppercase font-bold text-[#6B705C] tracking-wider block mb-1">Interactive Wall</span>
            <h4 className="font-serif text-lg font-bold text-[#353530] mb-3">등재 청소년 소감록 아카이브</h4>
            <p className="text-xs text-stone-600 leading-normal mb-5 font-medium">
              대한민국의 고유 영토 주권 교육을 이수하고 소감 성명을 등재한 청소년 및 지도 원사의 실제 등록된 기록 목록입니다. 클릭하여 전면 확대 및 인쇄 출력이 가능합니다.
            </p>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin">
              <AnimatePresence>
                {reflections.map((ref) => {
                  const style = toneColors[ref.tone] || toneColors.scholarly;
                  return (
                    <motion.div
                      key={ref.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedReflection(ref)}
                      className={`p-4 rounded-3xl border ${style.border} ${style.bg} hover:shadow-xs transition-all cursor-pointer group text-left relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${style.badgeBg}`}>
                          {style.tag}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePrint(ref); }}
                            className="p-1 rounded-full hover:bg-white border border-transparent hover:border-[#E8E6DF] text-stone-700 cursor-pointer"
                            title="개별 보관 출력"
                          >
                            <Printer size={13} />
                          </button>
                          {!ref.isSystem && (
                            <button
                              onClick={(e) => handleDelete(ref.id, e)}
                              className="p-1 rounded-full hover:bg-red-50 border border-transparent hover:border-red-200 text-red-600 cursor-pointer"
                              title="기록 소거"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <h5 className="font-serif font-extrabold text-sm text-[#353530] group-hover:text-[#6B705C] transition-colors line-clamp-1 mb-1">
                        {ref.title}
                      </h5>
                      <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed mb-3.5">
                        {ref.content}
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono font-bold border-t border-[#E8E6DF]/30 pt-2.5">
                        <span>{ref.school} • <strong>{ref.author}</strong></span>
                        <span>{ref.date}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Honor Certificate preview block if one is actively selected */}
          <AnimatePresence>
            {selectedReflection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FBF9F4] border-2 border-double border-[#6B705C] rounded-[40px] p-6 text-center relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full bg-[#6B705C]/5 border border-[#6B705C]/10 flex items-center justify-center pointer-events-none">
                  <Award size={64} className="text-[#6B705C]/10" />
                </div>
                
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#6B705C] mb-1.5 block">Certificate of Sovereignty Study</span>
                <h4 className="font-serif font-bold text-[#353530] text-lg mb-2">공식 등재 명예 학술 인증서</h4>
                
                <div className="bg-white border border-[#E8E6DF] rounded-2xl p-4 text-left font-serif space-y-3.5 my-4">
                  <div className="border-b border-dashed border-[#E8E6DF] pb-2 text-center text-xs font-bold text-stone-700">
                    저술자 : <span className="text-[#6B705C]">{selectedReflection.author}</span> ({selectedReflection.school})
                  </div>
                  
                  <div className="text-stone-800 text-xs leading-relaxed italic text-justify bg-[#F8F7F2] p-3 rounded-xl border border-[#E8E6DF] max-h-[140px] overflow-y-auto whitespace-pre-line font-medium leading-relaxed">
                    &ldquo; {selectedReflection.content} &rdquo;
                  </div>

                  <div className="text-[10px] font-sans font-semibold text-stone-600 leading-normal text-center border-t border-[#E8E6DF]/50 pt-2.5">
                    "상기 청소년은 대한제국 칙령 제41호등 실증 사료에 기반하여 올바른 가치와 평화 공존을 선언함으로써 독도 명예 수호단원으로 공식 등재되었음을 증명합니다."
                  </div>
                </div>

                <div className="flex gap-2 font-sans">
                  <button
                    onClick={() => handlePrint(selectedReflection)}
                    className="flex-1 py-2.5 bg-[#6B705C] hover:bg-[#5A5E4E] text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer size={13} />
                    인쇄 및 PDF 저장
                  </button>
                  <button
                    onClick={() => setSelectedReflection(null)}
                    className="py-2.5 px-4 bg-[#E8E6DF] hover:bg-[#D6D3C9] text-[#43423E] text-xs font-bold rounded-full transition-colors cursor-pointer"
                  >
                    확인 완료
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
