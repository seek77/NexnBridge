(function(){
  const root=document.getElementById('nb-question-design');
  if(!root)return;
  const englishExamples={
  "monitor": {
    "category": "MONITORING",
    "question": "Which products and customers are becoming less profitable?",
    "steps": [
      [
        "Define the metric",
        "Profit measure and reporting grain"
      ],
      [
        "Query the data",
        "Product, customer, and period"
      ],
      [
        "Compare performance",
        "Against plan or prior period"
      ],
      [
        "Highlight changes",
        "Items that need attention"
      ]
    ],
    "tools": [
      "Semantic Model",
      "SQL",
      "Data validation"
    ],
    "note": "Defined metric lookups use validated SQL. They do not require an open-ended agent loop."
  },
  "diagnose": {
    "category": "DIAGNOSIS",
    "question": "What is driving the decline in profitability?",
    "steps": [
      [
        "Review performance",
        "Metrics, periods, and comparators"
      ],
      [
        "Break down the drivers",
        "Price, volume, mix, and cost"
      ],
      [
        "Investigate gaps",
        "Evidence for unexplained changes"
      ],
      [
        "Explain the impact",
        "Reconcile contributions to the total"
      ]
    ],
    "tools": [
      "Knowledge",
      "SQL & calculation models",
      "Agent",
      "Verification"
    ],
    "note": "Use established calculations for variance analysis, with additional investigation where the results need explanation."
  },
  "predict": {
    "category": "PREDICTION",
    "question": "Where is performance heading if current trends continue?",
    "steps": [
      [
        "Check the inputs",
        "History, demand, prices, and costs"
      ],
      [
        "Apply a forecast model",
        "Trends, seasonality, and drivers"
      ],
      [
        "Evaluate forecast error",
        "Test against historical periods"
      ],
      [
        "Present the outlook",
        "Ranges, assumptions, and risks"
      ]
    ],
    "tools": [
      "Business assumptions",
      "Forecast model",
      "Backtesting"
    ],
    "note": "Statistical or machine-learning models produce the forecast. The LLM supports interpretation of its assumptions and results."
  },
  "simulate": {
    "category": "SIMULATION",
    "question": "How would a change in price or product mix affect profit?",
    "steps": [
      [
        "Set the scenario",
        "Price, mix, and demand assumptions"
      ],
      [
        "Calculate outcomes",
        "Baseline and alternative scenarios"
      ],
      [
        "Test sensitivity",
        "Vary the main assumptions"
      ],
      [
        "Compare the effects",
        "Profit, constraints, and uncertainty"
      ]
    ],
    "tools": [
      "Business Rules",
      "Simulation",
      "Sensitivity analysis"
    ],
    "note": "Simulation calculates outcomes under chosen conditions. Selecting the best feasible alternative is a separate optimization task."
  },
  "decide": {
    "category": "DECISION SUPPORT",
    "question": "Which alternative works best within customer and supply constraints?",
    "steps": [
      [
        "Set objectives and limits",
        "Profit, commitments, and capacity"
      ],
      [
        "Evaluate alternatives",
        "Comparison or optimization"
      ],
      [
        "Check feasibility",
        "Constraints and trade-offs"
      ],
      [
        "Present the options",
        "Recommendation and alternatives"
      ]
    ],
    "tools": [
      "Knowledge",
      "Comparison & optimization",
      "Constraint checks"
    ],
    "note": "Use optimization where objectives and constraints can be formulated mathematically, and evidence-based comparison where qualitative judgment is central."
  },
  "act": {
    "category": "CONTROLLED ACTION",
    "question": "Can the proposed price change be applied?",
    "steps": [
      [
        "Review the change",
        "Scope, amount, and effective date"
      ],
      [
        "Check conditions and access",
        "Data state and user permissions"
      ],
      [
        "Approve and execute",
        "Approval and duplicate prevention"
      ],
      [
        "Confirm the result",
        "Success, failures, and audit trail"
      ]
    ],
    "tools": [
      "Business Rules",
      "Verification Gate",
      "Business API"
    ],
    "note": "Execute only within the permitted scope after required checks and approvals. Stop or escalate when verification fails."
  }
};
  const examples=root.dataset.lang==='en'?englishExamples:{
    monitor:{category:'MONITORING',question:'어느 제품·고객에서 수익성이 떨어지는가?',steps:[['지표 기준 확인','수익성 정의·집계 단위'],['데이터 조회','제품·고객·기간별 실적'],['변화 비교','전기·계획 대비 차이'],['주요 변동 표시','확인이 필요한 항목']],tools:['Semantic Model','SQL','데이터 검증'],note:'정해진 지표 조회는 검증된 SQL로 처리합니다. 반복 탐색이 필요 없는 업무입니다.'},
    diagnose:{category:'DIAGNOSIS',question:'수익성이 떨어진 이유는 무엇인가?',steps:[['실적 확인','지표·기간·비교 기준'],['영향 분해','가격·물량·제품 구성·원가'],['추가 근거 확인','설명되지 않는 변동 조사'],['원인별 영향 제시','전체 변동과 합계 대조']],tools:['Knowledge','SQL·계산 모델','Agent','검증'],note:'정해진 차이 분석은 계산 절차로, 설명이 부족한 부분은 추가 탐색으로 처리합니다.'},
    predict:{category:'PREDICTION',question:'현재 추세가 이어지면 실적은 어떻게 달라지는가?',steps:[['입력 조건 점검','이력·수요·가격·비용'],['예측 모델 적용','추세·계절성·설명 변수'],['오차 검증','과거 기간으로 성능 확인'],['전망 제시','예측 범위·가정·위험 요인']],tools:['업무 가정','예측 모델','Backtesting'],note:'예측은 통계·ML 모델로 계산하고, LLM은 가정과 결과의 해석을 지원합니다.'},
    simulate:{category:'SIMULATION',question:'가격이나 제품 구성을 바꾸면 손익은 어떻게 달라지는가?',steps:[['변경 조건 설정','가격·제품 구성·수요 가정'],['시나리오 계산','기준안·대안별 손익'],['민감도 확인','주요 가정의 변화 폭'],['대안별 영향 비교','손익·제약·불확실성']],tools:['Business Rules','Simulation','민감도 분석'],note:'조건별 결과를 계산하는 단계입니다. 가장 유리한 대안을 선택하는 최적화와는 구분합니다.'},
    decide:{category:'DECISION SUPPORT',question:'고객·공급 제약을 고려하면 어떤 대안이 유리한가?',steps:[['목표·제약 정의','손익·약정·공급 여력'],['대안 평가','비교 또는 최적화 계산'],['실행 가능성 검토','제약 충족·상충 조건'],['선택 근거 제시','추천안·차선안·전제 조건']],tools:['Knowledge','대안 비교·최적화','제약 검증'],note:'목표와 제약을 수식화할 수 있으면 최적화를, 정성적 판단이 크면 근거 중심의 대안 비교를 적용합니다.'},
    act:{category:'CONTROLLED ACTION',question:'검토한 가격 변경안을 실제로 적용해도 되는가?',steps:[['변경안 확인','대상·금액·적용 시점'],['조건·권한 검사','데이터 상태·사용자 권한'],['승인 후 실행','업무 승인·중복 실행 방지'],['처리 결과 확인','성공·실패·감사 기록']],tools:['Business Rules','Verification Gate','업무 API'],note:'조건을 충족하고 필요한 승인을 받은 범위만 실행합니다. 검증에 실패하면 중단하거나 담당자에게 이관합니다.'}
  };
  function show(key){
    const value=examples[key];
    if(!value)return;
    root.querySelectorAll('[data-question]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.question===key)));
    root.querySelector('[data-field=category]').textContent=value.category;
    root.querySelector('[data-field=question]').textContent=value.question;
    root.querySelector('[data-field=note]').textContent=value.note;
    root.querySelectorAll('.nb-flow li').forEach((step,i)=>{step.querySelector('.nb-step-title').textContent=value.steps[i][0];step.querySelector('.nb-step-detail').textContent=value.steps[i][1];});
    const toolRow=root.querySelector('.nb-tools');
    toolRow.querySelectorAll('.nb-tool').forEach(el=>el.remove());
    value.tools.forEach(label=>{const tag=document.createElement('span');tag.className='nb-tool';tag.textContent=label;toolRow.appendChild(tag);});
  }
  root.querySelectorAll('[data-question]').forEach(button=>{button.addEventListener('click',()=>show(button.dataset.question));button.disabled=false;});

})();
