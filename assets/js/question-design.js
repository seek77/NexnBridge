(function () {
  'use strict';
  const root = document.getElementById('nb-question-design');
  if (!root) return;
  // Illustrative website content only; no model calls or business actions.
  const examplesByLanguage = {
  "ko": {
    "monitor": {
      "category": "현황 파악",
      "question": "어느 제품·고객에서 수익성이 떨어졌는가?",
      "summary": "제품·고객별 수익성을 같은 기준으로 비교하고, 전체 손익 변화에 영향이 큰 항목을 확인합니다.",
      "cards": [
        [
          "업무 기준",
          "수익성 정의, 비교 기간, 제품·고객별 집계 단위",
          "Knowledge · Semantic Model"
        ],
        [
          "검증된 계산",
          "매출·원가·이익과 전기·계획 대비 차이",
          "SQL · View"
        ],
        [
          "비교 분석",
          "변동이 큰 제품과 고객의 구성 확인",
          "Agent · 데이터 조회"
        ]
      ]
    },
    "diagnose": {
      "category": "원인 분석",
      "question": "매출은 늘었는데 수익성이 떨어진 이유는?",
      "summary": "가격·물량·제품 구성의 영향을 비교하고, 설명되지 않는 변동은 할인 조건과 원가 내역에서 추가로 조사합니다.",
      "cards": [
        [
          "업무 기준",
          "수익성 정의와 원가 배부 기준, 할인 조건",
          "Knowledge · Semantic Model"
        ],
        [
          "검증된 계산",
          "가격·물량·제품 구성·원가의 손익 영향 분해",
          "SQL · View · 계산 모델"
        ],
        [
          "추가 분석",
          "고객·채널별 비교, 계약 조건과 예외 조사",
          "Agent · 데이터 조회 · 문서 검색"
        ]
      ]
    },
    "predict": {
      "category": "예측",
      "question": "현재 추세가 이어지면 다음 분기 손익은?",
      "summary": "매출·원가 전망을 바탕으로 예상 손익을 계산하고, 수요와 가격 가정에 따른 범위와 주요 위험 요인을 확인합니다.",
      "cards": [
        [
          "전망의 전제",
          "예측 기간, 수요·가격·원가의 가정",
          "Knowledge · Semantic Model"
        ],
        [
          "예측과 계산",
          "통계·ML 기반 전망과 손익 계산",
          "예측 모델 · 계산 모델"
        ],
        [
          "결과 검토",
          "과거 예측 오차와 가정 변화의 영향 확인",
          "Backtesting · Agent"
        ]
      ]
    },
    "simulate": {
      "category": "시뮬레이션",
      "question": "가격이나 제품 구성을 바꾸면 손익은?",
      "summary": "가격·제품 구성과 예상 수요를 바꿔 기준안과 비교합니다. 결과에 영향이 큰 가정은 범위를 달리해 다시 계산합니다.",
      "cards": [
        [
          "변경 조건",
          "가격·제품 구성·수요 반응과 적용 범위",
          "Business Rules · 업무 가정"
        ],
        [
          "시나리오 계산",
          "동일한 손익 기준으로 기준안과 변경안 계산",
          "Simulation · 계산 모델"
        ],
        [
          "영향 비교",
          "손익 차이와 주요 가정의 민감도 확인",
          "Agent · 시나리오 비교"
        ]
      ]
    },
    "decide": {
      "category": "대안 평가",
      "question": "고객·공급 조건을 고려하면 어떤 선택이 유리한가?",
      "summary": "목표와 제약을 수식화할 수 있는 부분은 최적화로 계산하고, 고객 관계와 실행 부담 등 정성적 조건도 함께 비교합니다.",
      "cards": [
        [
          "선택 기준",
          "수익 목표, 고객 약정, 공급 여력과 우선순위",
          "Knowledge · Business Rules"
        ],
        [
          "대안별 계산",
          "손익·제약 충족 여부 비교와 필요 시 최적화",
          "계산 모델 · Optimization"
        ],
        [
          "선택 근거",
          "대안의 장단점, 전제 조건과 실행 부담 비교",
          "Agent · 전문가 검토"
        ]
      ]
    },
    "act": {
      "category": "실행·통제",
      "question": "검토한 가격 변경안을 실제로 적용해도 되는가?",
      "summary": "변경 대상과 적용 시점, 권한과 승인 상태를 확인합니다. 조건을 충족한 변경안만 실행하고 처리 결과를 기록합니다.",
      "cards": [
        [
          "실행 조건",
          "가격 정책, 고객 약정과 승인 권한",
          "Business Rules · 권한 정책"
        ],
        [
          "검증된 실행",
          "조건·승인 검사, 중복 방지와 변경 처리",
          "Workflow · 업무 API"
        ],
        [
          "결과 확인",
          "처리 이력 확인과 실패 시 중단·담당자 이관",
          "감사 기록 · 예외 처리"
        ]
      ]
    }
  },
  "en": {
    "monitor": {
      "category": "Monitoring",
      "question": "Which products and customers have become less profitable?",
      "summary": "Compare profitability on a consistent basis across products and customers, and identify the items contributing most to the change in total profit.",
      "cards": [
        [
          "Business definitions",
          "Profit measures, comparison periods, and product and customer reporting grain",
          "Knowledge · Semantic Model"
        ],
        [
          "Validated calculations",
          "Revenue, costs, profit, and variances against plan or prior periods",
          "SQL · Views"
        ],
        [
          "Comparative analysis",
          "Changes in product and customer mix behind the largest movements",
          "Agent · Data queries"
        ]
      ]
    },
    "diagnose": {
      "category": "Diagnosis",
      "question": "Why has profitability fallen while revenue has grown?",
      "summary": "Compare the effects of price, volume, and product mix, then investigate discount terms and cost details where the variance remains unexplained.",
      "cards": [
        [
          "Business definitions",
          "Profit measures, cost allocation rules, and discount terms",
          "Knowledge · Semantic Model"
        ],
        [
          "Validated calculations",
          "Profit variance decomposition by price, volume, mix, and cost",
          "SQL · Views · Calculation models"
        ],
        [
          "Further investigation",
          "Customer and channel comparisons, contract terms, and exceptions",
          "Agent · Data queries · Document search"
        ]
      ]
    },
    "predict": {
      "category": "Forecasting",
      "question": "What will next quarter’s profit look like if current trends continue?",
      "summary": "Calculate expected profit from revenue and cost forecasts, then examine the range of outcomes and risks under different demand and pricing assumptions.",
      "cards": [
        [
          "Forecast assumptions",
          "Time horizon and assumptions for demand, prices, and costs",
          "Knowledge · Semantic Model"
        ],
        [
          "Forecasts and calculations",
          "Statistical or ML forecasts combined with profit calculations",
          "Forecast models · Calculation models"
        ],
        [
          "Forecast review",
          "Historical forecast errors and the effect of changing assumptions",
          "Backtesting · Agent"
        ]
      ]
    },
    "simulate": {
      "category": "Simulation",
      "question": "How would a change in price or product mix affect profit?",
      "summary": "Change prices, product mix, and expected demand to compare alternatives against a baseline. Test different ranges for the assumptions that have the greatest effect.",
      "cards": [
        [
          "Scenario inputs",
          "Prices, product mix, demand response, and scope of the change",
          "Business Rules · Assumptions"
        ],
        [
          "Scenario calculations",
          "Baseline and alternative results using consistent profit definitions",
          "Simulation · Calculation models"
        ],
        [
          "Impact comparison",
          "Profit differences and sensitivity to key assumptions",
          "Agent · Scenario comparison"
        ]
      ]
    },
    "decide": {
      "category": "Decision support",
      "question": "Which option best meets our customer and supply constraints?",
      "summary": "Use optimization where objectives and constraints can be expressed mathematically, and compare qualitative factors such as customer relationships and implementation effort.",
      "cards": [
        [
          "Decision criteria",
          "Profit objectives, customer commitments, capacity, and priorities",
          "Knowledge · Business Rules"
        ],
        [
          "Option calculations",
          "Profit and feasibility comparisons, with optimization where appropriate",
          "Calculation models · Optimization"
        ],
        [
          "Decision rationale",
          "Trade-offs, assumptions, and implementation implications",
          "Agent · Expert review"
        ]
      ]
    },
    "act": {
      "category": "Controlled action",
      "question": "Can the proposed price change be applied?",
      "summary": "Check the scope, effective date, permissions, and approval status. Apply only changes that meet the required conditions and record the outcome.",
      "cards": [
        [
          "Execution conditions",
          "Pricing policies, customer commitments, and approval authority",
          "Business Rules · Access policies"
        ],
        [
          "Validated execution",
          "Condition and approval checks, duplicate prevention, and updates",
          "Workflow · Business APIs"
        ],
        [
          "Outcome checks",
          "Audit records, failure handling, and escalation",
          "Audit trail · Exception handling"
        ]
      ]
    }
  }
};
  const examples = examplesByLanguage[root.dataset.lang] || examplesByLanguage.ko;
  function show(key) {
    const example = examples[key];
    if (!example) return;
    root.querySelectorAll('[data-question]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.question === key));
    });
    root.querySelector('[data-field="category"]').textContent = example.category;
    root.querySelector('[data-field="question"]').textContent = example.question;
    root.querySelector('[data-field="summary"]').textContent = example.summary;
    root.querySelectorAll('.nb-basis-card').forEach((card, index) => {
      card.querySelector('h4').textContent = example.cards[index][0];
      card.querySelector('p').textContent = example.cards[index][1];
      card.querySelector('.nb-tech').textContent = example.cards[index][2];
    });
  }
  root.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', () => show(button.dataset.question));
    button.disabled = false;
  });
})();
