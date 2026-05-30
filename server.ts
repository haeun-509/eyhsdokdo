/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY가 설정되어 있지 않습니다.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: '메시지 내용이 필요합니다.' });
      return;
    }

    let client: GoogleGenAI;
    try {
      client = getAiClient();
    } catch (keyError: any) {
      // Fallback response for offline / missing API key
      console.warn('Gemini API key is not configured. Falling back to local educational response model.');
      const simulatedResponse = getLocalResponse(message);
      res.json({
        text: `[안내: API 키가 입력되어 있지 않습니다. 교재 데이터베이스 답변을 불러옵니다.]\n\n${simulatedResponse}`,
        isFallback: true
      });
      return;
    }

    const systemInstruction = `
당신은 '대한민국 역사·지리 평화교육위원회'에서 개발한 독도 영토 주권 교육 특화 AI 학술 어시스턴트입니다.
제공된 중·고등학교 역사 및 지리 융합 수업 보조 교재를 기반으로, 학생들과 교사들의 학술적인 질문에 대하여 사료적 팩트를 바탕으로 조목조목 친절하게 대답해야 합니다.

현명하고 논리적이며 평화 지향적이고 교육적인 톤을 끝까지 유지하세요. 감정적인 구호나 무조건적인 비난을 배제하고 사실(Fact) 중심의 서술과 국제법적, 지리적 원리를 위주로 한층 학술적으로 분석하여 한글로 설명하세요.

핵심 참조 지식:
1. 지리적 위치: 동도 북위 37°14'26.8", 동경 131°52'10.4". 울릉도에서 독도까지 87.4km (맑은 날 고지대 육안 관측 완벽히 가능, 영토 지각의 단초). 일본 오키섬에서는 157.5km로 지구 곡률 한계상 관측 불가능.
2. 영소권 삼요소: 영토(경북 울릉군 울릉읍 독도리 1~96번지, 행정 영토), 영해(기선 12해리, 완전한 수권 해역 선포), 영공(대한민국 방공식별구역 KADIZ 포함), EEZ(배타적 경제수역 정보).
3. 한국 측 사료:
   - 세종실록지리지(1454년): "우산(독도)과 무릉(울릉도)... 날씨가 맑으면 바라볼 수 있다" -> 관측 조건 명시
   - 신증동국여지승람(1531년) & 팔도총도: 뚜렷이 존재하는 두 섬 명문화 및 부속 지도로 증명
   - 만기요람(1808년): "울릉과 우산은 우산국 땅, 우산은 왜인이 말하는 송도(마쓰시마)"
   - 대한제국 칙령 제41호(1900년 10월 25일): 울도군 격상 및 관할 구역에 '석도(독도)' 포함 명제화 (일본 1905년 무단 편입 시도보다 5년 앞섬)
4. 일본 측 고백 사료:
   - 은주시청합기(1667년): 일본 서북 경계를 오키섬으로 제한, 독도와 울릉도는 조선 영토로 기재
   - 조선국 교제시말 내탐서(1870년): 메이지 외무성이 독도가 조선 영역으로 귀속된 전말을 보고서에 수록
   - 태정관 지령(1877년): 메이지 최고 행정기관인 태정관이 "울릉도 외 일도(독도)는 일본과 관계없음을 명심할 것"을 하달
5. 고지도: 팔도총도(조선 관찬), 개정 일본여지로정전도(1779, 양국 영토 채색 대조 시 독도 무색 투명화), 삼국접양지도(1785, 황색 조선 표기 및 '조선의 것' 명기)
6. 현대사: SCAPIN 제677호(1946년, 독도를 일본 영토 통치선에서 명확히 제외), 이승만 평화선(1952년), 독도의용수비대 수호 활동(1953~1956년), 신한일어업협정(1998년, 중간수역 설정 배경과 오키섬 기점 설정).

질문자가 친근하고 지적으로 느낄 수 있도록 자세하고 정확한 학술 논거를 들어 답변해 주시기 바랍니다.
    `;

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6
        }
      });

      res.json({
        text: response.text,
        isFallback: false
      });
    } catch (apiError: any) {
      console.warn('Gemini API calling failed, falling back gracefully:', apiError);
      const simulatedResponse = getLocalResponse(message);
      res.json({
        text: `[원격 AI 오류 보고: ${apiError.message || apiError}]\n\n* 대안으로 탑재된 지리·사료 데이터베이스 검색 결과를 전해드립니다:\n\n${simulatedResponse}`,
        isFallback: true
      });
    }
  } catch (error: any) {
    console.error('Gemini API Route Error:', error);
    res.status(500).json({ error: error.message || '서버 에러가 발생했습니다.' });
  }
});

