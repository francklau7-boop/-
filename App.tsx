import React, { useState, useEffect, useRef } from 'react';
import { DOMAINS } from './constants';
import { AppState, Domain, SubItem, UserFormData, HistorySession, RefineType, InquiryHistoryItem, DiagnosticStep } from './types';
import DomainCard from './components/DomainCard';
import ThinkingOverlay from './components/ThinkingOverlay';
import PromptResult from './components/PromptResult';
import InputForm from './components/InputForm';
import HistorySidebar from './components/HistorySidebar';
import ConsultantInquiry from './components/ConsultantInquiry';
import DiagnosticReport from './components/DiagnosticReport';
import VirtualConsultantSession from './components/VirtualConsultantSession';
import WorkflowDemo from './components/WorkflowDemo';
import { generateHrPrompt, refineHrPrompt, refineHrPromptWithChat, generateNextDiagnosticStep, generateDiagnosticReport, refineDiagnosticReportWithChat } from './services/geminiService';
import { Sparkles, History as HistoryIcon, Stethoscope, LayoutGrid, Bot, PlayCircle, Trash2, ArrowRight, Map, FileSearch, Zap, Cpu, ChevronDown, CheckCircle2, Shield } from 'lucide-react';

// Brand Logo Component - "Vesyn - The Converging V"
const VesynLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-900 group-hover:text-blue-700 transition-colors">
    {/* Outer Structure - The System / Diamond */}
    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"/>
    
    {/* Inner V - The Insight Vector */}
    <path d="M11 12L18 26L25 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* The Point - Consciousness (The 'Ajna' or Third Eye position, floating above) */}
    <circle cx="18" cy="7" r="2.5" fill="currentColor" className="text-blue-600" />
  </svg>
);

