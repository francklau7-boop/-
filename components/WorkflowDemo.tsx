import React, { useState, useEffect } from 'react';
import { Map, FileSearch, Cpu, Zap, ArrowRight, BrainCircuit, CheckCircle2, User, Target, BarChart, Layers, FileText, CheckSquare, Search, ShieldCheck } from 'lucide-react';
import VesynAvatar from './VesynAvatar';

const STEPS = [
  {
    id: 0,
    title: '战略锚点定位',
    subtitle: 'Strategic Anchoring',
    desc: '不仅是选方向。系统构建高维战略坐标系，精准识别组织痛点所在的象限与层级。',
    icon: Target,
    color: 'blue'
  },
  {
    id: 1,
    title: '根因穿透诊断',
    subtitle: 'Deep-Dive Diagnosis',
    desc: '摒弃表层问答。顾问通过 3-5 轮递归式问询，剥离症状，直击阻碍业务的根本原因。',
    icon: Search,
    color: 'indigo'
  },
  {
    id: 2,
    title: '策略与智能体构建',
    subtitle: 'Agent Instantiation',
    desc: '生成专业级诊断报告，并基于决策模型，为您配置一位专属的“虚拟执行合伙人”。',
    icon: Layers,
    color: 'purple'
  },
  {
    id: 3,
    title: '沙盘推演与交付',
    subtitle: 'Simulation & Delivery',
    desc: '在虚拟环境中预演变革方案，输出 OKR、制度表单等可直接落地的执行工具。',
    icon: Zap,
    color: 'emerald'
  }
];

interface MockWindowProps {
  title: string;
  children?: React.ReactNode;
}

const MockWindow = ({ children, title }: MockWindowProps) => (
  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 ring-1 ring-slate-900/5 overflow-hidden flex flex-col h-[420px] md:h-[500px] w-full relative transition-all duration-500">
    {/* Mock Window Header - Glassmorphism */}
    <div className="bg-white/50 border-b border-slate-100/50 px-5 py-3 flex items-center justify-between flex-shrink-0 backdrop-blur-md z-20">
      <div className="flex space-x-2">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
      </div>
      <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100/50 rounded-full border border-slate-200/50">
          <ShieldCheck className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] font-mono text-slate-500 font-medium tracking-wide">{title}</span>
      </div>
      <div className="w-8"></div> 
    </div>
    
    {/* Grid Background */}
    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
    </div>

    {/* Window Body */}
    <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {children}
    </div>
  </div>
);

// --- Refined Mock Screens ---

const ScreenStep1 = () => (
  <div className="p-8 h-full flex flex-col animate-fade-in">
    <div className="flex items-center justify-between mb-6">
        <div>
            <h4 className="text-sm font-bold text-slate-800">组织效能热力图</h4>
            <p className="text-[10px] text-slate-400">Strategic Heatmap Analysis</p>
        </div>
        <div className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">
            高风险预警
        </div>
    </div>
    
    {/* Visualization of a Matrix/Heatmap */}
    <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-mono">Q1: 战略</div>
            <div className="h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-200 opacity-20 group-hover:bg-blue-100 transition-colors"></div>
            </div>
        </div>
        <div className="bg-red-50/50 rounded-xl border border-red-100 p-4 relative overflow-hidden ring-2 ring-red-50 group">
            <div className="absolute top-2 right-2 text-[9px] text-red-400 font-mono font-bold">Q2: 组织</div>
            <div className="absolute bottom-3 left-3 space-y-1">
                <div className="w-20 h-1.5 bg-red-200 rounded-full"></div>
                <div className="w-12 h-1.5 bg-red-200 rounded-full"></div>
            </div>
            <div className="flex items-center justify-center h-full">
                <span className="text-xs font-bold text-red-600 bg-white/80 px-2 py-1 rounded shadow-sm backdrop-blur-sm">
                    痛点集中区
                </span>
            </div>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 relative overflow-hidden">
             <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-mono">Q3: 人才</div>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 relative overflow-hidden">
             <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-mono">Q4: 文化</div>
        </div>
    </div>

    {/* Context Input Simulation */}
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-bold text-slate-700">锁定核心挑战</span>
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
            检测到<span className="font-semibold text-slate-900 mx-1">跨部门协同效率</span>低于行业基准 25%。建议优先从“组织架构”与“流程机制”双向切入。
        </div>
    </div>
  </div>
);

const ScreenStep2 = () => (
    <div className="flex flex-col h-full animate-fade-in bg-slate-50/30">
        <div className="flex-1 p-6 space-y-6 overflow-hidden">
            {/* Consultant Message */}
            <div className="flex items-start">
                <div className="mr-3 flex-shrink-0 mt-1"><VesynAvatar size="sm" /></div>
                <div className="space-y-1 max-w-[90%]">
                    <div className="text-[10px] text-slate-400 ml-1">小唯 | 资深顾问</div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-xs text-slate-700 leading-relaxed">
                        明白了。既然“流程审批”是主要卡点，我想深入问一下：<br/><br/>
                        <span className="font-semibold text-slate-900">目前的授权体系中，是一线经理没有决策权，还是虽然有权但不敢担责？</span>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] rounded font-medium">根因探查</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] rounded font-medium">权责对等性</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Selection Simulation */}
            <div className="flex justify-end">
                 <div className="space-y-2 w-[85%]">
                    <div className="bg-indigo-600 text-white p-3 rounded-xl rounded-tr-sm text-xs font-medium shadow-md flex items-center justify-between cursor-default">
                        <span>有权但不敢担责，因为缺乏容错机制</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-200" />
                    </div>
                 </div>
            </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100/50 backdrop-blur-sm">
            <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg w-full flex items-center px-4 justify-between">
                <span className="text-slate-400 text-xs">正在分析回答模式...</span>
                <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                </div>
            </div>
        </div>
    </div>
);

