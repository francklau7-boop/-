import { 
  Users, 
  GitMerge, 
  Briefcase, 
  Banknote, 
  Target, 
  UserPlus, 
  GraduationCap, 
  RefreshCw, 
  HeartHandshake, 
  Cpu,
  LayoutGrid
} from 'lucide-react';
import { Domain } from './types';

export const DOMAINS: Domain[] = [
  {
    id: 'OD',
    title: '组织效能 (OD)',
    description: '打破部门墙，通过组织诊断提升整体人效与敏捷度',
    methodology: '麦肯锡 7S 模型',
    mentalModel: '系统思维 (整体关联性)',
    icon: LayoutGrid,
    color: 'bg-blue-600',
    diagnosticQuestions: ['管理幅度过宽?', '部门墙严重?', '决策流程冗长?', '人效低于行业均值?', '权责不对等?'],
    symptoms: [
      '汇报关系混乱，多头管理',
      '跨部门推诿，部门墙严重',
      '决策流程太长，响应市场慢',
      '人效持续下降，大公司病',
      '总部与分公司权责不清'
    ],
    outcomes: [
      '组织扁平化，提升敏捷度',
      '明确责权利，减少内耗',
      '提升人均产出 (人效)',
      '打造赋能型总部',
      '实现业务闭环管理'
    ],
    subItems: [
      { id: 'O1', label: '组织诊断 (Organization Diagnostic)' },
      { id: 'O2', label: '定岗定编 (Headcount Planning)' },
      { id: 'O3', label: '管控模式 (Control Model)' },
    ],
  },
  {
    id: 'SP',
    title: '战略人力规划',
    description: '确保关键岗位人才供给，让组织能力跑在战略前面',
    methodology: '尤里奇价值模型',
    mentalModel: '价值链分析 (业务影响力)',
    icon: GitMerge,
    color: 'bg-indigo-600',
    diagnosticQuestions: ['关键岗位空缺率?', '人才供应链断裂?', '战略与能力不匹配?', '人才密度不足?', '继任储备为零?'],
    symptoms: [
      '新业务开展找不到领军人',
      '关键岗位一旦离职就瘫痪',
      '现有团队能力跟不上战略',
      '人才梯队断层，没人接班',
      '人员冗余但关键人才缺乏'
    ],
    outcomes: [
      '人才供给跑在业务前面',
      '核心岗位 1:2 继任储备',
      '识别并保留高潜人才',
      '提升关键人才密度',
      '优化人才结构配置'
    ],
    subItems: [
      { id: 'S1', label: '人才盘点 (Talent Review)' },
      { id: 'S2', label: '人才画像 (Talent Persona)' },
      { id: 'S3', label: '继任者计划 (Succession Planning)' },
    ],
  },
  {
    id: 'JOB',
    title: '岗位与职级',
    description: '构建清晰的职级体系，实现内部公平与人才保留',
    methodology: '美世 IPE 系统',
    mentalModel: '结构化层级与内部公平性',
    icon: Briefcase,
    color: 'bg-slate-700',
    diagnosticQuestions: ['职级通胀?', '职业发展通道受阻?', '岗位价值评估主观?', '小微企业大Title?', '任职资格模糊?'],
    symptoms: [
      '职级随意定，头衔通胀严重',
      '员工觉得没奔头，晋升无望',
      '岗位职责不清，这就该你做',
      '同工不同酬，内部不公平',
      '技术人员为了涨薪只能转管理'
    ],
    outcomes: [
      '建立H型双通道发展路径',
      '职级体系对标市场标准',
      '岗位价值与薪酬挂钩',
      '清晰的任职资格标准',
      '实现内部相对公平'
    ],
    subItems: [
      { id: 'J1', label: 'IPE 评估 (Position Evaluation)' },
      { id: 'J2', label: '职级表设计 (Grading Structure)' },
      { id: 'J3', label: '岗位说明书 (Job Description)' },
    ],
  },
  {
    id: 'COMP',
    title: '薪酬激励',
    description: '设计高杠杆薪酬激励体系，精准激发核心人才动力',
    methodology: '海氏/美世方法论',
    mentalModel: '全面薪酬与行为经济学',
    icon: Banknote,
    color: 'bg-emerald-600',
    diagnosticQuestions: ['内部公平性失衡?', '薪酬倒挂?', '缺乏P75分位竞争力?', '变动薪酬激励不足?', '福利感知度低?'],
    symptoms: [
      '老员工工资不如新招的应届生',
      '干多干少一个样，大锅饭',
      '薪酬没竞争力，招不来牛人',
      '奖金发了大家也不满意',
      '调薪规则不透明，靠拍脑袋'
    ],
    outcomes: [
      '薪酬对标市场 P75 分位',
      '实现差异化激励，向奋斗者倾斜',
      '解决薪酬倒挂历史遗留问题',
      '设计高杠杆的奖金包',
      '建立科学的调薪机制'
    ],
    subItems: [
      { id: 'C1', label: '调薪策略 (Salary Increase)' },
      { id: 'C2', label: '奖金方案 (Bonus Scheme)' },
      { id: 'C3', label: '股权激励 (ESOP)' },
    ],
  },
  {
    id: 'PERF',
    title: '绩效管理',
    description: '将战略目标拆解到底，打造数据驱动的高绩效文化',
    methodology: 'BSC 平衡计分卡',
    mentalModel: '目标对齐与反馈闭环',
    icon: Target,
    color: 'bg-red-600',
    diagnosticQuestions: ['目标无法对齐战略?', '考核流于形式?', '缺乏过程反馈?', '绩效结果应用脱节?', '指标过细或过宽?'],
    symptoms: [
      'KPI 定了没人看，年底算总账',
      '目标和公司战略两张皮',
      '管理者不敢打低分，全是好人',
      '绩效结果没用，不影响晋升',
      '指标太细太繁琐，为了考核而考核'
    ],
    outcomes: [
      '上下同欲，目标 100% 对齐',
      '培养管理者绩效辅导能力',
      '不仅看结果，也要看过程',
      '区分高绩效与低绩效员工',
      '激活组织活力'
    ],
    subItems: [
      { id: 'P1', label: 'OKR 设计 (Objectives & Key Results)' },
      { id: 'P2', label: '绩效面谈 (Performance Feedback)' },
      { id: 'P3', label: '强制分布纠偏 (Calibration)' },
    ],
  },
  {
    id: 'REC',
    title: '招聘配置',
    description: '缩短招聘周期，基于胜任力模型精准识别高潜人才',
    methodology: '行为面试法 (STAR)',
    mentalModel: '基于胜任力的评估模型',
    icon: UserPlus,
    color: 'bg-orange-500',
    diagnosticQuestions: ['招聘周期(TTF)过长?', '面试官标准不一?', '人岗匹配度低?', 'offer拒绝率高?', '雇主品牌弱?'],
    symptoms: [
      '招人太慢，业务部门天天催',
      '面试官看眼缘，招进来不合适',
      '好不容易发 Offer 被拒了',
      '入职没几天就离职',
      '公司没名气，简历质量差'
    ],
    outcomes: [
      '缩短招聘周期 (TTF)',
      '统一面试标准，精准识人',
      '提升候选人面试体验',
      '提升试用期转正率',
      '打造有吸引力的雇主品牌'
    ],
    subItems: [
      { id: 'R1', label: 'JD 优化 (Job Description)' },
      { id: 'R2', label: '面试官题库 (Interview Questions)' },
      { id: 'R3', label: '雇主品牌 (Employer Branding)' },
    ],
  },
  {
    id: 'L&D',
    title: '人才发展 (L&D)',
    description: '构建领导力梯队，将培训投入转化为实际业务产出',
    methodology: '拉姆查兰领导力梯队',
    mentalModel: '成长型思维 & 70-20-10法则',
    icon: GraduationCap,
    color: 'bg-teal-600',
    diagnosticQuestions: ['培训转化率低?', '学习地图缺失?', '高潜人才流失?', '领导力断层?', '缺乏实战场景?'],
    symptoms: [
      '培训听着激动，回去一动不动',
      '业务部门觉得培训浪费时间',
      '内部经验沉淀不下来',
      '管理者自己强，不会带团队',
      '新人上手太慢'
    ],
    outcomes: [
      '培训直接赋能业务痛点',
      '沉淀内部最佳实践案例',
      '建立内部讲师 (TTT) 体系',
      '加速新员工胜任速度',
      '打造学习型组织文化'
    ],
    subItems: [
      { id: 'L1', label: '领导力梯队 (Leadership Pipeline)' },
      { id: 'L2', label: '内训师体系 (Internal Trainer)' },
      { id: 'L3', label: 'IDP 计划 (Individual Development)' },
    ],
  },
  {
    id: 'CM',
    title: '变革管理',
    description: '降低变革阻力，在动荡期快速统一全员认知与行动',
    methodology: '科特八步变革',
    mentalModel: '变革心理学 (ADKAR)',
    icon: RefreshCw,
    color: 'bg-purple-600',
    diagnosticQuestions: ['变革阻力大?', '沟通机制失效?', '文化冲突?', '缺乏紧迫感?', '短期阵痛剧烈?'],
    symptoms: [
      '老员工抵触新政策，推不动',
      '小道消息满天飞，人心惶惶',
      '并购后两拨人融不到一块',
      '变革只有口号，没有动作',
      '业务受变革影响，业绩下滑'
    ],
    outcomes: [
      '平稳过渡，降低变革阻力',
      '统一思想，建立变革紧迫感',
      '实现文化融合与认同',
      '快速取得短期速赢 (Quick Wins)',
      '保障核心人才稳定'
    ],
    subItems: [
      { id: 'M1', label: '并购整合 (M&A Integration)' },
      { id: 'M2', label: '文化重塑 (Culture Transformation)' },
      { id: 'M3', label: '变革阻力诊断 (Resistance Diagnosis)' },
    ],
  },
  {
    id: 'ER',
    title: '员工关系',
    description: '提升组织敬业度，构建零风险的心理安全契约',
    methodology: '盖洛普 Q12',
    mentalModel: '心理契约与心理安全感',
    icon: HeartHandshake,
    color: 'bg-pink-600',
    diagnosticQuestions: ['敬业度(Q12)低?', '劳资纠纷风险?', '心理安全感缺失?', '沟通渠道不畅?', '离职率异常?'],
    symptoms: [
      '员工士气低落，都在摸鱼',
      '裁员处理不当，有仲裁风险',
      '员工不敢说真话，氛围压抑',
      '核心员工被竞争对手挖角',
      '加班严重，员工怨气大'
    ],
    outcomes: [
      '提升员工敬业度 (Q12)',
      '合规用工，零劳动仲裁',
      '建立心理安全感',
      '顺畅的员工沟通渠道',
      '提升员工满意度与保留率'
    ],
    subItems: [
      { id: 'E1', label: '敬业度调查 (Engagement Survey)' },
      { id: 'E2', label: '劳动法风控 (Compliance Risk)' },
      { id: 'E3', label: '离职面谈 (Exit Interview)' },
    ],
  },
  {
    id: 'DIGI',
    title: 'HR 数字化',
    description: '从“表哥表姐”转型数据驱动，用 AI 重构 HR 服务体验',
    methodology: 'Gartner 数字化模型',
    mentalModel: '敏捷转型与数据流动性',
    icon: Cpu,
    color: 'bg-cyan-600',
    diagnosticQuestions: ['数据孤岛?', '系统体验差?', '报表手工化?', '缺乏数据洞察?', 'AI 落地场景模糊?'],
    symptoms: [
      'HR 每天忙着做 Excel 表，效率低',
      '系统太多，数据不通，全是孤岛',
      '想看数据分析，系统里导不出来',
      '员工吐槽系统太难用，体验差',
      '想用 AI 但不知道从哪入手'
    ],
    outcomes: [
      '实现 HR 流程自动化',
      '打通数据孤岛，数据驱动决策',
      '提升员工端 (App) 使用体验',
      'AI 辅助员工服务与招聘',
      '构建一体化 HR 数字化平台'
    ],
    subItems: [
      { id: 'D1', label: 'AI Agent 落地 (AI Implementation)' },
      { id: 'D2', label: '数据资产地图 (Data Mapping)' },
      { id: 'D3', label: 'HR 系统选型 (System Selection)' },
    ],
  },
];