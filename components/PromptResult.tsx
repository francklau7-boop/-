import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCheck, ArrowLeft, Download, Bot, Send, User, RefreshCw, FileText, FileType } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RefineType } from '../types';
import VesynAvatar from './VesynAvatar';

interface PromptResultProps {
  content: string;
  onReset: () => void;
  onRefine: (instruction: string | RefineType) => void; 
  onRunConsultant: () => void;
  isRefining: boolean;
}

interface ChatMessage {
  role: 'user' | 'architect';
  text: string;
}

const PromptResult: React.FC<PromptResultProps> = ({ content, onReset, onRefine, onRunConsultant, isRefining }) => {
  const [copied, setCopied] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'architect', text: '我是小唯。我已经为你构建了专属的虚拟执行顾问指令集 (Meta-Prompt)。在启动前，你可以要求我进行微调。' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Extract code for copy/download
  const codeBlockMatch = content.match(/```markdown([\s\S]*?)```/);
  const codeToCopy = codeBlockMatch ? codeBlockMatch[1].trim() : content;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([codeToCopy], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vesyn_Strategy_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadWord = () => {
    // Wrap markdown code in pre tag for word to preserve some structure, or just raw text
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Vesyn Strategy Prompt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 10pt; }
        pre { background-color: #f4f4f4; padding: 10px; white-space: pre-wrap; }
      </style>
      </head><body>
      <h1>Vesyn Meta-Prompt Strategy</h1>
      <pre>${codeToCopy}</pre>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vesyn_Strategy_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || isRefining) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    
    onRefine(userMsg);
  };

  const handleQuickAction = (type: RefineType, label: string) => {
    setChatHistory(prev => [...prev, { role: 'user', text: label }]);
    onRefine(type);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up pb-10 px-4 sm:px-6 lg:px-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 no-print">
        <button 
          onClick={onReset}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors group text-sm"
        >
          <div className="p-1.5 rounded-full bg-white border border-slate-200 mr-2 group-hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>返回</span>
        </button>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto relative">
           <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="hidden sm:flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                下载指令集
              </button>
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
                  <button onClick={handleDownloadMD} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs text-slate-700 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-slate-400" /> Markdown (.md)
                  </button>
                  <button onClick={handleDownloadWord} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs text-slate-700 flex items-center border-t border-slate-50">
                    <FileType className="w-4 h-4 mr-2 text-blue-500" /> Word (.doc)
                  </button>
                </div>
              )}
            </div>
          
          <button 
            onClick={handleCopy}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
              copied 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
            {copied ? '已复制' : '复制'}
          </button>

          <button 
            onClick={onRunConsultant}
            className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg hover:bg-slate-800 hover:scale-105 transition-all"
          >
            <Bot className="w-3.5 h-3.5 mr-2" />
            启动虚拟执行顾问
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Column: Document Viewer (8 cols) */}
        <div className="lg:col-span-8 h-full flex flex-col print-content">
            <div className={`bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full transition-all duration-300 ${isRefining ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
                {/* Header */}
                <div className="bg-[#f8fafc] border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center">
                      <div className="mr-3">
                         <VesynAvatar size="sm" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">核心执行指令集 (Meta-Prompt)</h2>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Xiao Wei Strategy Artifact</p>
                      </div>
                  </div>
                  {isRefining && (
                    <div className="flex items-center text-xs text-blue-600 font-medium animate-pulse bg-blue-50 px-3 py-1 rounded-full no-print">
                       <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                       小唯正在优化指令...
                    </div>
                  )}
                </div>

                {/* Content */}
                <div id="prompt-result-content" className={`flex-1 overflow-y-auto p-8 prose prose-slate max-w-none 
                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900
                    prose-h1:text-xl prose-h2:text-lg 
                    prose-p:text-slate-600 prose-p:text-sm prose-p:leading-relaxed
                    prose-pre:bg-[#1e293b] prose-pre:text-slate-50 prose-pre:text-xs prose-pre:rounded-xl prose-pre:p-4 prose-pre:shadow-inner
                    prose-code:text-blue-600 prose-code:font-mono prose-code:text-xs
                    transition-opacity duration-300 ${isRefining ? 'opacity-50' : 'opacity-100'}`}>
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-disc pl-5 marker:text-blue-400" {...props} />,
                            ol: ({node, ...props}) => <ol className="space-y-2 my-4 list-decimal pl-5 marker:text-blue-600 marker:font-bold" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>

        {/* Right Column: Architect Copilot Chat (4 cols) */}
        <div className="lg:col-span-4 h-full flex flex-col no-print">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <VesynAvatar size="sm" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">小唯顾问</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30" ref={scrollRef}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'user' ? 'bg-slate-200 ml-2' : ''}`}>
                      {msg.role === 'user' ? <User className="w-3 h-3 text-slate-500" /> : <VesynAvatar size="sm" />}
                    </div>
                    <div className={`p-3 text-xs leading-relaxed rounded-xl ${
                      msg.role === 'user' 
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tr-none' 
                        : 'bg-slate-900 text-slate-100 shadow-md rounded-tl-none ml-2'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isRefining && (
                <div className="flex justify-start">
                   <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-tl-none ml-8 shadow-sm">
                      <div className="flex space-x-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                      </div>
                      <span className="text-xs text-slate-500">小唯正在思考...</span>
                   </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              
              {/* Quick Chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                <button onClick={() => handleQuickAction('STRICTER', '请更严谨一点')} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-[10px] text-slate-600 font-medium transition-colors">
                  ⚖️ 更严谨
                </button>
                <button onClick={() => handleQuickAction('EMPATHETIC', '请更具同理心')} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-[10px] text-slate-600 font-medium transition-colors">
                  ❤️ 更温情
                </button>
                <button onClick={() => handleQuickAction('RISK_FOCUSED', '侧重风险控制')} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-[10px] text-slate-600 font-medium transition-colors">
                  🛡️ 控风险
                </button>
                <button onClick={() => handleQuickAction('TACTICAL', '侧重落地执行')} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-[10px] text-slate-600 font-medium transition-colors">
                  ⚡ 重执行
                </button>
              </div>

              {/* Input Box */}
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="输入修改指令..."
                  disabled={isRefining}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs text-slate-800 placeholder:text-slate-400 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isRefining}
                  className="absolute right-2 top-2 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptResult;