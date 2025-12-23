import React from 'react';
import { Domain } from '../types';
import { ChevronRight, Brain } from 'lucide-react';

interface DomainCardProps {
  domain: Domain;
  onClick: (domain: Domain) => void;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain, onClick }) => {
  const Icon = domain.icon;

  return (
    <div 
      onClick={() => onClick(domain)}
      className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${domain.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className={`p-3.5 rounded-xl ${domain.color} bg-opacity-10 text-${domain.color.replace('bg-', '')} ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 text-slate-800`} /> 
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          选择领域
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors tracking-tight">
        {domain.title}
      </h3>
      
      <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
        {domain.description}
      </p>

      <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center text-xs font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span>
            方法论: <span className="ml-1 text-slate-800">{domain.methodology}</span>
        </div>
        <div className="flex items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Brain className="w-3 h-3 mr-2 text-slate-300" />
            模型: {domain.mentalModel.split(' ')[0]}...
        </div>
      </div>
    </div>
  );
};

export default DomainCard;