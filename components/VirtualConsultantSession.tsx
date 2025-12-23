import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, User, Loader2, FileText, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { ChatMessage } from '../types';
import VesynAvatar from './VesynAvatar';

interface VirtualConsultantSessionProps {
  systemPrompt: string;
  onExit: () => void;
  domainTitle: string;
}

const VirtualConsultantSession: React.FC<VirtualConsultantSessionProps> = ({ 
  systemPrompt, 
  onExit,
  domainTitle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract the core code block from the system prompt if needed
  const corePrompt = systemPrompt.match(/```markdown([\s\S]*?)```/)?.[1]?.trim() || systemPrompt;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize Chat
  useEffect(() => {
    const initChat = async () => {
      setIsInitializing(true);
      
      // Simulate connection delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");
        
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: corePrompt,
            temperature: 0.7,
          }
        });

        setChatSession(chat);
        setIsInitializing(false);
        setIsTyping(true);

        // Explicitly enforce Step-by-Step initialization
        const initMessage = "请启动咨询会话。严格遵守【Step-by-Step】规则：现在仅输出 Step 1 (Alignment) 的内容，然后立刻停止，等待我确认。不要一次性输出后续步骤。";

        const result = await chat.sendMessage({ message: initMessage });
        const responseText = result.text;
        
        if (responseText) {
          setMessages([{ role: 'model', text: responseText }]);
        }
      } catch (error) {
        console.error("Chat Init Error:", error);
        let errorMsg = "与顾问的加密连接中断，请检查网络设置。";
        if (error instanceof Error) {
            errorMsg += ` (${error.message})`;
        }
        setMessages([{ role: 'model', text: errorMsg }]);
      } finally {
        setIsTyping(false);
      }
    };

    initChat();
  }, [corePrompt]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const responseText = result.text;
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("SendMessage Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "小唯暂时无法回应，请重试。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!chatSession) return;
    
    const triggerMsg = "请根据刚才的沟通，输出最终的【执行行动方案】（Action Plan）。包含具体的时间表、责任人和预期成果。";
    setMessages(prev => [...prev, { role: 'user', text: "生成最终行动方案..." }]);
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage({ message: triggerMsg });
      const responseText = result.text;
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
        console.error("GenerateReport Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "方案生成中断。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm flex-shrink-0 relative z-20">
        <div className="flex items-center space-x-4">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center">
            <VesynAvatar size="md" />
            <div className="ml-3">
              <h2 className="text-sm font-bold text-slate-900 leading-none">小唯 | 资深组织咨询顾问</h2>
              <p className="text-[10px] text-slate-500 flex items-center mt-1 uppercase tracking-wider font-semibold">
                Strategic Partner • {domainTitle}
              </p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          className="hidden sm:flex items-center px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 mr-2" />
          生成行动方案
        </button>
      </div>

      {/* Connection Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-800 animate-pulse uppercase tracking-widest">
            正在建立咨询会晤通道...
          </p>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            小唯正在载入您的组织全景图...
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-[#f8f9fa] relative scroll-smooth">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.02]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900 rounded-full blur-[100px]"></div>
         </div>

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
           {!isInitializing && (
             <div className="flex justify-center">
                <div className="bg-slate-200/50 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center border border-slate-200">
                  <ShieldCheck className="w-3 h-3 mr-1.5" />
                  顾问服务协议已激活 (Secured)
                </div>
             </div>
           )}
           
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start group'}`}>
               <div className={`flex max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 
                 {/* Avatar */}
                 <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-white ml-3 border border-slate-100' : 'mr-3'}`}>
                   {msg.role === 'user' ? <User className="w-5 h-5 text-slate-400" /> : <VesynAvatar size="md" />}
                 </div>

                 {/* Bubble */}
                 <div className={`p-5 text-sm leading-7 shadow-sm transition-all duration-300 ${
                   msg.role === 'user' 
                     ? 'bg-white text-slate-800 rounded-2xl rounded-tr-sm border border-slate-200' 
                     : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200'
                 }`}>
                   {msg.role === 'model' && (
                     <div className="mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                        小唯咨询团队
                     </div>
                   )}
                   <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-li:my-0.5 prose-strong:text-slate-900">
                     <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({node, ...props}) => (
                            <div className="overflow-x-auto my-3 -mx-1 sm:mx-0 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-slate-50/30">
                              <table className="w-full text-left border-collapse text-xs sm:text-sm" {...props} />
                            </div>
                          ),
                          thead: ({node, ...props}) => <thead className="bg-slate-100/80 border-b border-slate-200" {...props} />,
                          th: ({node, ...props}) => <th className="px-3 py-2.5 font-bold text-slate-700 uppercase tracking-wider text-[10px] sm:text-xs whitespace-nowrap" {...props} />,
                          td: ({node, ...props}) => <td className="px-3 py-2.5 border-b border-slate-100 text-slate-600 last:border-0 align-top bg-white" {...props} />,
                          tr: ({node, ...props}) => <tr className="hover:bg-blue-50/20 transition-colors" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2 marker:text-slate-400" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mb-2 marker:text-slate-500" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        }}
                     >
                        {msg.text}
                     </ReactMarkdown>
                   </div>
                 </div>
               </div>
             </div>
           ))}

           {isTyping && (
             <div className="flex justify-start animate-fade-in">
               <div className="flex max-w-[80%] flex-row">
                 <div className="flex-shrink-0 w-10 h-10 mr-3">
                    <VesynAvatar size="md" />
                 </div>
                 <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                 </div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sm:p-6 flex-shrink-0 relative z-20">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="回复顾问 (Enter 发送)..."
            className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none resize-none h-[64px] max-h-[120px] transition-all text-sm font-medium shadow-inner"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-2 p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-3 flex justify-center sm:hidden">
            <button 
                onClick={handleGenerateReport}
                className="text-xs text-slate-500 font-bold border-b border-slate-300 pb-0.5"
            >
                生成行动方案
            </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualConsultantSession;