import React from 'react';
import { Layout, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
    activeView: string;
    onViewChange: (view: string) => void;
    onNewAnalysis: () => void;
    hasAnalysis: boolean;
    analysisMode?: 'new' | 'aggregate';
    onToggleMode?: (mode: 'new' | 'aggregate') => void;
}

const Header: React.FC<HeaderProps> = ({
    activeView,
    onViewChange,
    onNewAnalysis,
    hasAnalysis,
    analysisMode = 'new',
    onToggleMode
}) => {
    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'desible-dashboard', label: 'Call Analytics' },
        { id: 'intent-dashboard', label: 'Semantic Discovery' },
        { id: 'intent-flow', label: 'Intent Flow' },
        { id: 'sentiment-analytics', label: 'Sentiment' },
        { id: 'objection-intel', label: 'Objections' },
        { id: 'sales-funnel', label: 'Sales Funnel' },
        { id: 'call-explorer', label: 'Call Explorer' },
        { id: 'state-graph', label: 'State Graph' },
        { id: 'sankey-charts', label: 'Sankey Charts' },
        { id: 'transcript-upload', label: 'Add Transcripts' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => onViewChange('upload')}
                    >
                        <div className="p-2 bg-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                            <Layout className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Desible
                        </h1>
                    </div>

                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === item.id
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Analysis Mode Toggle */}
                        <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => onToggleMode?.('new')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                    analysisMode === 'new'
                                        ? "bg-indigo-500 text-white shadow-lg"
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                New
                            </button>
                            <button
                                onClick={() => onToggleMode?.('aggregate')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                    analysisMode === 'aggregate'
                                        ? "bg-emerald-500 text-white shadow-lg"
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                Aggregate
                            </button>
                        </div>

                        {hasAnalysis && (
                            <button
                                onClick={onNewAnalysis}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-all border border-white/10"
                            >
                                <PlusCircle size={16} />
                                New Analysis
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
