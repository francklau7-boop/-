import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, RefreshCw, User, Send, Download, FileText, FileType } from 'lucide-react';
import VesynAvatar from './VesynAvatar';

interface DiagnosticReportProps {
  reportContent: string;
  onProceed: () => void;
  onRefine: (instruction: string) => void;
  isRefining: boolean;
  onBack?: () => void;
}

interface ChatMessage {
  role: 'user' | 'architect';
  text: string;
}

const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ reportContent, onProceed, onRefine, isRefining, onBack }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'architect', text: '我是小唯。这是我为你起草的战略诊断书。请审阅，如有需要调整的地方（例如语气、侧重点），请直接告知我。' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || isRefining) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    
    onRefine(userMsg);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vesyn_Report_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Vesyn Diagnostic Report</title>
      <style>
        body { font-family: 'Calibri', sans-serif; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1, h2, h3 { color: #2e74b5; }
      </style>
      </head><body>${document.getElementById('report-content-body')?.innerHTML || ''}</body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vesyn_Report_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back Button for Report Page */}
      <div className="mb-6 no-print">
          <button 
            onClick={onBack}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center transition-colors uppercase tracking-widest"
          >
            <span className="mr-1">&larr;</span> 重新进行诊断
          </button>
      </div>

      {/* Top Controls Area */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 no-print">
         <div className="flex items-center">
            <VesynAvatar size="md" className="mr-4" />
            <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">
                  小唯 | 组织进化诊断书
                </h2>
                <p className="text-xs text-slate-500 font-mono tracking-wider uppercase mt-1">Xiao Wei • Senior Consultant</p>
            </div>
         </div>
         <div className="flex items-center space-x-3 w-full md:w-auto relative">
            <div className="relative">
              <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="hidden md:flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs"
              >
                  <Download className="w-4 h-4 mr-2" />
                  导出报告
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
                onClick={onProceed}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 group shadow-lg text-sm"
            >
                <span>认可并生成执行顾问</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* Left Column: Report Viewer (8 cols) */}
        <div className="lg:col-span-8 h-full flex flex-col print-content">
           <div className={`bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full relative transition-all duration-300 ${isRefining ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
             
              {/* Status Bar */}
              {isRefining && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-blue-50/95 backdrop-blur border-b border-blue-100 px-6 py-2 flex items-center justify-center text-xs text-blue-700 font-bold animate-pulse no-print">
                   <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                   小唯正在重构逻辑...
                </div>
              )}

              {/* Report Body (Scrollable) */}
              <div className={`flex-1 overflow-y-auto p-8 md:p-12 bg-white relative transition-opacity duration-300 ${isRefining ? 'opacity-50' : 'opacity-100'}`}>
                    <div id="report-content-body" className="prose prose-slate max-w-none 
                        prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 
                        prose-h1:text-2xl prose-h1:border-b prose-h1:border-slate-100 prose-h1:pb-4 prose-h1:mb-8
                        prose-h2:text-lg prose-h2:text-blue-900 prose-h2:mt-10 prose-h2:mb-5 prose-h2:uppercase prose-h2:tracking-wider prose-h2:flex prose-h2:items-center prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-3
                        prose-h3:text-base prose-h3:font-bold prose-h3:text-slate-800 prose-h3:mt-6 prose-h3:mb-2
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm prose-p:my-3
                        prose-li:text-slate-600 prose-li:marker:text-blue-500 prose-li:text-sm
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-blockquote:font-medium prose-blockquote:my-6
                        relative z-10"
                    >
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-disc pl-5 marker:text-blue-400" {...props} />,
                                ol: ({node, ...props}) => <ol className="space-y-2 my-4 list-decimal pl-5 marker:text-blue-600 marker:font-bold" {...props} />,
                            }}
                        >
                            {reportContent}
                        </ReactMarkdown>
                    </div>
              </div>
           </div>
        </div>

        {/* Right Column: Copilot Chat (4 cols) */}
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

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="与小唯沟通修改意见..."
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

export default DiagnosticReport;