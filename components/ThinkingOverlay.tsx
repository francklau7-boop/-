import React, { useEffect, useState } from 'react';
import { Database, Search, BrainCircuit, MessageSquare, FileText, Globe, Layers, Cpu } from 'lucide-react';
import { SimulationStep, AppState } from '../types';
import VesynAvatar from './VesynAvatar';

interface ThinkingOverlayProps {
  appState: AppState;
  domainMethodology: string;
  onComplete?: () => void;
}

const ThinkingOverlay: React.FC<ThinkingOverlayProps> = ({ appState, domainMethodology, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Define steps based on the context (State)
  let steps: SimulationStep[] = [];

  if (appState === AppState.LOADING) {
    steps = [
      { message: `小唯正在接入行业基准数据库...`, icon: 'database', delay: 1500 },
      { message: `运用 ${domainMethodology} 扫描组织断层...`, icon: 'search', delay: 1500 },
      { message: `识别管理卡点与核心矛盾...`, icon: 'brain', delay: 1500 },
      { message: `小唯正在起草诊断综述...`, icon: 'file', delay: 1000 }
    ];
  } else if (appState === AppState.GENERATING_PROMPT) {
    steps = [
       { message: `小唯正在设计执行方案架构...`, icon: 'layers', delay: 2000 },
       { message: `实例化您的专项执行顾问...`, icon: 'cpu', delay: 2000 },
       { message: `规划变革路径与关键里程碑...`, icon: 'globe', delay: 2000 },
       { message: `正在生成高阶执行指令 (Meta-Prompt)...`, icon: 'message', delay: 2500 }
    ];
  }

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [appState]);

  useEffect(() => {
    if (steps.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (currentStepIndex < steps.length) {
      timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, steps[currentStepIndex].delay);
    } else {
      if (onComplete) {
         timeout = setTimeout(() => {
            onComplete();
         }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentStepIndex, steps, onComplete]);

  if (steps.length === 0) return null;

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 transition-all duration-500">
      <div className="bg-slate-800 p-12 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full text-center relative overflow-hidden ring-1 ring-white/10">
        {/* Deep, abstract background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px]"></div>

        <div className="flex justify-center mb-8 relative z-10 scale-125">
           <VesynAvatar size="xl" className="shadow-[0_0_40px_rgba(96,165,250,0.3)] ring-4 ring-slate-800" />
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-white mb-2 relative z-10 tracking-tight">
          小唯 <span className="text-blue-400">|</span> 资深组织咨询顾问
        </h3>
        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-8 font-medium">Xiao Wei • Senior Consultant</p>
        
        <div className="h-0.5 w-full bg-slate-700 rounded-full mb-8 overflow-hidden relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 shadow-[0_0_15px_#60A5FA] transition-all duration-700 ease-in-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="flex flex-col items-center relative z-10 h-10 justify-center">
            <p className="text-sm font-mono font-medium text-blue-200 animate-pulse">
            {currentStep.message}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ThinkingOverlay;