import React from 'react';
import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    UploadCloud,
    Phone,
    PieChart,
    ShieldCheck,
    Users,
} from 'lucide-react';

interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    analysisMode?: 'new' | 'aggregate';
    onToggleMode?: (mode: 'new' | 'aggregate') => void;
}

const navItems = [
    // Keep only production-ready tabs visible for now.
    { id: 'desible-dashboard', label: 'Call Analytics', icon: LayoutDashboard },
    { id: 'call-explorer', label: 'Call Explorer', icon: Phone },
    { id: 'sankey-charts', label: 'Sankey Charts', icon: PieChart },
    { id: 'llm-judge-observability', label: 'LLM as a Judge', icon: ShieldCheck },
    { id: 'transcript-upload', label: 'Add Transcripts', icon: UploadCloud },
];

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    onViewChange,
    analysisMode = 'new',
    onToggleMode,
}) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col z-50">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">D</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">Desible</h1>
                        <p className="text-[10px] text-gray-400 leading-tight">AI Call Analytics</p>
                    </div>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                        onClick={() => onToggleMode?.('new')}
                        className={cn(
                            "flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                            analysisMode === 'new'
                                ? "bg-orange-500 text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        New
                    </button>
                    <button
                        onClick={() => onToggleMode?.('aggregate')}
                        className={cn(
                            "flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                            analysisMode === 'aggregate'
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Aggregate
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                                isActive
                                    ? 'bg-orange-50 text-orange-600 font-semibold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            )}
                        >
                            <Icon size={18} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                        <Users size={14} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">Desible.ai</p>
                        <p className="text-[10px] text-gray-400">Analytics Platform</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