// AI Reflection Generator API Endpoint
app.post('/api/generate-reflection', async (req, res) => {
  try {
    const { keywords, topic, tone, author, school } = req.body;

    if (!keywords || !keywords.trim()) {
      res.status(400).json({ error: '키워드를 입력해주십시오.' });
      return;
    }

    let client: GoogleGenAI;
    try {
      client = getAiClient();
    } catch (keyError: any) {
      console.warn('Gemini API key is not configured. Falling back to local educational helper to write reflection.');
      const simulatedReflection = getLocalSimulatedReflection(keywords, topic, tone, author);
      res.json({
        title: `"${keywords.split(',')[0]}" 중심의 주권 성찰과 교훈`,
        content: simulatedReflection,
        isFallback: true
      });
      return;
    }

    const toneDescription = {
      scholarly: '학술적 이성 톤 (문헌 증거, 관찬 사료, 차가운 팩트와 정량적 분석 중심)',
      peace: '평화와 조화 톤 (한일 미래 세대 간 갈등 극복, 동해 평화, 화합과 연대)',
      patriotic: '영토 수호 의지 톤 (조국 영공·영해·영권 수호, 의용수비대의 헌신, 수호 자부심)',
      future: '미래 지향적 상생 톤 (과거사 정합을 바탕으로 한 건설적이고 함께 도약하는 상생 지지)'
    }[tone] || '학술적 이성 톤';

    const systemInstruction = `
당신은 '대한민국 역사·지리 평화교육위원회'의 수석 교육 자문관이자 수석 문장가입니다.
사용자가 제공한 핵심 키워드(Keywords)들을 융합하여, 감정 편향을 배제하고 사실에 기초한 깊이 있고 유려한 "독도 영토 주권 교육 소감문"을 작성해 주십시오.

요구사항:
1. 문맥의 분위기는 다음 지정된 톤을 철저하게 따르십시오: [${toneDescription}].
2. 탐구 소주제는 [${topic}] 입니다.
3. 작성자의 이름은 [${author}], 소속 기관은 [${school}] 입니다. 이들의 배움 노력을 빛내 줄 격조 높은 어조를 적용하십시오.
4. 사용자가 제공한 키워드: [${keywords}] 들을 문장 속에 매우 자연스럽고 유기적으로 포함해 문장을 구성하세요.
5. 단순한 감상에 그치지 않고, 지리적 사실(울릉도-독도 가시성)이나 공인 사료(태정관 지령, 대한제국 칙령 41호 등) 중 관련된 역사적 지식을 연계하여 깊이 있는 성찰을 보여주는 200~300자 내외의 한국어 단락으로 반환해야 합니다.
6. 응답형식은 반드시 다음 속성을 지닌 JSON 객체여야 합니다:
{
  "title": "여기에 소감문에 걸맞은 학술적이거나 시적인 국문 제목을 적으세요",
  "content": "여기에 생성된 소감문 본문 내용을 줄바꿈을 포함해 작성하세요.(200-300자 내외)"
}
7. 부연 설명이나 다른 텍스트 없이 오직 JSON 형식만을 정확히 출력하십시오.
    `;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `키워드: "${keywords}", 소주제: "${topic}", 분위기: "${tone}", 작성자: "${author} (${school})"`,
        config: {
          systemInstruction,
          temperature: 0.8,
          responseMimeType: 'application/json'
        }
      });

      try {
        const resultObj = JSON.parse(response.text?.trim() || '{}');
        res.json({
          title: resultObj.title || `${keywords.split(',')[0]} 탐구에 관한 주권 성찰`,
          content: resultObj.content || '소감문을 생성하지 못했습니다. 다시 조율해 주십시오.',
          isFallback: false
        });
      } catch (parseErr) {
        console.warn('JSON parsing failed. Raw response:', response.text);
        res.json({
          title: `${keywords.split(',')[0]} 중심의 주권 성찰`,
          content: response.text || '소감문을 생성하지 못했습니다. 다시 조율해 주십시오.',
          isFallback: false
        });
      }
    } catch (apiError: any) {
      console.error('Reflection Gemini API Error:', apiError);
      const simulatedReflection = getLocalSimulatedReflection(keywords, topic, tone, author);
      res.json({
        title: `"${keywords.split(',')[0]}" 중심의 주권 성찰과 교훈 (로컬 버전)`,
        content: `[원격 AI 오류 보고: ${apiError.message || apiError}]\n\n* 대안으로 탑재된 로컬 고안 성찰문을 작성해 드립니다:\n\n${simulatedReflection}`,
        isFallback: true
      });
    }

  } catch (error: any) {
    console.error('Reflection Generation Error:', error);
    res.status(500).json({ error: error.message || '소감문 생성 중 서버 에러가 발생했습니다.' });
  }
});

