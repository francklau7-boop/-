import React, { useState, useEffect } from 'react';
import { BrainCircuit, ChevronRight, Loader2, ArrowRight, Check, Square, CheckSquare, MessageSquarePlus, Sparkles, X } from 'lucide-react';
import { DiagnosticStep } from '../types';

interface ConsultantInquiryProps {
  currentStep: DiagnosticStep | null;
  onAnswer: (answer: string) => void;
  isLoading: boolean;
  stepNumber: number;
  onBack?: () => void;
}

const ConsultantInquiry: React.FC<ConsultantInquiryProps> = ({ 
  currentStep, 
  onAnswer, 
  isLoading,
  stepNumber,
  onBack
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Reset local state when step changes
  useEffect(() => {
    setSelectedOptions([]);
    setCustomInput('');
    setShowCustom(false);
  }, [currentStep]);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = () => {
    const parts = [];
    if (selectedOptions.length > 0) {
      parts.push(`已选情况：${selectedOptions.join('; ')}`);
    }
    if (customInput.trim()) {
      parts.push(`补充说明：${customInput.trim()}`);
    }

    if (parts.length > 0) {
      onAnswer(parts.join('\n'));
    }
  };

  const hasSelection = selectedOptions.length > 0 || customInput.trim().length > 0;

  if (!currentStep && isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-800">
          顾问正在分析您的回答...
        </h3>
        <p className="text-slate-500 mt-2">正在构建下一个关键问题</p>
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="max-w-3xl mx-auto animate-slide-up pb-12">
      <div className="mb-6">
          <button 
            onClick={onBack}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center transition-colors uppercase tracking-widest"
          >
            <span className="mr-1">&larr;</span> {stepNumber > 1 ? "返回上一题" : "修改初始设定"}
          </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-100">
          Diagnostic Question {stepNumber}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col">
        {/* Question Header */}
        <div className="p-8 md:p-10 text-center border-b border-slate-100 bg-white z-10">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
             <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {currentStep.question}
          </h2>
          <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-medium">
            ( 多选 / MULTI-SELECT )
          </p>
        </div>

        {/* Options Body */}
        <div className="p-6 md:p-8 bg-slate-50/50 space-y-3 flex-1">
          {currentStep.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <button
                key={idx}
                onClick={() => toggleOption(option)}
                disabled={isLoading}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group flex items-start justify-between ${
                    isSelected 
                    ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' 
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mt-0.5 mr-4 transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-400'}`}>
                      {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </div>
                  <span className={`font-medium text-sm md:text-base leading-relaxed ${isSelected ? 'text-blue-900 font-semibold' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Enhanced Custom Input Section */}
          <div className="transition-all duration-300 pt-2">
            {!showCustom ? (
                <button
                onClick={() => setShowCustom(true)}
                className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center group"
                >
                    <MessageSquarePlus className="w-5 h-5 text-indigo-500 mr-3 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                        <span className="block text-sm font-bold text-indigo-700">我有具体补充细节 (可选)</span>
                        <span className="block text-xs text-indigo-400 mt-0.5">提供具体场景/数据，让诊断更精准</span>
                    </div>
                </button>
            ) : (
                <div className="mt-4 animate-fade-in bg-indigo-50/50 p-5 rounded-xl border border-indigo-200 relative">
                    <button 
                        onClick={() => setShowCustom(false)} 
                        className="absolute top-3 right-3 text-indigo-300 hover:text-indigo-600 hover:bg-indigo-100 rounded-full p-1 transition-colors"
                        title="收起"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start mb-3">
                        <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-indigo-900">补充关键背景</h4>
                            <p className="text-xs text-indigo-600 mt-1 leading-relaxed">
                                <span className="font-bold">非必填</span>。但如果您能提供具体的<strong>业务场景</strong>、<strong>数据指标</strong>或<strong>痛点案例</strong>，小唯能为您生成更“一针见血”的诊断方案。
                            </p>
                        </div>
                    </div>

                    <textarea 
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="例如：'虽然名义上是扁平化，但实际汇报线很混乱...' 或者 '具体数据是：核心技术岗位的流失率高达25%...'"
                        className="w-full p-4 text-sm rounded-lg border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 min-h-[100px] shadow-sm"
                        autoFocus
                    />
                </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-end items-center sticky bottom-0 z-20">
            <div className="flex items-center mr-4 text-xs text-slate-400 font-medium">
                {selectedOptions.length > 0 && (
                    <span className="text-blue-600 animate-fade-in bg-blue-50 px-2 py-1 rounded">
                        已选 {selectedOptions.length} 项
                    </span>
                )}
                {customInput.trim().length > 0 && (
                    <span className="text-indigo-600 animate-fade-in bg-indigo-50 px-2 py-1 rounded ml-2">
                        包含补充细节
                    </span>
                )}
            </div>
            <button
                onClick={handleSubmit}
                disabled={!hasSelection || isLoading}
                className={`flex items-center px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all transform ${
                    hasSelection && !isLoading
                    ? 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
            >
                <span>确认并继续</span>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                    <ArrowRight className="w-4 h-4 ml-2" />
                )}
            </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantInquiry;