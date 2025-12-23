import React from 'react';
import { HistorySession } from '../types';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  sessions: HistorySession[];
  onSelectSession: (session: HistorySession) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  sessions, 
  onSelectSession, 
  onClearHistory, 
  isOpen, 
  onClose 
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            历史会话记录
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">暂无生成记录。</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => {
                  onSelectSession(session);
                  onClose(); // Auto close on mobile
                }}
                className="group p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all relative"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    {session.domainId}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-1">
                  {session.subTaskLabel || session.domainTitle}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {session.formData.challenge}
                </p>
              </div>
            ))
          )}
        </div>

        {sessions.length > 0 && (
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={onClearHistory}
              className="w-full flex items-center justify-center py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              清空所有记录
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistorySidebar;