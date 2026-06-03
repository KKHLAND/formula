/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Formula {
  id: string;
  subject: "공통수학1" | "공통수학2" | "대수" | "미적분I" | "확률과 통계" | "기하" | "미적분II";
  chapter: string;
  sub_chapter: string;
  formula_name: string;
  formula_latex: string;
  description: string;
  importance: "상" | "중" | "하";
  tags: string[];
  curriculum_note?: string; // 2022 개정 특이사항 및 교사의 꿀팁 메모
  solution_guide?: string; // 공식 유도 방법 또는 문제 적용 팁
}

export const SUBJECT_LIST = [
  "공통수학1",
  "공통수학2",
  "대수",
  "미적분I",
  "확률과 통계",
  "기하",
  "미적분II"
] as const;

export const FORMULA_DATABASE: Formula[] = [
  // ================= 공통수학1 =================
  {
    id: "MATH2022-C1-001",
    subject: "공통수학1",
    chapter: "행렬",
    sub_chapter: "행렬의 연산",
    formula_name: "행렬의 곱셈",
    formula_latex: "A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, B = \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} \\implies AB = \\begin{pmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{pmatrix}",
    description: "왼쪽 행렬의 행(Row)과 오른쪽 행렬의 열(Column)을 성분별로 차례대로 곱하여 합산합니다. 행렬의 곱셈이 성립하기 위해선 앞 행렬의 열의 개수와 뒤 행렬의 행의 개수가 같아야 합니다.",
    importance: "상",
    tags: ["행렬", "행렬의곱", "2x2"],
    curriculum_note: "★2022 개정 핵심 반영: 2015 개정에서 제외되었던 '행렬' 단원이 2022 개정 공통수학1에 다시 복원되었습니다! 수능 및 내신 복귀 1순위 개념입니다.",
    solution_guide: "행렬의 곱셈은 교환법칙이 일반적으로 성립하지 않습니다. 즉, $AB \\neq BA$ 임을 항상 인지하고 전개해야 합니다."
  },
  {
    id: "MATH2022-C1-002",
    subject: "공통수학1",
    chapter: "다항식",
    sub_chapter: "다항식의 연산",
    formula_name: "곱셈 공식 (3차식)",
    formula_latex: "(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3 \\\\ (a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3",
    description: "두 수의 합 또는 차의 세제곱을 전개하는 공식으로, 고교 수학 계산의 뼈대가 되는 기본 공식입니다.",
    importance: "상",
    tags: ["다항식", "곱셈공식", "인수분해"],
    curriculum_note: "중학 수학의 2차식 전개를 바탕으로 고교 수학에서 처음 마주하는 3차 전개 공식입니다.",
    solution_guide: "$a^3 + b^3 = (a+b)^3 - 3ab(a+b)$, $a^3 - b^3 = (a-b)^3 + 3ab(a-b)$ 로 변형하여 합과 곱의 형태로 문제에 활용하는 경우가 아주 많습니다."
  },
  {
    id: "MATH2022-C1-003",
    subject: "공통수학1",
    chapter: "방정식과 부등식",
    sub_chapter: "이차방정식",
    formula_name: "근의 공식과 판별식",
    formula_latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad (D = b^2 - 4ac)",
    description: "이차방정식 $ax^2 + bx + c = 0$ ($a \\neq 0$)의 해를 계산하고, 실근/허근의 존재 유무 및 개수를 판정하는 식입니다. 판별식 $D$가 $D > 0$ 이면 서로 다른 두 실근, $D = 0$ 이면 중근, $D < 0$ 이면 서로 다른 두 허근을 가집니다.",
    importance: "상",
    tags: ["이차방정식", "근의공식", "판별식"],
    curriculum_note: "복소수가 정의된 이후 판별식 $D < 0$ 에 대한 해석으로 허근 개념이 완결됩니다.",
    solution_guide: "일차항의 계수가 짝수인 경우($b = 2b'$), 짝수 공식 $x = \\frac{-b' \\pm \\sqrt{b'^2 - ac}}{a}$ 및 변형 판별식 $D/4 = b'^2 - ac$ 를 사용하여 계산 효율을 향상시키십시오."
  },
  {
    id: "MATH2022-C1-004",
    subject: "공통수학1",
    chapter: "방정식과 부등식",
    sub_chapter: "이차방정식",
    formula_name: "이차방정식의 근과 계수의 관계",
    formula_latex: "\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}",
    description: "이차방정식 $ax^2 + bx + c = 0$ 의 두 근을 $\\alpha, \\beta$ 라 할 때, 두 근을 구하지 않고도 방정식의 계수들만으로 두 실근(혹은 복소수근)의 합과 곱을 직접 정량화할 수 있습니다.",
    importance: "상",
    tags: ["이차방정식", "근과계수", "수식변형"],
    curriculum_note: "다항식 단원의 인수분해 정리와 연관되며 이후 삼각함수, 수열 등 다른 과목과도 무조건 연계되는 베이스라인입니다.",
    solution_guide: "두 근의 차 공식인 $|\\alpha - \\beta| = \\frac{\\sqrt{b^2 - 4ac}}{|a|}$ 도 종종 실전에 유용하게 응용됩니다."
  },
  {
    id: "MATH2022-C1-005",
    subject: "공통수학1",
    chapter: "도형의 방정식",
    sub_chapter: "평면좌표",
    formula_name: "선분의 내분점 공식",
    formula_latex: "P\\left(\\frac{mx_2 + nx_1}{m+n}, \\frac{my_2 + ny_1}{m+n}\\right)",
    description: "좌표평면 위의 두 점 $A(x_1, y_1)$과 $B(x_2, y_2)$를 $m : n$ ($m>0, n>0$)으로 내분하는 점 $P$의 좌표 공식입니다.",
    importance: "상",
    tags: ["도형", "좌표평면", "내분점"],
    curriculum_note: "★2022 개정 변동 사항: 2022 개정 교육과정 공통수학2 '도형의 방정식'에서 외분점 공식이 정식 과정에서 명시적으로 제외되었습니다! 학교 평가나 내신 지도시 외분점 공식 응용 문제를 출제하지 않도록 주의하여야 합니다.",
    solution_guide: "비율 $m$은 반드시 $B(x_2)$ 성분에 곱해지고, $n$은 $A(x_1)$ 성분에 교차해서 곱해짐을 좌표상 시각적 화살표로 기억하면 혼동을 피할 수 있습니다."
  },

  // ================= 공통수학2 =================
  {
    id: "MATH2022-C2-001",
    subject: "공통수학2",
    chapter: "집합과 명제",
    sub_chapter: "명제",
    formula_name: "산술평균과 기하평균의 관계",
    formula_latex: "\\frac{a+b}{2} \\geq \\sqrt{ab} \\quad (a > 0, \\ b > 0) \\quad [단, 등호는 \\ a=b \\ 일 \\ 때 \\ 성립]",
    description: "양수인 두 수의 산술평균은 항상 기하평균보다 크거나 같습니다. 합이 일정할 때 곱의 최대값, 혹은 곱이 일정할 때 합의 최소값을 구하는 조건부 부등식 문제에 절대적으로 애용됩니다.",
    importance: "상",
    tags: ["명제", "절대부등식", "산술기하", "최대최소"],
    curriculum_note: "고등학교 1학년 내신 서술형에서 '등호 성립 조건'을 적지 않아 감점당하는 빈도가 가장 높은 단골 함정 구간입니다.",
    solution_guide: "반드시 변수가 '양수'라는 전제 조건이 주어졌는지 가장 먼저 확인하고, 등호 조건인 $a=b$가 실제 만족 가능한 값 범위 내에 수렴하는지 더블 체크하세요."
  },
  {
    id: "MATH2022-C2-002",
    subject: "공통수학2",
    chapter: "경우의 수",
    sub_chapter: "순열과 조합",
    formula_name: "순열과 조합 공식",
    formula_latex: "_nP_r = \\frac{n!}{(n-r)!}, \\quad _nC_r = \\frac{_nP_r}{r!} = \\frac{n!}{r!(n-r)!}",
    description: "서로 다른 $n$개 중에서 $r$개를 택해 '순서를 고려하여' 나열하는 경우의 수가 순열($_nP_r$)이며, '순서 없이' 선택만 하는 경우의 수가 조합($_nC_r$)입니다.",
    importance: "상",
    tags: ["경우의수", "순열", "조합"],
    curriculum_note: "확률과 통계로 진입하기 위한 기초 다리입니다. 실무적으로 가벼운 퀴즈 형태로 아이들의 흥미를 끌어올리기 좋습니다.",
    solution_guide: "$_nC_r = _nC_{n-r}$ 성질을 이용하면 예를 들어 $_{10}C_8$ 계산 시 $_{10}C_2 = \\frac{10 \\times 9}{2 \\times 1} = 45$ 로 한층 신속하게 처리할 수 있습니다."
  },

  // ================= 대수 =================
  {
    id: "MATH2022-AL-001",
    subject: "대수",
    chapter: "지수함수와 로그함수",
    sub_chapter: "로그",
    formula_name: "로그의 밑 변환 공식",
    formula_latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a} \\quad (a > 0, a \\neq 1, b > 0, c > 0, c \\neq 1)",
    description: "로그의 계산 시 밑이 다른 수식들을 단일한 밑 $c$로 통일하여 정비함으로써 연산 기법을 손쉽게 바꾸어 줄 수 있는 초석 공식입니다.",
    importance: "상",
    tags: ["지수와로그", "로그", "밑변환"],
    curriculum_note: "2015 교육과정의 명칭인 '수학I'이 2022 개정 교육과정에서 '대수(Algebra)'라는 명확한 학문 명칭으로 재편되었습니다.",
    solution_guide: "$c=b$로 설정하면 $\\log_a b = \\frac{1}{\\log_b a}$ 가 유도되어 밑과 진수가 바뀌면 역수 관계가 됨을 명쾌하게 증명할 수 있습니다."
  },
  {
    id: "MATH2022-AL-002",
    subject: "대수",
    chapter: "삼각함수",
    sub_chapter: "삼각함수의 성질",
    formula_name: "사인법칙",
    formula_latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R \\quad (R은 \\ 외접원의 \\ 반지름)",
    description: "삼각형 $ABC$의 세 변의 길이와 세 각의 크기, 그리고 외접원 반지름($R$) 간의 긴밀한 기하학적 대칭 비례 관계를 수학적으로 연결해 주는 핵심 구조입니다.",
    importance: "상",
    tags: ["삼각함수", "도형", "사인법칙", "외접원"],
    curriculum_note: "기하 도형의 한 변과 마주 보는 각을 직관적으로 연계하여 모르는 선상의 치수를 획득하는 가이드 역할을 합니다. 자투리 시험 대비 암기 최적식입니다.",
    solution_guide: "1) '한 변과 두 각이 주어질 때', 2) '두 변과 끼인각이 아닌 한 각의 크기', 3) '외접원의 반지름 $R$ 조건'이 지문에 노출될 때는 십중팔구 사인법칙을 연상해야 합니다."
  },
  {
    id: "MATH2022-AL-003",
    subject: "대수",
    chapter: "삼각함수",
    sub_chapter: "삼각함수의 성질",
    formula_name: "코사인법칙",
    formula_latex: "a^2 = b^2 + c^2 - 2bc \\cos A \\implies \\cos A = \\frac{b^2 + c^2 - a^2}{2bc}",
    description: "삼각형에서 두 변의 길이와 그 사잇각을 알 때 나머지 한 변의 길이를 명확하게 구하는 법칙입니다. 피타고라스 정리의 일반화 버전으로 간주하면 자연스럽게 습득 가능합니다.",
    importance: "상",
    tags: ["삼각함수", "도형", "코사인법칙"],
    curriculum_note: "수능 수학 수1/대수 평면도형 파트에서 가장 고난이도 문항인 공통 15번, 21번 등 변별력 연계 문제에 압도적으로 기출됩니다.",
    solution_guide: "세 변의 길이가 모두 주어졌을 때 특정한 한 각의 삼각비를 알아볼 필요가 있다면 '우변 변형 식'을 즉석에서 작성하시기를 권장합니다."
  },
  {
    id: "MATH2022-AL-004",
    subject: "대수",
    chapter: "수열",
    sub_chapter: "등차수열",
    formula_name: "등차수열의 합 공식",
    formula_latex: "S_n = \\frac{n\\{2a + (n-1)d\\}}{2} = \\frac{n(a + l)}{2} \\quad (l은 \\ 끝항)",
    description: "첫째항이 $a$, 공차가 $d$인 등차수열의 첫째항부터 제$n$항까지의 총합 $S_n$을 산출하는 구조입니다. 첫항과 끝항을 알아내어 평균을 낸 뒤 개수를 곱해 준다는 직관성으로 기원합니다.",
    importance: "상",
    tags: ["수열", "등차수열", "수열의합"],
    curriculum_note: "가우스가 아동기에 1부터 100까지의 합을 구할 때 착안했던 앞뒤 대칭쌍의 정렬 논리가 그대로 깃들어 있어 교육철학적으로도 가치가 큽니다.",
    solution_guide: "$S_n$은 $n$에 대한 이차상수항이 없는 식, 즉 $S_n = An^2 + Bn$ 꼴로 나타나며 이때 최고차항 계수의 두 배가 공차($d = 2A$)임이 기하학적으로 신속 풀이의 핵입니다."
  },

  // ================= 미적분 I =================
  {
    id: "MATH2022-M1-001",
    subject: "미적분I",
    chapter: "다항함수의 미분법",
    sub_chapter: "미분계수와 도함수",
    formula_name: "미분계수의 정의",
    formula_latex: "f'(a) = \\lim_{\\Delta x \\to 0} \\frac{f(a+\\Delta x) - f(a)}{\\Delta x} = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}",
    description: "선상 위의 임의의 특정 한 점 $x=a$에서의 미세 변화량 비의 극한으로, 기하학적으로는 와 닿는 접선의 기울기이자 물리적으로는 순간변화율을 뜻합니다.",
    importance: "상",
    tags: ["미분", "극한", "미분계수"],
    curriculum_note: "2015 교육과정에서의 '수학II'가 2022 개정에서 '미적분I'으로 재배치되었습니다. 다항함수를 축으로 실질적인 변화율을 선제 측정하는 대단히 비중 있는 시발점입니다.",
    solution_guide: "분모와 분자의 증분 조율에 맞춰 $\\lim_{h \\to 0} \\frac{f(a+kh) - f(a)}{h} = k f'(a)$ 와 같이 형태를 일치시키는 식의 구조적 치환 연마가 내신 필수입니다."
  },
  {
    id: "MATH2022-M1-002",
    subject: "미적분I",
    chapter: "다항함수의 미분법",
    sub_chapter: "도함수",
    formula_name: "곱의 미분법",
    formula_latex: "\\{f(x)y(x)\\}' = f'(x)y(x) + f(x)y'(x)",
    description: "각자 독자적으로 미분 가능한 투 패키지 함수 곱의 도함수를 산출하는 공식입니다. 번갈아 가면서 미분하고 합산한다는 리듬감을 지니고 있습니다.",
    importance: "상",
    tags: ["미분", "도함수", "곱의미분"],
    curriculum_note: "복수의 다항함수가 결착되어 있을 대 일일이 전개해야 하는 압도적 계산 낭비를 상쇄해 줍니다.",
    solution_guide: "세 개의 함수 곱인 $\\{fgh\\}' = f'gh + fg'h + fgh'$ 로도 순차 확장 적용될 수 있습니다."
  },

  // ================= 확률과 통계 =================
  {
    id: "MATH2022-ST-001",
    subject: "확률과 통계",
    chapter: "경우의 수",
    sub_chapter: "순열과 조합",
    formula_name: "중복조합",
    formula_latex: "_nH_r = _{n+r-1}C_r",
    description: "서로 다른 $n$개 부류 중 중복을 전적으로 고루 허용하여 순서 없이 $r$개를 선택하는 특수한 조합 계산입니다. 이를 칸막이와 대상 구슬 배열 조합으로 치환하여 계산을 수월히 바꿉니다.",
    importance: "상",
    tags: ["공통", "확률과통계", "중복조합", "칸막이"],
    curriculum_note: "자연수해의 개수를 수반하는 방정식 $x+y+z = n \\ (x, y, z \\geq 0 \\implies _3H_n)$ 문항으로 자수 정량 기출됩니다.",
    solution_guide: "조건이 '자연수'해 ($x, y, z \\geq 1$) 라면 변수 치환($x'=x-1$)을 완료하여 기본 공식 $_nH_r$ 패턴 형상으로 변환한 뒤 유도하십시오."
  },
  {
    id: "MATH2022-ST-002",
    subject: "확률과 통계",
    chapter: "통계",
    sub_chapter: "통계적 추정",
    formula_name: "모평균의 신뢰구간 추정",
    formula_latex: "[m \\text{의 95\\% 신뢰구간}] \\quad \\bar{x} - 1.96 \\frac{\\sigma}{\\sqrt{n}} \\leq m \\leq \\bar{x} + 1.96 \\frac{\\sigma}{\\sqrt{n}}",
    description: "표본의 크기가 $n$인 표본의 평균 $\\bar{x}$와 모표준편차 $\\sigma$를 활용하여 알려지지 않은 국가나 전체 모공통 평균 $m$을 정해진 신뢰수준(95%)으로 구간을 가두어 추정하는 기초 식입니다.",
    importance: "상",
    tags: ["통계", "추정", "신뢰구간"],
    curriculum_note: "실생활 여론조사 및 표본 오차 표기에 절대적으로 결부되는 실용 교육과정 필수 파트입니다.",
    solution_guide: "신뢰구간의 전체 폭(길이)은 $L = 2 \\times 1.96 \\times \\frac{\\sigma}{\\sqrt{n}}$ 로서 표본 평균 $\\bar{x}$ 의 실제 수량과는 상관없이 일정하게 도출됩니다."
  },

  // ================= 기하 =================
  {
    id: "MATH2022-GE-001",
    subject: "기하",
    chapter: "이차곡선",
    sub_chapter: "포물선",
    formula_name: "포물선의 정의 및 방정식",
    formula_latex: "y^2 = 4px \\quad (준선 \\ x = -p, \\ 초점 \\ F(p, 0))",
    description: "한 고정된 좌표 초점 $F$와 한 직선 준선에 다다르는 두 절대적 거리가 완전히 기하학적으로 같은 평면 위의 자취들의 총합입니다.",
    importance: "상",
    tags: ["기하", "이차곡선", "포물선"],
    curriculum_note: "기하는 고교 2~3학년 진로 선택 과목으로, 기하학적 직관력이 대단히 소중하게 지목되는 분기점입니다.",
    solution_guide: "포물선 관련 기출문제의 90% 이상은 수식 계산보다는 '초점과 준선까지의 임의 길이가 같다'는 정의 자체를 작도 성질로 그리는 과정에서 허무할 정도로 간결히 해결됩니다."
  },

  // ================= 미적분 II =================
  {
    id: "MATH2022-M2-001",
    subject: "미적분II",
    chapter: "여러 가지 미분법",
    sub_chapter: "도함수",
    formula_name: "초월함수의 미분 공식",
    formula_latex: "(\\ln x)' = \\frac{1}{x}, \\quad (e^x)' = e^x, \\quad (\\sin x)' = \\cos x, \\quad (\\cos x)' = -\\sin x",
    description: "대수적 다항 영역을 크게 벗어나 초월 영역인 지수함수, 자연로그, 대표 삼각 비율 성분들을 정성스럽게 변화율 도함수로 연결한 이과 지배 핵심 공식들입니다.",
    importance: "상",
    tags: ["미적분2", "초월함수", "미분"],
    curriculum_note: "★2022 개정 세부사항 반영: 2015 개정 '미적분'의 수열 극한과 초월함수 미적분이 이제 이과 특화 진로 선택형 과목인 '미적분II'로 공식 격상되었습니다.",
    solution_guide: "코사인 미분 시 우하단에 발현되는 마이너스($-$) 부호의 혼동을 미연에 봉쇄하는 학습 훈련이 최우선 요구됩니다."
  }
];
