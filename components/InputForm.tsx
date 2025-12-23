import React from 'react';
import { UserFormData, SubItem, Domain } from '../types';
import { Building2, Users2, Target, HelpCircle, Send, Lightbulb, TrendingUp, AlertTriangle, ArrowRight, Sprout, Rocket, Building, Landmark, Plus, X, Stethoscope, Check } from 'lucide-react';

interface InputFormProps {
  domain: Domain;
  selectedSubTask: SubItem | null;
  onSubTaskSelect: (item: SubItem) => void;
  formData: UserFormData;
  onChange: (field: keyof UserFormData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const COMMON_INDUSTRIES = [
  '互联网/AI', '智能制造', '金融/Fintech', '消费零售', 
  '医疗健康', '企业服务', '房地产/建筑', '教育培训'
];

const COMMON_STAKEHOLDERS = [
  '创始人/CEO', '业务一号位', '中层管理者', 
  'HR 团队', '一线员工', '外部资方/监管'
];

const InputForm: React.FC<InputFormProps> = ({
  domain,
  selectedSubTask,
  onSubTaskSelect,
  formData,
  onChange,
  onSubmit,
  onBack
}) => {
  const isFormValid = formData.industry && formData.currentState && formData.futureState && (selectedSubTask || true);
  
  // Helper to toggle items in a comma-separated string
  const toggleTextItem = (field: 'industry' | 'stakeholders', item: string) => {
    const current = formData[field] ? formData[field].split(', ').filter(Boolean) : [];
    let updated = [];
    if (current.includes(item)) {
      updated = current.filter(i => i !== item);
    } else {
      updated = [...current, item];
    }
    onChange(field, updated.join(', '));
  };

  // Helper for newline-separated lists (Current/Future state)
  const toggleLineItem = (field: 'currentState' | 'futureState', item: string) => {
     const current = formData[field] ? formData[field].split('\n').filter(Boolean) : [];
     let updated = [];
     if (current.includes(item)) {
       updated = current.filter(i => i !== item);
     } else {
       updated = [...current, item];
     }
     onChange(field, updated.join('\n'));
  };

  const isSelected = (field: keyof UserFormData, item: string) => {
    if (field === 'currentState' || field === 'futureState') {
        return formData[field].includes(item);
    }
    return formData[field].includes(item);
  };

  const maturityOptions = [
    { value: "Early Stage Startup", label: "初创期", icon: Sprout, desc: "生存与验证" },
    { value: "Growth Stage", label: "成长期", icon: Rocket, desc: "规模化扩张" },
    { value: "Established Enterprise", label: "成熟期", icon: Building, desc: "流程与矩阵" },
    { value: "Public Sector/SOE", label: "变革期", icon: Landmark, desc: "转型与效能" },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-slide-up pb-12">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 mb-2 flex items-center transition-colors uppercase tracking-widest"
          >
            <span className="mr-1">&larr;</span> 返回矩阵视图
          </button>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl shadow-lg ${domain.color} text-white`}>
              {React.createElement(domain.icon, { className: "w-8 h-8" })}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">{domain.title}</h2>
              <div className="flex items-center text-xs font-medium text-slate-500 mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mr-2">{domain.methodology}</span>
                <span className="flex items-center text-blue-600"><Lightbulb className="w-3 h-3 mr-1" />{domain.mentalModel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Strategic Focus (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-full flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              1. 核心聚焦 (Focus)
            </h3>
            <div className="space-y-2 flex-grow">
              {domain.subItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSubTaskSelect(item)}
                  className={`w-full p-3 text-left rounded-lg border transition-all duration-200 group relative overflow-hidden ${
                    selectedSubTask?.id === item.id 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm' 
                      : 'border-transparent hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`font-mono text-[10px] w-6 ${selectedSubTask?.id === item.id ? 'text-blue-500 font-bold' : 'text-slate-300'}`}>
                        {item.id}
                    </span>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Canvas (9 cols) */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full">
            
            {/* Canvas Header */}
            <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  2. 局势研判画布 (Context)
              </h3>
              <div className="flex space-x-1.5 opacity-50">
                 <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              
              {/* Row 1: Coordinates (Industry + Maturity) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Industry Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">所属行业</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_INDUSTRIES.map(ind => {
                      const active = isSelected('industry', ind);
                      return (
                        <button 
                          key={ind}
                          onClick={() => toggleTextItem('industry', ind)}
                          className={`text-[11px] px-2.5 py-1 rounded-md border transition-all duration-200 ${
                            active 
                            ? 'bg-slate-800 border-slate-800 text-white shadow-md transform scale-105' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {ind}
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="或手动输入..."
                      value={formData.industry}
                      onChange={(e) => onChange('industry', e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-b border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-800 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Stakeholders Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">关键相关方</label>
                   <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_STAKEHOLDERS.map(stk => {
                      const active = isSelected('stakeholders', stk);
                      return (
                        <button 
                          key={stk}
                          onClick={() => toggleTextItem('stakeholders', stk)}
                          className={`text-[11px] px-2.5 py-1 rounded-md border transition-all duration-200 ${
                             active 
                            ? 'bg-slate-800 border-slate-800 text-white shadow-md transform scale-105' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {stk}
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative group">
                    <Users2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="其他利益相关者..."
                      value={formData.stakeholders}
                      onChange={(e) => onChange('stakeholders', e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-b border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-800 placeholder:font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Visual Maturity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">组织生命周期</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {maturityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onChange('orgMaturity', option.value)}
                      className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between h-20 relative overflow-hidden group ${
                        formData.orgMaturity === option.value
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-100 shadow-md'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full relative z-10">
                         {React.createElement(option.icon, { 
                          className: `w-4 h-4 ${formData.orgMaturity === option.value ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-400'}` 
                        })}
                        {formData.orgMaturity === option.value && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                      </div>
                      
                      <div className="relative z-10 text-left">
                        <div className={`text-xs font-bold ${formData.orgMaturity === option.value ? 'text-slate-900' : 'text-slate-600'}`}>
                          {option.label}
                        </div>
                        <div className="text-[9px] opacity-70 leading-none mt-0.5">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: From-To Analysis (The Core) */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden shadow-inner">
                {/* Bridge Visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 hidden md:flex items-center justify-center z-10 bg-white rounded-full border border-slate-200 shadow-sm">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative z-10">
                  {/* FROM: Current State */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-red-100 pb-2 mb-2">
                      <label className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                        现状 (From)
                      </label>
                    </div>
                    
                    {/* Diagnostic Chips */}
                    <div className="flex flex-wrap gap-2">
                       {domain.symptoms && domain.symptoms.map((q, i) => {
                         const active = isSelected('currentState', q);
                         return (
                           <button 
                             key={i}
                             onClick={() => toggleLineItem('currentState', q)}
                             className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-all duration-200 flex items-center ${
                               active 
                               ? 'bg-red-50 border-red-200 text-red-700 font-bold shadow-sm' 
                               : 'bg-white text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-500'
                             }`}
                           >
                             {active ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                             {q}
                           </button>
                         )
                       })}
                    </div>

                    <textarea
                      value={formData.currentState}
                      onChange={(e) => onChange('currentState', e.target.value)}
                      placeholder="描述当前的混乱状态、痛点或具体问题..."
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-white focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none resize-none transition-all text-sm leading-relaxed shadow-sm placeholder:text-slate-300"
                    />
                  </div>

                  {/* TO: Future State */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-2 mb-2">
                      <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                        目标 (To)
                      </label>
                    </div>

                     {/* Outcome Chips */}
                    <div className="flex flex-wrap gap-2">
                       {domain.outcomes && domain.outcomes.map((q, i) => {
                         const active = isSelected('futureState', q);
                         return (
                           <button 
                             key={i}
                             onClick={() => toggleLineItem('futureState', q)}
                             className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-all duration-200 flex items-center ${
                               active 
                               ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm' 
                               : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200 hover:text-emerald-500'
                             }`}
                           >
                             {active ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                             {q}
                           </button>
                         )
                       })}
                    </div>

                    <textarea
                      value={formData.futureState}
                      onChange={(e) => onChange('futureState', e.target.value)}
                      placeholder="描述变革成功后的理想状态、指标或收益..."
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none resize-none transition-all text-sm leading-relaxed shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="bg-white px-8 py-5 border-t border-slate-100 flex justify-between items-center z-20 relative">
              <div className="flex items-center text-xs text-slate-400 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isFormValid ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                {isFormValid ? '数据完整度: 100%' : '等待输入...'}
              </div>
              <button
                onClick={onSubmit}
                disabled={!isFormValid}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-0.5 ${
                  !isFormValid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-slate-900 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 ring-4 ring-slate-50'
                }`}
              >
                <Stethoscope className="w-4 h-4 mr-1" />
                <span>启动智能诊断</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;