// Local simulated reflection generator when API Key is missing/offline
function getLocalSimulatedReflection(keywords: string, topic: string, tone: string, author: string): string {
  const kwList = keywords.split(',').map(k => k.trim());
  const kwSentence = kwList.length > 0 ? `특히 내가 탐구하고자 기조를 세웠던 주요 개념어인 [${kwList.join(', ')}]를 관조하면서 한층 성숙한 시각을 가질 수 있었습니다.` : '';
  
  let baseContent = '';
  if (tone === 'scholarly') {
    baseContent = `이번 교육을 통해 사료 학습 및 문헌적 사실들이 영토 주권을 지탱하는 주춧돌임을 절감하였습니다. 역설을 담은 선전보다는 확실히 공인되고 대조된 고문서 기록이 가장 정합적인 진실을 보여준다는 것을 느꼈고, 특히 [${topic}]의 고찰 범위가 넓음을 깨달았습니다. ${kwSentence} 앞으로 단순한 감성에 의지한 외침이 아니라 신뢰도 높은 이성으로 주권을 증명하는 자랑스러운 지성인이 되겠습니다.`;
  } else if (tone === 'peace') {
    baseContent = `갈등 관계에 있는 역사의 한 페이지를 볼 때 대립보다는 미래 평양성에 기댄 학술적 화합의 가치를 우선 보살피게 되었습니다. [${topic}]이라는 주제는 동해바다의 평온한 영해선처럼 양국이 한 점 부끄럼 없이 실증된 사료에 의해 진실로 동반 성장의 내일을 여는 시작점이라고 생각합니다. ${kwSentence} ${author || '성찰자'}로서 상호 존중의 약속을 마음에 새기고 한일 간 지적 대화의 다리가 되길 고대합니다.`;
  } else if (tone === 'patriotic') {
    baseContent = `조국의 한 뼘 영산인 독도의 국토 수호 의지와 그 속에 깃든 독립 정신의 소중함을 마음에 굵직하게 새겼습니다. 대한제국 칙령 제41호 등으로 확고히 정무 사법화한 주권을 지켜온 선열분들과 독도의용수비대의 뜨거운 헌신을 되짚는 가운데 큰 울림을 받았고, [${topic}] 역시 우리 주권사의 불멸의 대지임을 배웠습니다. ${kwSentence} 앞으로도 영토 수호의 자긍심을 품고 이 땅의 보루가 되겠습니다.`;
  } else {
    baseContent = `다가오는 차세대 오케이션 아래 한일 청소년들의 건설적인 동반성장과 상생이야말로 가치 탐구의 정점이 될 것입니다. 갈등을 부추기는 요인들을 명학한 진실을 토대로 함께 해소하고, [${topic}]의 유산에서 영감을 얻어 내일의 진일보한 지구촌 평화 가치를 함께 구현하겠습니다. ${kwSentence}`;
  }
  return baseContent;
}

