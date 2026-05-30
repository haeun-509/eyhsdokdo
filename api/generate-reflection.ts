/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { getLocalSimulatedReflection } from '../src/lib/schoolDb.js';

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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST requests only' });
    return;
  }

  try {
    const { keywords, topic, tone, author, school } = req.body || {};

    if (!keywords || !keywords.trim()) {
      res.status(400).json({ error: '키워드를 입력해주십시오.' });
      return;
    }

    let client: GoogleGenAI;
    try {
      client = getAiClient();
    } catch (keyError: any) {
      console.warn('Gemini API key is missing or placeholder. Running fallback local reflection generator.');
      const simulatedReflection = getLocalSimulatedReflection(keywords, topic, tone, author);
      res.status(200).json({
        title: `"${keywords.split(',')[0]}" 중심의 주권 성찰과 교훈 (로컬 빌드)`,
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
        model: 'gemini-2.5-flash',
        contents: `키워드: "${keywords}", 소주제: "${topic}", 분위기: "${tone}", 작성자: "${author} (${school})"`,
        config: {
          systemInstruction,
          temperature: 0.8,
          responseMimeType: 'application/json'
        }
      });

      try {
        const resultObj = JSON.parse(response.text?.trim() || '{}');
        res.status(200).json({
          title: resultObj.title || `${keywords.split(',')[0]} 탐구에 관한 주권 성찰`,
          content: resultObj.content || '소감문을 생성하지 못했습니다. 다시 조율해 주십시오.',
          isFallback: false
        });
      } catch (parseErr) {
        console.warn('JSON parsing failed. Raw response:', response.text);
        res.status(200).json({
          title: `${keywords.split(',')[0]} 중심의 주권 성찰`,
          content: response.text || '소감문을 생성하지 못했습니다. 다시 조율해 주십시오.',
          isFallback: false
        });
      }
    } catch (apiError: any) {
      console.error('Reflection Gemini API Error:', apiError);
      const simulatedReflection = getLocalSimulatedReflection(keywords, topic, tone, author);
      res.status(200).json({
        title: `"${keywords.split(',')[0]}" 중심의 주권 성찰과 교훈 (로컬 버전)`,
        content: `[원격 AI 연결 실패: ${apiError.message || apiError}]\n\n* 대안으로 탑재된 로컬 고안 성찰문을 작성해 드립니다:\n\n${simulatedReflection}`,
        isFallback: true
      });
    }

  } catch (error: any) {
    console.error('Reflection Generation Error:', error);
    res.status(500).json({ error: error.message || '소감문 생성 중 서버 에러가 발생했습니다.' });
  }
}
