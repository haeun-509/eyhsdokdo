/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { getLocalResponse } from '../src/lib/schoolDb.js';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY가 설정되어 있지 않거나 비어있습니다.');
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // Support both Express req/res (for local development) and Serverless function execution (Vercel)
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST requests only' });
    return;
  }

  try {
    const { message, history } = req.body || {};

    if (!message) {
      res.status(400).json({ error: '메시지 내용이 필요합니다.' });
      return;
    }

    let client: GoogleGenAI;
    try {
      client = getAiClient();
    } catch (keyError: any) {
      console.warn('Gemini API key is missing or placeholder. Running fallback local DB.');
      const simulatedResponse = getLocalResponse(message);
      res.status(200).json({
        text: `[학술 도우미 안내: 현재 API 키가 설정되지 않았거나 활성화 대기 중입니다. 기설 탑재된 국문 사료 데이터베이스 검색 결과를 제공합니다.]\n\n${simulatedResponse}`,
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
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6
        }
      });

      res.status(200).json({
        text: response.text || '답변을 빈 결과로 수신하였습니다.',
        isFallback: false
      });
    } catch (apiError: any) {
      console.error('Gemini API calling failed, falling back gracefully:', apiError);
      const simulatedResponse = getLocalResponse(message);
      res.status(200).json({
        text: `[원격 AI 연결 실패: ${apiError.message || apiError}]\n\n* 대안으로 탑재된 지리·사료 데이터베이스 검색 결과를 전해드립니다:\n\n${simulatedResponse}`,
        isFallback: true
      });
    }
  } catch (error: any) {
    console.error('Gemini API Route Error:', error);
    res.status(500).json({ error: error.message || '서버 에러가 발생했습니다.' });
  }
}