// Robust Local Fallback Educational DB response if Gemini API key lacks
function getLocalResponse(msg: string): string {
  const norm = msg.toLowerCase();
  
  if (norm.includes('태정관') || norm.includes('지령') || norm.includes('1877')) {
    return `[교육위원회 아카이브 시스템 기설 팩트 답변]
태정관 지령(1877년 3월)은 일본 메이지 최고 국정 결정 기구인 태정관이 사리 깊은 영속 검증 끝에 내무성에 하달한 일 공식 문서입니다. 
당시 내무성이 "동해 울릉도와 독도를 일본 소속 지적에 포함해야 하는가" 물었을 때, 태정관은 "조선국 영역이었던 죽도(울릉도) 외 1도(독도)의 건은 일본과 아무런 하등 관계가 없는 곳이니 일본 국경 지적에서 완전 제외하라"고 하달하였고, '기죽도약도'라는 실무 지도가 함께 처분되어 첨부되었습니다. 

이는 "에도 시대부터 일본이 고유 영토로 인지했다"는 현대 일본 측 고위 주장을 물색없이 허무는 가장 권위 있는 결정적 일본 관찬 사주입니다.`;
  }
  
  if (norm.includes('거리') || norm.includes('울릉도') || norm.includes('관측') || norm.includes('오키')) {
    return `[교육위원회 아카이브 시스템 기설 팩트 답변]
지리학과 역사학에서 '육안 관측 가능성'은 영토 자각의 시원이자 주권 정합성의 핵심 단서입니다.
- 울릉도와 독도 거리: 약 87.4 km입니다. 이 거리는 동쪽 맑은 날(연간 약 40~50일) 사동 고개나 석포 능선에서 독도의 쌍둥이 우산봉 형태가 또렷이 사람 눈(육안)으로 관찰됩니다. 때문에 예로부터 울릉도 거주민들이 동쪽 바다 끝 섬을 자연스러운 생활권의 일부로 인식해 우산국 영토로 복속해 왔습니다.
- 일본 오키섬과 독도 거리: 약 157.5 km입니다. 이 거리는 지구 표면의 둥근 한계(곡률 한계) 때문에 수평선 아래 하속하므로, 기상이 세계 최고 수준으로 맑은 날이라 하더라도 날 절대 사람이 볼 수 없습니다. 

따라서 일본인들은 고대 내지 중세에 자연스러운 시각 인지가 불가능해 인위적이고 계획적인 장거리 원정 도해를 통해서만 독도를 찾아갈 수 있었던 바, 자연적 고유 인지 구역에서 원천 제외됩니다.`;
  }

  if (norm.includes('칙령') || norm.includes('고종') || norm.includes('41호') || norm.includes('1900') || norm.includes('석도')) {
    return `[교육위원회 아카이브 시스템 기설 팩트 답변]
1900년 10월 25일에 대한제국 고종 황제가 결재 반포한 "대한제국 칙령 제41호"는 독도의 근대 정무 주권을 명포한 가장 큰 한국 법률 사료입니다. 
당시 중앙 정부는 울릉도를 독립적 지위인 '울도군'으로 격상해 지방관 군수를 두고, 관할 구역 범주에 '울릉전도, 죽도, 그리고 석도(石島)'를 명기하였습니다. '석도'는 당시 한글 훈독 '돌섬'을 한자식으로 채용한 독도의 고칭입니다.

이는 일본이 러일전쟁 군사 팽창기에 러시하게 독도를 "주인 없는 땅(무주지)"이라고 치부해 감행한 1905년의 시마네현 고시 제40호보다 무려 5년이나 앞서, 근대 국가로서 최고 법령으로 영유권을 규명하고 사법화 조치했음을 엄숙히 명확히 증명하는 획기적 근대 기득권입니다.`;
  }

  if (norm.includes('안용복') || norm.includes('1693') || norm.includes('1696')) {
    return `[교육위원회 아카이브 시스템 기설 팩트 답변]
안용복 선생은 17세기 후반(조선 숙종 시대) 동해에 침투하여 불법 조업을 일삼던 일본 어민들과 영토 도해 문제를 단죄하기 위해 목숨을 걸고 일본 호키주(돗토리현)로 건너가 직접 담판을 지은 역사적 전설의 조선 어민 외교 전사입니다.
- 그의 헌신과 폭풍 가시화된 주권 담판에 타격을 받은 에도 막부는 1695년 돗토리번에 "울릉도와 독도가 번의 관할인가"라는 구체적 질의서를 하달했습니다.
- 돗토리번은 현명하게도 "두 섬은 본 번 및 일본의 소속이 아닙니다"라는 정식 답변인 "돗토리번 답변서(1695년)"를 제출했습니다.
- 이를 계기로 에도 막부는 1696년 1월, 일본 어민들에게 울릉도와 독도 방향의 도해와 항해 조업을 전면 불허하는 "도해 금지령"을 사법 처분 전격 하달하며 조선의 완전한 동해 주권을 외교 실적으로 추종 승인했습니다.`;
  }

  if (norm.includes('강화조약') || norm.includes('샌프란시스코') || norm.includes('scapin') || norm.includes('677')) {
    return `[교육위원회 아카이브 시스템 기설 팩트 답변]
2차 세계 대전 종전 직후 한반도의 영유권 복원은 연합국 결정에 따라 순차적이고 공고하게 매듭지어졌습니다.
- SCAPIN 제677호(1946년 1월 29일): 연합국 최고사령관 지령에 의해, 군정 아래 패망한 일본의 주권 관할 경계 획정이 이루어졌습니다. 이때 울릉도, 제주도와 함께 독도(Liancourt Rocks)를 명문으로 일본의 영주/점유 관할에서 완전 배제하여 대한민국에 귀속시키도록 선서 처리했습니다.
- 샌프란시스코 평화 조약(1951년 9월 8일): 최종 조약문 제2조 a항에 "일본은 한국의 독립을 인정하고 제주도, 거문도, 울릉도를 포함한 한국에 대한 모든 권리를 포기한다"고 명시되었는데, 이때 대표적인 섬들만 열거되다 보니 수만 개의 부속 도서 중 하나인 '독도' 명칭이 문자상으로 생략되었습니다.

일본의 현대 외무성은 이 문구상의 생략을 틈타 독도가 자국 영토로 존속해 남았다고 왜곡하지만, 전후 처리 조약의 기본 가치인 카이로 선언(일본이 폭력과 탐욕으로 약탈한 영토의 전면 박속) 및 선행적 SCAPIN 결정적 조치에 근거해 독도가 한국 영속 영토 구역으로 환속된 것은 번복 불가능한 전후 법적 정량입니다.`;
  }

  if (norm.includes('어업') || norm.includes('중간수역') || norm.includes('1998')) {
    return `[교육위원회 아카이브 시스템 기설 팩트 답변]
1998년 체결된 '신한일어업협정'은 배타적 경제수역(EEZ)의 도래와 밀접한 역사적 맥락을 지니고 있습니다.
1994년 UNCLOS(유엔해양법공식협약)가 시행되면서 자국 연안으로부터 최대 200해리까지 배타적 해상 권리를 행사하는 EEZ 시대가 열렸으나, 동해의 총 폭은 400해리 이하이므로 한일 간 EEZ가 어지럽게 중첩되었습니다.

영해 기점을 획정하면서 우리 측은 울릉도를 점유 기준으로 기조화했고, 일본 측은 오키섬을 기점으로 지정했으며 이에 독도가 그 사이 영해 분계 한가운데에 놓이게 되었습니다. 양국은 해상 자원 및 조업권 대립을 속히 타결해야 했으므로, 정무 주권 영유권과는 별개로 순수 '어업 수역 이익에 관한 잠정 구획'으로 독도 근해를 공동의 '중간수역'으로 지정하는 합의를 마쳤습니다.

이로 인해 "독도 주권 침해가 우려된다"는 여론의 강렬한 저항에 직면하기도 했으나, 헌법재판소 판시에 따라 이는 순수하게 어업 자원의 이용 한계를 배정해 타결한 '어업 협정' 조약일 뿐 영토 영유 주권의 사법 귀속에는 손톱만큼의 전파 영향도 미치지 않는다는 판정을 유지하고 있습니다.`;
  }

  return `반갑습니다! 대한민국 역사·지리 평화교육위원회 어시스턴트입니다. 
지리적 사실, 역사적 고문서, 고지도의 시각 대조 및 현대사 극복 팩트를 학술적으로 조망해 드립니다.

관심 있는 역사의 한 페이지를 질문해 보세요:
- 1차시: "울릉도에서 독도와 오키섬 간 가시성 차이와 의의"
- 2차시: "태정관 지령과 삼국접양지도의 ‘조선의 것’ 글귀의 뜻"
- 3차시: "대한제국 칙령 제41호와 일본 시마네현 고시 제40호의 선후 법적 관계"
- 4차시: "신한일어업협정에서 독도가 중간수역에 놓인 배경"`;
}

// Dev server Setup & Production serving configs
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