const ScreenStep3 = () => (
    <div className="h-full flex flex-row animate-fade-in bg-slate-50">
        {/* Sidebar: Report Structure */}
        <div className="w-48 h-full bg-white border-r border-slate-200 p-5 flex flex-col hidden md:flex">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Report Outline</div>
            <div className="space-y-3">
                <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                <div className="pt-2">
                     <div className="h-2 w-28 bg-blue-100 rounded-full"></div>
                </div>
                <div className="h-2 w-12 bg-slate-100 rounded-full"></div>
            </div>
            
            <div className="mt-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[9px] font-bold text-slate-500">Agent Ready</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-emerald-500"></div>
                </div>
            </div>
        </div>

        {/* Main: Strategy Card */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center w-full max-w-sm relative z-10 transform hover:scale-105 transition-transform duration-500">
                <VesynAvatar size="lg" className="mx-auto -mt-12 shadow-lg ring-4 ring-white" />
                
                <h3 className="mt-4 text-sm font-bold text-slate-900">组织变革专项顾问</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Instantiated by Vesyn Core</p>
                
                <div className="space-y-2 text-left bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center text-[10px] text-slate-600">
                        <Target className="w-3 h-3 mr-2 text-blue-500" />
                        <span>目标：构建敏捷型组织</span>
                    </div>
                    <div className="flex items-center text-[10px] text-slate-600">
                        <ShieldCheck className="w-3 h-3 mr-2 text-purple-500" />
                        <span>风控：规避权责真空区</span>
                    </div>
                </div>
                
                <button className="mt-4 w-full py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-colors">
                    查看完整策略
                </button>
            </div>
        </div>
    </div>
);

const ScreenStep4 = () => (
    <div className="flex flex-col h-full animate-fade-in bg-white">
        {/* Header Bar */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4">
             <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-xs font-bold text-slate-700">执行沙盘 (Simulation)</span>
             </div>
             <div className="flex space-x-2">
                 <button className="p-1 hover:bg-slate-100 rounded"><FileText className="w-3.5 h-3.5 text-slate-400" /></button>
                 <button className="p-1 hover:bg-slate-100 rounded"><BarChart className="w-3.5 h-3.5 text-slate-400" /></button>
             </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
             {/* Command */}
             <div className="flex justify-end">
                <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-2xl rounded-tr-sm text-xs font-medium inline-block shadow-sm">
                    生成本季度的关键结果 (Key Results)
                </div>
            </div>

            {/* Agent Output: The Table */}
            <div className="flex items-start">
                 <div className="mr-3 flex-shrink-0"><VesynAvatar size="sm" /></div>
                 <div className="flex-1">
                     <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center">
                            <Zap className="w-3 h-3 text-amber-500 mr-2" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Generated Output</span>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-slate-50/50 text-slate-500">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Objective</th>
                                        <th className="px-3 py-2 font-medium">Key Result (KR)</th>
                                        <th className="px-3 py-2 font-medium">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-3 py-2 font-bold text-slate-700">O1: 提升敏捷度</td>
                                        <td className="px-3 py-2 text-slate-600">决策链条缩短至 3 层以内</td>
                                        <td className="px-3 py-2 text-slate-400 font-mono">Q3 End</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2 text-slate-600">跨部门项目交付周期 -20%</td>
                                        <td className="px-3 py-2 text-slate-400 font-mono">Q4 Mid</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-[9px] text-slate-400">已对齐战略目标</span>
                            <button className="text-[9px] font-bold text-blue-600 hover:underline">导出 Excel</button>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    </div>
);

const WorkflowDemo: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4500); // Slightly longer for readability
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start py-8">
      
      {/* Left: Interactive Navigation (Vertical Timeline) */}
      <div className="lg:col-span-5 relative pl-4" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
         {/* Vertical Connector Line */}
         <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-slate-100 hidden lg:block"></div>

         <div className="space-y-6">
            {STEPS.map((step, index) => {
                const isActive = activeStep === index;
                const Icon = step.icon;
                
                return (
                    <div 
                        key={step.id}
                        onClick={() => setActiveStep(index)}
                        className={`group relative pl-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-start ${
                            isActive ? 'translate-x-2' : 'hover:translate-x-1'
                        }`}
                    >
                        {/* Icon Node */}
                        <div className={`relative z-10 w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all duration-300 mr-5 shadow-sm ${
                            isActive 
                            ? `bg-${step.color}-600 border-${step.color}-600 text-white shadow-${step.color}-200 shadow-lg scale-110` 
                            : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-600'
                        }`}>
                            <Icon className="w-5 h-5" />
                        </div>

                        {/* Text Content */}
                        <div className={`pt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? `text-${step.color}-600` : 'text-slate-400'}`}>
                                    Step 0{index + 1}
                                </span>
                            </div>
                            <h3 className={`text-lg font-bold mb-2 leading-tight ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                {step.title}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-xs">
                                {step.desc}
                            </p>
                            
                            {/* Active Indicator Bar (Progress) */}
                            {isActive && (
                                <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                    <div className={`h-full bg-${step.color}-500 animate-[width_4.5s_linear_infinite]`} style={{ width: '0%' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
         </div>
      </div>

      {/* Right: Premium Mock Window */}
      <div className="lg:col-span-7 relative perspective-[2000px] group">
          
          {/* Ambient Glows */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-purple-100 to-emerald-100 rounded-[30px] opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>

          <div className="relative transform transition-all duration-700 ease-out rotate-y-2 group-hover:rotate-y-0 group-hover:scale-[1.01]">
             {activeStep === 0 && <MockWindow title="Vesyn_OS // Matrix_Analysis"><ScreenStep1 /></MockWindow>}
             {activeStep === 1 && <MockWindow title="Vesyn_OS // Diagnostic_Protocol"><ScreenStep2 /></MockWindow>}
             {activeStep === 2 && <MockWindow title="Vesyn_OS // Strategy_Core"><ScreenStep3 /></MockWindow>}
             {activeStep === 3 && <MockWindow title="Vesyn_OS // Execution_Sandbox"><ScreenStep4 /></MockWindow>}
          </div>
          
      </div>

    </div>
  );
};

export default WorkflowDemo;