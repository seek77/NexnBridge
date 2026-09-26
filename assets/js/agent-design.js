(function () {
  'use strict';
  const root = document.getElementById('nb-question-design');
  if (!root) return;

  // Informational website content; no model calls or business actions.
  const designs = {
    workflow: {
      category: 'Workflow · Graph Engineering',
      question: '반드시 지켜야 할 절차는?',
      summary: '필수 단계와 분기, 승인 조건을 실행 구조에 명시합니다. 각 단계에는 계산 코드, 모델 판단 또는 자체적으로 탐색하는 Agent를 배치합니다.',
      cards: [
        ['실행 구조', '업무 단계, 상태, 조건부 분기와 반복'],
        ['판단 범위', '코드로 확정할 부분과 모델이 선택할 부분'],
        ['검증 항목', '필수 단계 누락, 잘못된 분기, 예외 처리']
      ]
    },
    planning: {
      category: 'Agent Loop · Planning & Replanning',
      question: '조사 방향이 달라지는 업무는?',
      summary: '원인과 조사 경로를 미리 정하기 어려운 업무에는 Agent가 가설을 세우고 도구를 선택하도록 합니다. 새로 확인한 증거에 따라 계획을 수정하되, 종료 조건과 탐색 한도를 둡니다.',
      cards: [
        ['탐색 방식', '가설 수립, 증거 수집, 도구 실행과 재계획'],
        ['작업 상태', '확인한 사실, 미해결 질문, 이전 시도 관리'],
        ['검증 항목', '근거 없는 결론, 반복 탐색, 시간·비용 초과']
      ]
    },
    'multi-agent': {
      category: 'Multi-Agent · Orchestration',
      question: '여러 역할이 필요한 업무는?',
      summary: '독립적인 조사나 전문 역할의 분담이 필요한 경우 여러 Agent를 구성합니다. 작업 배분, 공유할 정보, 결과를 합치는 기준을 정하고 단일 Agent 방식과 비교합니다.',
      cards: [
        ['역할 구성', '전문성·도구·권한에 따른 작업 분담'],
        ['협업 방식', '병렬 수행, 순차 인계, 결과 검토'],
        ['검증 항목', '중복 작업, 인계 과정의 정보 누락, 조정 비용']
      ]
    },
    decision: {
      category: 'Classification · Decision Models',
      question: '범위가 정해진 판단은?',
      summary: '분류·선택·점수화는 열린 탐색과 구분해 설계합니다. 규칙으로 확정할 수 있는 것은 코드로 처리하고, 의미 판단이 필요한 부분에는 Jev 같은 Decision Model도 적용 후보로 검토합니다.',
      cards: [
        ['판단 구조', '입력 상태, 선택지, 점수 기준과 출력 형식'],
        ['예외 처리', '해당 없음, 정보 부족, 판단 보류'],
        ['검증 항목', '오분류, 확률의 신뢰도, 자동 처리 범위']
      ]
    },
    knowledge: {
      category: 'Knowledge Engineering · Context Engineering',
      question: '무엇을 근거로 판단할까?',
      summary: 'Ontology·Knowledge Graph·Semantic Model로 기업의 개념과 관계, 지표와 판단 기준을 관리합니다. 현재 작업에 필요한 지식과 데이터, 이전 결과를 선별해 모델에 제공합니다.',
      cards: [
        ['지식 설계', '업무 의미, 관계, 규칙, 출처와 적용 시점'],
        ['Context 구성', '검색 결과, 작업 상태, 도구 출력과 이력'],
        ['검증 항목', '근거 누락, 상충하는 기준, 오래되거나 권한 밖인 정보']
      ]
    },
    harness: {
      category: 'Harness · Evaluation · Operations',
      question: '어떻게 통제하고 개선할까?',
      summary: '도구 사용 권한, 실행 상태의 저장과 재개, 재시도·중단 조건과 사람의 승인을 구현합니다. 모델·도구·지식·실행 구조가 바뀌면 같은 업무 사례를 다시 평가합니다.',
      cards: [
        ['실행 통제', '접근권한, 승인, 실패 복구와 실행 기록'],
        ['오류 분석', '검색·판단·계산·실행 단계별 원인 확인'],
        ['개선 평가', '정확도, 사람의 검토량, 처리시간과 전체 비용']
      ]
    }
  };

  const buttons = root.querySelectorAll('[data-design]');
  function show(key) {
    const design = designs[key];
    if (!design) return;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.design === key));
    });
    ['category', 'question', 'summary'].forEach(field => {
      root.querySelector('[data-field="' + field + '"]').textContent = design[field];
    });
    root.querySelectorAll('.nb-basis-card').forEach((card, index) => {
      card.querySelector('h4').textContent = design.cards[index][0];
      card.querySelector('p').textContent = design.cards[index][1];
    });
  }
  buttons.forEach(button => {
    button.addEventListener('click', () => show(button.dataset.design));
    button.disabled = false;
  });
})();