const SESSION_STORAGE_KEY = 'vesyn_active_session_v1';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSubTask, setSelectedSubTask] = useState<SubItem | null>(null);
  
  // Structured Form State
  const [formData, setFormData] = useState<UserFormData>({
    industry: '',
    orgMaturity: '',
    stakeholders: '',
    currentState: '',
    futureState: ''
  });

  // Iterative Inquiry State
  const [inquiryHistory, setInquiryHistory] = useState<InquiryHistoryItem[]>([]);
  const [currentDiagnosticStep, setCurrentDiagnosticStep] = useState<DiagnosticStep | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<string>('');

  const [generatedContent, setGeneratedContent] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  
  // History State
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Refs for scrolling
  const workflowRef = useRef<HTMLDivElement>(null);
  const domainsRef = useRef<HTMLDivElement>(null);

  // --- 1. Load Completed History on Mount ---
  useEffect(() => {
    const savedHistory = localStorage.getItem('hr_prompt_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // --- 2. Restore Active Session (Auto-Resume) ---
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Only restore if we are not in Dashboard, or if the user refreshed the page while in a process
        if (session.appState !== AppState.DASHBOARD) {
            setAppState(session.appState);
            // Restore Domain object from ID
            const domain = DOMAINS.find(d => d.id === session.domainId);
            setSelectedDomain(domain || null);
            setSelectedSubTask(session.selectedSubTask);
            setFormData(session.formData);
            setInquiryHistory(session.inquiryHistory);
            setCurrentDiagnosticStep(session.currentDiagnosticStep);
            setDiagnosticReport(session.diagnosticReport);
            setGeneratedContent(session.generatedContent);
        }
      } catch (e) {
        console.error("Failed to restore active session", e);
      }
    }
  }, []);

  // --- 3. Auto-Save Active Session ---
  useEffect(() => {
    const sessionData = {
      appState,
      domainId: selectedDomain?.id,
      selectedSubTask,
      formData,
      inquiryHistory,
      currentDiagnosticStep,
      diagnosticReport,
      generatedContent,
      timestamp: Date.now()
    };
    
    // Only save if we are actually doing something (not just empty dashboard)
    if (appState !== AppState.DASHBOARD || selectedDomain) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }
  }, [appState, selectedDomain, selectedSubTask, formData, inquiryHistory, currentDiagnosticStep, diagnosticReport, generatedContent]);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('hr_prompt_history', JSON.stringify(history));
  }, [history]);

  // --- Navigation Handlers ---

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDomainSelect = (domain: Domain) => {
    // If clicking the SAME domain that is currently active/paused, resume it.
    if (selectedDomain?.id === domain.id && appState !== AppState.DASHBOARD) {
        // Just ensure we go to Input if we were somehow in dashboard but had data
        if (appState === AppState.DASHBOARD) {
             setAppState(AppState.INPUT);
        }
        return; 
    }

    // New Domain Selection -> Reset
    setSelectedDomain(domain);
    setAppState(AppState.INPUT);
    
    // Reset form & states for new domain
    setFormData({ 
      industry: '', 
      orgMaturity: '', 
      stakeholders: '', 
      currentState: '',
      futureState: ''
    });
    setSelectedSubTask(null);
    setInquiryHistory([]);
    setCurrentDiagnosticStep(null);
    setDiagnosticReport('');
    setGeneratedContent('');
  };

  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to fetch next question or finish
  const fetchNextStep = async (currentHistory: InquiryHistoryItem[]) => {
    if (!selectedDomain) return;
    
    setIsLoadingStep(true);
    const taskLabel = selectedSubTask ? selectedSubTask.label : 'General Inquiry';
    
    try {
      const step = await generateNextDiagnosticStep(selectedDomain.title, taskLabel, formData, currentHistory);
      
      if (step.isComplete) {
         setAppState(AppState.LOADING);
         const report = await generateDiagnosticReport(selectedDomain.title, formData, currentHistory);
         setDiagnosticReport(report);
      } else {
         setCurrentDiagnosticStep(step);
         setAppState(AppState.INQUIRY);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingStep(false);
    }
  };

  const handleInputSubmit = () => {
    // If we already have history/step (resuming), just go to Inquiry
    if (inquiryHistory.length > 0 || currentDiagnosticStep) {
        setAppState(AppState.INQUIRY);
        if (!currentDiagnosticStep && inquiryHistory.length > 0) {
            fetchNextStep(inquiryHistory); // Fetch next if stuck
        } else if (!currentDiagnosticStep && inquiryHistory.length === 0) {
            setAppState(AppState.LOADING); // Start fresh
            fetchNextStep([]);
        }
        return;
    }

    setAppState(AppState.LOADING); 
    fetchNextStep([]);
  };

  const handleInquiryAnswer = (answer: string) => {
    if (!currentDiagnosticStep) return;

    // Snapshot the current step before moving forward
    const newHistoryItem: InquiryHistoryItem = {
      question: currentDiagnosticStep.question,
      answer: answer,
      stepSnapshot: currentDiagnosticStep 
    };
    
    const updatedHistory = [...inquiryHistory, newHistoryItem];
    setInquiryHistory(updatedHistory);
    setCurrentDiagnosticStep(null); 
    fetchNextStep(updatedHistory);
  };

  const handleReportRefine = (instruction: string) => {
    if (!diagnosticReport) return;
    setIsRefining(true);
    
    refineDiagnosticReportWithChat(diagnosticReport, instruction).then((newReport) => {
        setDiagnosticReport(newReport);
        setIsRefining(false);
    });
  };

  const handleReportProceed = () => {
    if (!selectedDomain) return;
    setAppState(AppState.GENERATING_PROMPT);
    
    const taskLabel = selectedSubTask ? selectedSubTask.label : 'General Inquiry';

    generateHrPrompt(
      selectedDomain.title,
      selectedDomain.methodology,
      selectedDomain.mentalModel,
      taskLabel,
      formData,
      diagnosticReport
    ).then((result) => {
      setGeneratedContent(result);
      
      const newSession: HistorySession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        domainId: selectedDomain.id,
        domainTitle: selectedDomain.title,
        subTaskLabel: taskLabel,
        formData: { ...formData },
        inquiryHistory: inquiryHistory,
        diagnosticReport: diagnosticReport,
        generatedContent: result
      };
      
      setHistory(prev => [newSession, ...prev]);
      setAppState(AppState.RESULT);
    });
  };

  const handleRefine = (instruction: string | RefineType) => {
    if (!generatedContent) return;
    setIsRefining(true);

    const promise = (typeof instruction === 'string' && !['STRICTER','EMPATHETIC','RISK_FOCUSED','TACTICAL'].includes(instruction))
      ? refineHrPromptWithChat(generatedContent, instruction)
      : refineHrPrompt(generatedContent, instruction as RefineType);

    promise.then((newContent) => {
      setGeneratedContent(newContent);
      setIsRefining(false);
    });
  };

  const handleRunConsultant = () => {
    if (!generatedContent) return;
    setAppState(AppState.CONSULTANT_SESSION);
  };

  // --- Back Navigation Handlers (Preserving Data) ---

  const handleBackToDashboard = () => {
    setAppState(AppState.DASHBOARD);
  };

  // The Smart Step Back Handler
  const handleStepBack = () => {
     // If there is history, we pop the last item and restore that step
     if (inquiryHistory.length > 0) {
        const lastItem = inquiryHistory[inquiryHistory.length - 1];
        const newHistory = inquiryHistory.slice(0, -1);
        
        setInquiryHistory(newHistory);
        setAppState(AppState.INQUIRY); // Ensure we are on inquiry screen

        // Restore from snapshot if available (it should be)
        if (lastItem.stepSnapshot) {
           setCurrentDiagnosticStep(lastItem.stepSnapshot);
        } else {
           // Fallback for legacy data: re-fetch based on truncated history
           setIsLoadingStep(true);
           fetchNextStep(newHistory);
        }
     } else {
        // No history left? Go back to Input Form
        setAppState(AppState.INPUT);
     }
  };

  const handleBackToReport = () => {
    setAppState(AppState.DIAGNOSTIC_REPORT);
  };

  const handleExitConsultant = () => {
    setAppState(AppState.RESULT);
  };

  const handleOverlayComplete = () => {
    if (currentDiagnosticStep && !diagnosticReport) {
      setAppState(AppState.INQUIRY);
    } 
    else if (diagnosticReport && !generatedContent) {
      setAppState(AppState.DIAGNOSTIC_REPORT);
    } 
    else if (generatedContent) {
      setAppState(AppState.RESULT);
    }
  };

  const handleClearActiveSession = (e: React.MouseEvent) => {
      e.stopPropagation();
      localStorage.removeItem(SESSION_STORAGE_KEY);
      // Reset local state
      setSelectedDomain(null);
      setAppState(AppState.DASHBOARD);
      setFormData({ industry: '', orgMaturity: '', stakeholders: '', currentState: '', futureState: '' });
      setDiagnosticReport('');
      setGeneratedContent('');
      setInquiryHistory([]);
  };

  const handleSelectHistory = (session: HistorySession) => {
    const domain = DOMAINS.find(d => d.id === session.domainId);
    if (domain) {
      setSelectedDomain(domain);
      setFormData(session.formData);
      const sub = domain.subItems.find(s => s.label === session.subTaskLabel);
      setSelectedSubTask(sub || null);
      setGeneratedContent(session.generatedContent);
      if(session.diagnosticReport) setDiagnosticReport(session.diagnosticReport);
      setAppState(AppState.RESULT);
    }
  };

  const hasActiveSession = selectedDomain && appState !== AppState.DASHBOARD;

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 overflow-x-hidden text-slate-800">
      {/* Header */}
      {appState !== AppState.CONSULTANT_SESSION && (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={handleBackToDashboard}>
              <div className="p-1 rounded-lg transition-transform duration-300 group-hover:scale-110">
                <VesynLogo />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-serif font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-900 transition-colors">
                  唯识智能 <span className="text-slate-300 font-sans font-light mx-1">|</span> 小唯
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-[0.25em] uppercase mt-1">XIAO WEI • CONSULTANT</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
               <nav className="hidden md:flex space-x-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                 <button onClick={() => scrollToSection(workflowRef)} className="hover:text-slate-900 transition-colors">系统流程</button>
                 <button onClick={() => scrollToSection(domainsRef)} className="hover:text-slate-900 transition-colors">解决方案</button>
               </nav>
              <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-800 transition-colors relative hover:bg-slate-100 rounded-lg group"
              >
                <HistoryIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${appState === AppState.CONSULTANT_SESSION ? 'h-screen' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'} relative`}>
        
        {/* State: DASHBOARD */}
        {appState === AppState.DASHBOARD && (
          <div className="space-y-16 animate-fade-in pb-20">
            {/* Resume Session Banner */}
            {hasActiveSession && (
                <div className="max-w-4xl mx-auto mt-6 animate-slide-up">
                    <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-lg shadow-blue-500/5 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setAppState(AppState.INPUT)}>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <PlayCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">恢复之前的咨询会话</h3>
                                <p className="text-xs text-slate-500">
                                    {selectedDomain?.title} • {selectedSubTask?.label || 'General'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={handleClearActiveSession}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="放弃未完成的会话"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                                继续
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section - Redesigned for Clarity */}
            <div className="text-center max-w-4xl mx-auto pt-8 sm:pt-16 px-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-8 animate-slide-up shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default" style={{animationDelay: '0.1s'}}>
                 <Sparkles className="w-3 h-3 mr-2 text-blue-400" />
                 AI-Native Enterprise Consultant
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 tracking-tight leading-[1.1] animate-slide-up" style={{animationDelay: '0.2s'}}>
                洞见组织意识<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-indigo-600 to-purple-800">重塑战略未来</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-light mb-10 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.3s'}}>
                 我是<span className="font-semibold text-slate-800">小唯</span>。一套<strong className="text-slate-800 font-medium">企业级组织诊断与决策支持系统</strong>。
                 不同于通用型对话 AI，我遵循严谨的咨询范式，引导您完成从<strong className="text-slate-800 font-medium">“根因分析”</strong>到<strong className="text-slate-800 font-medium">“策略制定”</strong>再到<strong className="text-slate-800 font-medium">“行动演练”</strong>的全流程闭环。
              </p>

              <div className="flex items-center justify-center space-x-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <button onClick={() => scrollToSection(domainsRef)} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 flex items-center">
                      开始专业诊断
                      <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button onClick={() => scrollToSection(workflowRef)} className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm hover:shadow-md flex items-center">
                      系统实时演示
                      <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
              </div>
            </div>

            {/* Section 2: Interactive Workflow Demo (Redesigned) */}
            <div ref={workflowRef} className="max-w-7xl mx-auto pt-10 scroll-mt-24 px-4">
                <div className="text-center mb-12">
                     <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">专家级顾问的思考与交付路径</h3>
                     <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                        并非简单的问答。小唯模拟顶级咨询公司（MBB）的 <span className="font-semibold text-slate-800">“诊断-策略-执行”</span> 闭环，让复杂的组织变革变得清晰、可控、可落地。
                    </p>
                </div>
                
                <WorkflowDemo />
            </div>

            {/* Section 3: Value Proposition */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 group hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 mt-1 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">顶级咨询方法论内嵌</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            系统底层融合了麦肯锡 7S、美世 IPE、盖洛普 Q12 等成熟分析框架。输出的不仅仅是文本，而是具备商业逻辑的决策方案。
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 group hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 mt-1 p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">结构化决策引导</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            拒绝碎片化问答。系统强制遵循 <span className="font-mono text-xs bg-slate-100 px-1 rounded">As-Is</span> (现状) → <span className="font-mono text-xs bg-slate-100 px-1 rounded">To-Be</span> (目标) → <span className="font-mono text-xs bg-slate-100 px-1 rounded">Path</span> (路径) 的变革范式，引导您厘清战略意图。
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 group hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 mt-1 p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                        <Bot className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Meta-Prompt 智能体架构</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            最终交付的不仅是静态文档，更是一套具备“思考-反思-执行”能力的 <span className="font-semibold text-slate-700">AI 数字员工指令集</span>，可直接部署并持续服务。
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Section 4: Domain Matrix (CTA) */}
            <div ref={domainsRef} className="max-w-7xl mx-auto px-4 scroll-mt-24">
              <div className="flex items-center mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <span className="px-6 text-xs font-bold text-blue-600 uppercase tracking-[0.25em] bg-blue-50 py-2 rounded-full border border-blue-100">Step 1: 选择您的业务领域</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DOMAINS.map((domain) => (
                  <DomainCard 
                    key={domain.id} 
                    domain={domain} 
                    onClick={handleDomainSelect} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State: INPUT */}
        {appState === AppState.INPUT && selectedDomain && (
          <InputForm 
            domain={selectedDomain}
            selectedSubTask={selectedSubTask}
            onSubTaskSelect={setSelectedSubTask}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleInputSubmit}
            onBack={handleBackToDashboard}
          />
        )}

        {/* State: LOADING or GENERATING_PROMPT (Overlay) */}
        {(appState === AppState.LOADING || appState === AppState.GENERATING_PROMPT) && selectedDomain && (
          <ThinkingOverlay 
            appState={appState} 
            domainMethodology={selectedDomain.methodology}
            onComplete={appState === AppState.LOADING ? handleOverlayComplete : undefined}
          />
        )}

        {/* State: INQUIRY (New Iterative) */}
        {appState === AppState.INQUIRY && (
          <ConsultantInquiry 
            currentStep={currentDiagnosticStep}
            onAnswer={handleInquiryAnswer}
            isLoading={isLoadingStep}
            stepNumber={inquiryHistory.length + 1}
            onBack={handleStepBack} // Updated to use the smart back handler
          />
        )}

        {/* State: DIAGNOSTIC REPORT */}
        {appState === AppState.DIAGNOSTIC_REPORT && (
          <DiagnosticReport 
            reportContent={diagnosticReport}
            onProceed={handleReportProceed}
            onRefine={handleReportRefine}
            isRefining={isRefining}
            onBack={handleStepBack} // Back from report restores the last question
          />
        )}

        {/* State: RESULT */}
        {appState === AppState.RESULT && (
          <PromptResult 
            content={generatedContent} 
            onReset={handleBackToReport} // Back to Report
            onRefine={handleRefine}
            onRunConsultant={handleRunConsultant}
            isRefining={isRefining}
          />
        )}

        {/* State: CONSULTANT SESSION */}
        {appState === AppState.CONSULTANT_SESSION && selectedDomain && (
          <VirtualConsultantSession 
            systemPrompt={generatedContent}
            onExit={handleExitConsultant}
            domainTitle={selectedDomain.title}
          />
        )}

      </main>

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={history}
        onSelectSession={handleSelectHistory}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
};

export default App;